## Magnetic Compass Cursor

This script hides the default mouse, displays a compass arrow that physically rotates in the direction you move your mouse, and "magnetically" snaps to the center of any links or buttons you hover over.

### 1. HTML (Add this right before your `</body>` tag)
```html
<!-- Custom Magnetic Compass Cursor -->
<div id="magnetic-cursor">
    <svg class="compass-arrow" viewBox="0 0 24 24" width="28" height="28">
        <!-- A sleek, sharp compass needle -->
        <path d="M12 2L19 21l-7-4-7 4 7-19z" fill="currentColor"/>
    </svg>
</div>
```

### 2. CSS (Add to styles.css)
```css
/* Hide default cursor globally */
body {
    cursor: none;
}

/* Ensure links/buttons override default cursors too */
a, button, .icon-btn, .btn {
    cursor: none !important;
}

#magnetic-cursor {
    position: fixed;
    top: 0;
    left: 0;
    width: 28px;
    height: 28px;
    pointer-events: none; /* Let clicks pass through to UI underneath */
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    will-change: transform;
}

.compass-arrow {
    color: var(--color-primary);
    transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
}
```

### 3. JavaScript (Add to script.js and call inside `initializeApp()`)
```javascript
function initMagneticCompassCursor() {
    const cursor = document.getElementById('magnetic-cursor');
    if (!cursor) return;
    
    const arrow = cursor.querySelector('.compass-arrow');
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    
    let isMagnetic = false;
    let magneticX = 0;
    let magneticY = 0;

    // Track global mouse position and arrow rotation
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Rotate the compass needle to point in the direction of traversal
        if (!isMagnetic) {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            // Only rotate if moving fast enough to avoid jitter
            if (Math.abs(dx) > 1.5 || Math.abs(dy) > 1.5) {
                // +90 to align the upward-pointing SVG with standard math angles
                const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90; 
                arrow.style.transform = `rotate(${angle}deg)`;
            }
        }
    });

    // Setup Magnetic hover states for interactive elements
    const magneticElements = document.querySelectorAll('a, button, input, .icon-btn, .project-card');
    
    magneticElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            isMagnetic = true;
            // Get center coordinates of the target element
            const rect = el.getBoundingClientRect();
            magneticX = rect.left + rect.width / 2;
            magneticY = rect.top + rect.height / 2;
            
            // Snap needle upward and scale it up when magnetic
            arrow.style.transform = `rotate(0deg) scale(1.3)`; 
            arrow.style.color = "var(--color-text)"; // Optional hover color change
        });
        
        el.addEventListener('mouseleave', () => {
            isMagnetic = false;
            arrow.style.transform = `rotate(0deg) scale(1)`;
            arrow.style.color = "var(--theme-primary)";
        });
    });

    // The Animation Loop (Lerp for smooth floating effect)
    const loop = () => {
        const targetX = isMagnetic ? magneticX : mouseX;
        const targetY = isMagnetic ? magneticY : mouseY;
        
        // Faster snap when magnetic, smoother floating when traversing
        const speed = isMagnetic ? 0.3 : 0.15;
        
        cursorX += (targetX - cursorX) * speed;
        cursorY += (targetY - cursorY) * speed;
        
        // Center the 28x28 box exactly over coordinates (-14px)
        cursor.style.transform = `translate(${cursorX - 14}px, ${cursorY - 14}px)`;
        
        requestAnimationFrame(loop);
    };
    
    loop();
}
```

This uses **Linear Interpolation (Lerp)** inside a `requestAnimationFrame` loop, resulting in a buttery-smooth trailing effect. The `Math.atan2` function constantly computes the exact angle between your current mouse vector and your previous mouse vector, making the needle physically point wherever you're moving!
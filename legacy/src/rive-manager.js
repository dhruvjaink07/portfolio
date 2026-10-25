import { Rive, Layout, Fit, Alignment } from '@rive-app/canvas';

export function initRive() {
    console.log('Initializing Rive animations...');
    
    // Function to safely initialize a Rive canvas if it exists
    const loadRive = (elementId, srcPath) => {
        const canvasEl = document.getElementById(elementId);
        if (canvasEl) {
            try {
                new Rive({
                    src: srcPath,
                    canvas: canvasEl,
                    autoplay: true,
                    layout: new Layout({
                        fit: Fit.Contain, // Important for icons so they don't clip
                        alignment: Alignment.Center
                    })
                });
            } catch (e) {
                console.error(`Failed to load Rive for ${elementId}`, e);
            }
        }
    };

    // 1. Main Avatar Rive (Reverted to image)
    // loadRive('rive-avatar-canvas', 'https://public.rive.app/community/runtime-files/2191-4327-player-character.riv');
    
    // 2. Navigation icons (Placeholder for custom animated icons)
    const navIds = ['rive-nav-home', 'rive-nav-projects', 'rive-nav-skills', 'rive-nav-contact'];
    navIds.forEach(id => loadRive(id, 'https://cdn.rive.app/animations/rating_animation.riv'));

    // 3. Social Media icons (Delayed initialization since they are injected via JS)
    setTimeout(() => {
        const socialIds = ['rive-social-github', 'rive-social-linkedin', 'rive-social-twitter', 'rive-social-instagram'];
        socialIds.forEach(id => loadRive(id, 'https://cdn.rive.app/animations/rating_animation.riv'));
    }, 500); 
}

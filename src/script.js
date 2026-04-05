import { prepare, layout } from '@chenglou/pretext';
import VanillaTilt from 'vanilla-tilt';
import portfolioData from '../data.json';

// ===================================
// SHARED ASSETS & CONSTANTS
// ===================================
const SOCIAL_ICONS = {
    twitter: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>`,
    linkedin: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`,
    github: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>`,
    instagram: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`
};

// ===================================
// APP INITIALIZATION
// ===================================
function initializeApp() {
    if (!portfolioData) return;

    // Render all pages
    renderHomePage();
    renderProjectsPage();
    renderSkillsPage();
    renderContactPage();

    // Setup Navigation, Theming, and Observers
    setupNavigation();
    setupThemeToggle();
    setupScrollAnimations();
    
    // Setup project filters
    setupProjectFilters();

    // Setup contact form
    setupContactForm();

    // Setup search functionality
    setupSearch();
    
    // Setup Download CV button
    setupDownloadCV();
    
    // Setup smooth scrolling for hash navigation
    setupHashNavigation();
    
    // Setup external links
    setupExternalLinks();
}

// ===================================
// THEMING (Dark/Light mode)
// ===================================
function setupThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    const sunIcon = themeBtn.querySelector('.sun-icon');
    const moonIcon = themeBtn.querySelector('.moon-icon');

    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    });
}

// ===================================
// SCROLL ANIMATIONS / INTERSECTION
// ===================================
function setupScrollAnimations() {
    // Add fade-in hooks to items
    const staggerItems = document.querySelectorAll(
        '.project-card, .skill-card, .section-card, .endorsement-card, .experience-item, .page-title, .page-subtitle'
    );
    staggerItems.forEach(el => el.classList.add('fade-in'));

    // Check if device supports hover (desktop) vs touch (mobile)
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a small delay based on index to create a stagger effect on load
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    
                    // Initialize tilt ONLY if it's a desktop/hover-capable device
                    // VanillaTilt feels clunky/sticky on mobile touch screens
                    if (!isTouchDevice) {
                        if(entry.target.classList.value.includes('project-card') || entry.target.classList.value.includes('skill-card')) {
                            VanillaTilt.init(entry.target, {
                                max: 12,
                                speed: 400,
                                glare: true,
                                "max-glare": 0.2,
                            });
                        }
                    }
                }, index * 50);
                
                // Stop observing once faded in to avoid repeated animations 
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // element 10% visible
        rootMargin: '0px 0px -50px 0px' 
    });

    staggerItems.forEach(el => observer.observe(el));
}

// ===================================
// NAVIGATION
// ===================================
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.page');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function navigateToPage(page) {
    const targetSection = document.getElementById(page);
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===================================
// HOME PAGE RENDERING
// ===================================
function renderHomePage() {
    const { profile, workExperience, endorsements, topSkills } = portfolioData;

    // Profile Image - formalized without broken webp source
    const profileImageContainer = document.getElementById('profile-image');
    if (profileImageContainer) {
        profileImageContainer.style.backgroundImage = '';
        profileImageContainer.innerHTML = `
            <img src="${profile.image.startsWith('/') ? profile.image : '/' + profile.image}" 
                 alt="${profile.name} Profile" 
                 loading="eager" 
                 width="180" 
                 height="240" 
                 style="object-fit: cover; width: 100%; height: 100%;">
        `;
    }

    // Header avatars
    ['header-avatar', 'projects-avatar', 'skills-avatar'].forEach(id => {
        const avatar = document.getElementById(id);
        if (avatar) {
            avatar.style.backgroundImage = `url('${profile.image}')`;
        }
    });

    // Profile Info
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-title').textContent = profile.title;
    
    // Bio Text using pretext for calculating text height and pre-allocating space to prevent CLS
    const bioElement = document.getElementById('profile-bio');
    bioElement.textContent = profile.bio;
    
    // Defer pretext calculation to run immediately after DOM mounts so width is known
    requestAnimationFrame(() => {
        const computed = getComputedStyle(bioElement);
        // Canvas measureText ideally needs explicit pixel sizing for precision
        const fontStr = `${computed.fontSize} ${computed.fontFamily}`;
        const bioWidth = bioElement.clientWidth || 300;
        const lineHeight = parseFloat(computed.lineHeight) || 24.32;
        
        try {
            const prepared = prepare(profile.bio, fontStr);
            const { height } = layout(prepared, bioWidth, lineHeight);
            // Pin the exact height to prevent layout shifts
            bioElement.style.height = `${height}px`;
        } catch (error) {
            console.error('Pretext calculation failed:', error);
        }
    });

    // Social Links
    const socialLinks = document.getElementById('social-links');

    socialLinks.innerHTML = Object.entries(profile.social).map(([platform, url]) => `
        <a href="${url}" class="social-link" target="_blank" rel="noopener">
            ${SOCIAL_ICONS[platform]}
        </a>
    `).join('');

    // Work Experience
    const experienceList = document.getElementById('experience-list');
    if (experienceList) {
        experienceList.innerHTML = workExperience.map(exp => `
            <div class="experience-item">
                <div class="experience-header">
                    <div class="experience-icon">�</div>
                    <div class="experience-details">
                        <h4>${exp.role}</h4>
                        <p class="experience-company">${exp.company}</p>
                        <p class="experience-period">${exp.period}</p>
                    </div>
                </div>
                <p class="experience-description">${exp.description}</p>
            </div>
        `).join('');
    }

    // Education
    const educationList = document.getElementById('education-list');
    if (educationList) {
        educationList.innerHTML = portfolioData.education.map(edu => `
            <div class="experience-item">
                <div class="experience-header">
                    <div class="experience-icon">🎓</div>
                    <div class="experience-details">
                        <h4>${edu.degree}</h4>
                        <p class="experience-company">${edu.institution}</p>
                        <p class="experience-period">${edu.period}</p>
                    </div>
                </div>
                <p class="experience-description">${edu.description}</p>
            </div>
        `).join('');
    }

    // Endorsements
    const endorsementsSection = document.querySelector('.left-column .section-card');
    const endorsementsGrid = document.getElementById('endorsements-grid');
    
    if (portfolioData.settings && portfolioData.settings.showEndorsements) {
        endorsementsSection.style.display = 'block';
        endorsementsGrid.innerHTML = endorsements.map((endorsement, index) => {
            const isFeatured = index === 0;
            return `
                <div class="endorsement-card ${isFeatured ? 'featured' : ''}">
                    <div class="endorsement-header">
                        <div class="endorser-info">
                            <h4>${endorsement.name}</h4>
                            <p class="endorser-title">${endorsement.title}</p>
                        </div>
                        ${endorsement.verified ? '<div class="verified-badge">✓</div>' : ''}
                    </div>
                    <p class="endorsement-text">${endorsement.testimonial}</p>
                    ${isFeatured && endorsement.linkedinRecommendations ? `
                        <div class="endorsement-footer">
                            <button class="references-btn">References</button>
                            <div class="linkedin-stats">
                                <span class="linkedin-count">${endorsement.linkedinRecommendations}</span>
                                <p class="linkedin-label">LinkedIn<br>Recommendations</p>
                                <div class="linkedin-chart">
                                    <svg width="100%" height="40" viewBox="0 0 100 40">
                                        <path d="M 0,30 Q 25,10 50,20 T 100,15" stroke="currentColor" stroke-width="2" fill="none"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    } else {
        endorsementsSection.style.display = 'none';
    }

    // Top Skills
    const topSkillsContainer = document.getElementById('top-skills');
    if (topSkillsContainer) {
        topSkillsContainer.innerHTML = topSkills.map(skill => `
            <span class="skill-badge">${skill}</span>
        `).join('');
    }
}

// ===================================
// PROJECTS PAGE RENDERING
// ===================================
function renderProjectsPage() {
    const { projects } = portfolioData;
    renderProjects(projects);
}

function renderProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card" data-category="${project.category}">
            <div class="project-thumbnail" style="background-color: ${project.color}">
                <span>${project.icon}</span>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `
                        <span class="tech-badge">${tech}</span>
                    `).join('')}
                </div>
                <div class="project-actions">
                    <button class="project-btn" onclick="window.open('${project.demoUrl}', '_blank')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                        LIVE DEMO
                    </button>
                    <button class="project-btn code-btn" onclick="window.open('${project.codeUrl}', '_blank')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="16 18 22 12 16 6"/>
                            <polyline points="8 6 2 12 8 18"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===================================
// PROJECT FILTERING
// ===================================
function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter projects
            filterProjects(filter);
        });
    });
}

function resetProjectFilters() {
    // Show all projects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.display = 'block';
    });

    // Set "All" filter as active
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === 'all') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Remove any "no results" message
    const noResultsMessage = document.querySelector('.no-results-message');
    if (noResultsMessage) {
        noResultsMessage.remove();
    }
}

function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'slideIn 0.3s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===================================
// SKILLS PAGE RENDERING
// ===================================
function renderSkillsPage() {
    const { skills } = portfolioData;

    // Frontend Skills
    const frontendSkills = document.getElementById('frontend-skills');
    frontendSkills.innerHTML = skills.frontend.map(skill => renderSkillCard(skill)).join('');

    // Backend Skills
    const backendSkills = document.getElementById('backend-skills');
    backendSkills.innerHTML = skills.backend.map(skill => renderSkillCard(skill)).join('');

    // Tools Skills
    const toolsSkills = document.getElementById('tools-skills');
    toolsSkills.innerHTML = skills.tools.map(skill => renderSkillCard(skill)).join('');
}

function renderSkillCard(skill) {
    return `
        <div class="skill-card">
            <div class="skill-card-header">
                <div class="skill-icon">${skill.icon}</div>
                <span class="skill-level ${skill.level.toLowerCase()}">${skill.level}</span>
            </div>
            <h4 class="skill-name">${skill.name}</h4>
            <p class="skill-description">${skill.description}</p>
            <div class="skill-footer">
                <button class="view-projects-btn" onclick="viewProjectsBySkill('${skill.name}')">
                    VIEW ${skill.projectCount} PROJECTS
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// ===================================
// CONTACT PAGE RENDERING
// ===================================
function renderContactPage() {
    const { contact, profile } = portfolioData;

    // Contact avatar
    const contactAvatar = document.getElementById('contact-avatar');
    if (contactAvatar) {
        contactAvatar.style.backgroundImage = `url('${profile.image}')`;
    }

    // Contact information
    document.getElementById('contact-email').textContent = contact.email;
    document.getElementById('contact-location').textContent = contact.location;
    document.getElementById('contact-availability').textContent = contact.availability;

    // Email link
    const emailLink = document.getElementById('email-link');
    emailLink.href = `mailto:${contact.email}`;

    // Social links
    const contactSocial = document.getElementById('contact-social');

    contactSocial.innerHTML = Object.entries(profile.social).map(([platform, url]) => `
        <a href="${url}" class="social-link" target="_blank" rel="noopener">
            ${SOCIAL_ICONS[platform]}
        </a>
    `).join('');
}

function setupContactForm() {
    const form = document.getElementById('contact-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    const toast = document.getElementById('form-toast');

    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = `form-toast form-toast-${type} form-toast-show`;
        
        setTimeout(() => {
            toast.classList.remove('form-toast-show');
        }, 5000);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg> Sending...';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showToast('✅ Thank you for your message! I\'ll get back to you soon.', 'success');
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            showToast('❌ Oops! There was a problem. Please email me directly at dhruvkishorjain2508@gmail.com', 'error');
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}

// ===================================
// SKILL TO PROJECT NAVIGATION
// ===================================
function viewProjectsBySkill(skillName) {
    // Navigate to projects page
    navigateToPage('projects');

    // Update navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.dataset.page === 'projects') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Filter projects by skill/technology
    // Need to match the skill name to technologies in projects
    const projectCards = document.querySelectorAll('.project-card');
    let visibleCount = 0;

    projectCards.forEach(card => {
        const technologies = Array.from(card.querySelectorAll('.tech-badge'))
            .map(badge => badge.textContent.toLowerCase());

        // Check if any technology matches the skill name (partial match)
        const skillLower = skillName.toLowerCase();
        const matches = technologies.some(tech =>
            tech.includes(skillLower) ||
            skillLower.includes(tech) ||
            // Handle cases like "React / Next.js" matching "React"
            skillLower.split('/').some(part => tech.includes(part.trim())) ||
            tech.split('/').some(part => skillLower.includes(part.trim()))
        );

        if (matches) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Update filter buttons to show "All" is not active
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));

    // Show no results message if needed
    showNoResults('projects-grid', visibleCount, `No projects found using ${skillName}.`);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================
// SEARCH FUNCTIONALITY
// ===================================
function setupSearch() {
    const searchInputs = document.querySelectorAll('.search-bar input');

    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const activePage = document.querySelector('.page.active');

            if (!activePage) return;

            // Search on Projects page
            if (activePage.id === 'projects-page') {
                searchProjects(query);
            }
            // Search on Skills page
            else if (activePage.id === 'skills-page') {
                searchSkills(query);
            }
            // Search on Home page
            else if (activePage.id === 'home-page') {
                searchHomePage(query);
            }
        });
    });
}

function searchProjects(query) {
    const projectCards = document.querySelectorAll('.project-card');
    let visibleCount = 0;

    projectCards.forEach(card => {
        const title = card.querySelector('.project-title').textContent.toLowerCase();
        const description = card.querySelector('.project-description').textContent.toLowerCase();
        const technologies = Array.from(card.querySelectorAll('.tech-badge'))
            .map(badge => badge.textContent.toLowerCase())
            .join(' ');

        const matches = title.includes(query) ||
            description.includes(query) ||
            technologies.includes(query);

        if (matches || query === '') {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show "no results" message if needed
    showNoResults('projects-grid', visibleCount, 'No projects found matching your search.');
}

function searchSkills(query) {
    const skillCards = document.querySelectorAll('.skill-card');
    let visibleCount = 0;

    skillCards.forEach(card => {
        const name = card.querySelector('.skill-name').textContent.toLowerCase();
        const description = card.querySelector('.skill-description').textContent.toLowerCase();

        const matches = name.includes(query) || description.includes(query);

        if (matches || query === '') {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show "no results" message if needed
    const skillsGrids = document.querySelectorAll('.skills-cards-grid');
    skillsGrids.forEach(grid => {
        const visibleInGrid = Array.from(grid.querySelectorAll('.skill-card'))
            .filter(card => card.style.display !== 'none').length;
        showNoResults(grid.id, visibleInGrid, 'No skills found matching your search.');
    });
}

function searchHomePage(query) {
    // Search in work experience
    const experienceItems = document.querySelectorAll('.experience-item');
    experienceItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        const matches = text.includes(query);

        if (matches || query === '') {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });

    // Search in endorsements
    const endorsementCards = document.querySelectorAll('.endorsement-card');
    endorsementCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const matches = text.includes(query);

        if (matches || query === '') {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });

    // Search in top skills
    const skillBadges = document.querySelectorAll('.skill-badge');
    skillBadges.forEach(badge => {
        const text = badge.textContent.toLowerCase();
        const matches = text.includes(query);

        if (matches || query === '') {
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    });
}

function showNoResults(containerId, visibleCount, message) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Remove existing no-results message
    const existingMessage = container.querySelector('.no-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Add no-results message if nothing is visible
    if (visibleCount === 0) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results-message';
        noResultsDiv.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 3rem; color: #6B7280; font-size: 1.1rem;';
        noResultsDiv.textContent = message;
        container.appendChild(noResultsDiv);
    }
}

// ===================================
// INITIALIZE ON LOAD
// ===================================
document.addEventListener('DOMContentLoaded', initializeApp);

// ===================================
// DOWNLOAD CV FUNCTIONALITY
// ===================================
function setupDownloadCV() {
    const downloadBtn = document.getElementById('download-cv');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const cvUrl = portfolioData.profile.cv;
            // Create a temporary anchor element to trigger download
            const link = document.createElement('a');
            link.href = cvUrl;
            link.download = 'Hillary_Bale_CV.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show feedback
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Downloaded!
            `;
            downloadBtn.disabled = true;
            
            setTimeout(() => {
                downloadBtn.innerHTML = originalText;
                downloadBtn.disabled = false;
            }, 2000);
        });
    }
}

// ===================================
// HASH NAVIGATION
// ===================================
function setupHashNavigation() {
    // Handle initial hash on page load
    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'projects', 'skills', 'contact'].includes(hash)) {
        navigateToPage(hash);
        
        // Update nav link active state
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.dataset.page === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Handle hash changes (browser back/forward)
    window.addEventListener('hashchange', () => {
        const newHash = window.location.hash.substring(1);
        if (newHash && ['home', 'projects', 'skills', 'contact'].includes(newHash)) {
            navigateToPage(newHash);
            
            // Update nav link active state
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (link.dataset.page === newHash) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    });
}

// ===================================
// EXTERNAL LINKS SETUP
// ===================================
function setupExternalLinks() {
    // Setup View LinkedIn button
    const linkedInBtn = document.querySelector('.btn-outline');
    if (linkedInBtn && linkedInBtn.textContent.includes('LinkedIn')) {
        linkedInBtn.addEventListener('click', () => {
            window.open(portfolioData.profile.social.linkedin, '_blank');
        });
    }
    
    // Setup GitHub button in profile
    const githubBtns = document.querySelectorAll('.btn-secondary');
    githubBtns.forEach(btn => {
        if (btn.textContent.includes('GitHub')) {
            btn.addEventListener('click', () => {
                window.open(portfolioData.profile.social.github, '_blank');
            });
        }
    });
}

// ===================================
// CUSTOM MAGNETIC CURSOR
// ===================================
function initCursor() {
    // Only init on non-touch devices
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cursorOutline = document.createElement('div');
    cursorOutline.classList.add('cursor-outline');
    document.body.appendChild(cursorOutline);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let preX = mouseX;
    let preY = mouseY;
    let outlineX = mouseX;
    let outlineY = mouseY;
    let angle = 0;
    
    // Low pass filter for angle to prevent jerky rotation
    let currentAngle = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth trailing outline animation
    function animateCursor() {
        let distX = mouseX - outlineX;
        let distY = mouseY - outlineY;
        
        let moveSpeed = Math.sqrt(distX * distX + distY * distY);
        
        // Calculate angle of movement if there's enough motion
        if (moveSpeed > 1) {
            angle = Math.atan2(distY, distX) * (180 / Math.PI) + 90; // Add 90 to face north to movement
        }
        
        // Lerp angle
        let angleDiff = angle - currentAngle;
        // Normalize angle difference to avoid spinning the long way around
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;
        
        currentAngle += angleDiff * 0.15;
        
        outlineX += distX * 0.15; // easing
        outlineY += distY * 0.15;

        // Apply translate and rotate to compass
        cursorOutline.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg)`;
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Dynamically re-bind hover states when pages swap or JS re-renders
    const observer = new MutationObserver(() => {
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .project-card, .skill-card, .social-link');
        
        interactiveElements.forEach(el => {
            // Guard against duplicate listeners
            if(el.dataset.cursorBound) return;
            el.dataset.cursorBound = "true";

            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('cursor-hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('cursor-hovering');
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Start custom cursor
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initCursor, 100);
    // Initialize Easter Egg Terminal
    initTerminal();
});

// ===================================
// EASTER EGG TERMINAL COMMANDS
// ===================================
function initTerminal() {
    const terminalOverlay = document.getElementById('dev-terminal');
    const terminalInput = document.getElementById('term-input');
    const terminalBody = document.getElementById('term-body');
    const terminalCloseBtn = document.getElementById('term-close');
    
    if (!terminalOverlay || !terminalInput) return;

    // Toggle terminal on Ctrl + `
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === '`') {
            e.preventDefault();
            terminalOverlay.classList.toggle('hidden');
            if (!terminalOverlay.classList.contains('hidden')) {
                terminalInput.focus();
            }
        }
    });

    // Close on red button or escape
    terminalCloseBtn.addEventListener('click', () => terminalOverlay.classList.add('hidden'));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !terminalOverlay.classList.contains('hidden')) {
            terminalOverlay.classList.add('hidden');
        }
    });

    const addLine = (text, className = '') => {
        const div = document.createElement('div');
        div.className = `term-line ${className}`;
        div.textContent = text;
        terminalBody.appendChild(div);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim().toLowerCase();
            addLine(`dhruv@portfolio:~$ ${command}`);
            terminalInput.value = '';

            switch (command) {
                case '':
                    break;
                case 'help':
                    addLine('Available commands:');
                    addLine('  whoami    - Displays profile information');
                    addLine('  skills    - Lists all core competencies');
                    addLine('  projects  - Shows recent project builds');
                    addLine('  contact   - Initiates secure channel');
                    addLine('  clear     - Clears the terminal screen');
                    addLine('  exit      - Closes the terminal');
                    break;
                case 'whoami':
                    addLine(portfolioData.profile.bio, 'term-info');
                    break;
                case 'skills':
                    addLine(portfolioData.topSkills.join(' | '), 'term-success');
                    break;
                case 'projects':
                    portfolioData.projects.forEach(p => {
                        addLine(`> ${p.title}: ${p.technologies.join(', ')}`, 'term-warning');
                    });
                    break;
                case 'contact':
                    addLine(`Send encrypted transmission to: ${portfolioData.contact.email}`, 'term-success');
                    break;
                case 'clear':
                    terminalBody.innerHTML = '';
                    break;
                case 'sudo rm -rf /':
                    addLine('Nice try, but I have elevated privileges. 😉', 'term-error');
                    break;
                case 'exit':
                    terminalOverlay.classList.add('hidden');
                    break;
                default:
                    addLine(`bash: ${command}: command not found. Type 'help' for available commands.`, 'term-error');
            }
        }
    });
}

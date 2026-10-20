/**
 * Nofil Ayaz Portfolio - Main Application Logic
 * Sticky Navbar, Mobile Navigation Toggle, Scroll Reveal Observer, and AJAX Contact Submission
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. Sticky Navbar & Scroll Spy Active Item Highlighting
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Toggle sticky state based on scroll depth
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // ScrollSpy logic: detect which section is in view
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset for sticky nav height
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Set active nav link
        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on load

    // ==========================================================================
    // 2. Mobile Menu Toggle System
    // ==========================================================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu and activate target section when clicking on nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                
                const targetId = link.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl && targetEl.classList.contains('reveal')) {
                        targetEl.classList.add('active');
                    }
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // ==========================================================================
    // 3. Scroll Reveal System using IntersectionObserver
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Animates only once
                }
            });
        }, {
            threshold: 0.02, // Small threshold ensures tall sections (like mobile gallery 5000px+) trigger reliably
            rootMargin: '0px 0px -20px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        revealElements.forEach(element => {
            element.classList.add('active');
        });
    }

    // ==========================================================================
    // 4. AJAX Contact Form Submission
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('btn-submit');

    if (contactForm && formFeedback && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Disable button during loading state
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            
            formFeedback.className = 'form-feedback';
            formFeedback.textContent = '';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok && data.status === 'success') {
                    formFeedback.classList.add('success');
                    formFeedback.textContent = data.message || 'Thank you! Your message has been sent successfully.';
                    contactForm.reset();
                } else {
                    formFeedback.classList.add('error');
                    formFeedback.textContent = data.message || 'Oops! There was a problem sending your message.';
                }
            } catch (error) {
                formFeedback.classList.add('error');
                formFeedback.textContent = 'Oops! An unexpected connection error occurred. Please try again.';
                console.error('AJAX Error:', error);
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // ==========================================================================
    // 5. Theme Toggle Logic (Dark/Light mode)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const toggleIcon = themeToggleBtn.querySelector('.toggle-icon');
        
        // Load initial theme from localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            if (toggleIcon) {
                toggleIcon.classList.remove('fa-moon');
                toggleIcon.classList.add('fa-sun');
            }
        }
        
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            
            // Save selection
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            
            // Update icon
            if (toggleIcon) {
                if (isLight) {
                    toggleIcon.classList.remove('fa-moon');
                    toggleIcon.classList.add('fa-sun');
                } else {
                    toggleIcon.classList.remove('fa-sun');
                    toggleIcon.classList.add('fa-moon');
                }
            }
            
            // Dispatch dynamic event for canvas particles to adapt colors in real-time
            window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: isLight ? 'light' : 'dark' } }));
        });
    }

    // ==========================================================================
    // 6. Card Hover Spotlight Glow Coordinates Tracker
    // ==========================================================================
    const spotlightCards = document.querySelectorAll('.about-card, .achievement-card, .contact-form-container');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ==========================================================================
    // 7. Custom LERP Tracking Cursor
    // ==========================================================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (cursorDot && cursorRing && !isTouchDevice) {
        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;
        
        // Use flag to prevent mouse positions from jumping from (0,0) initially
        let firstMove = true;

        // Set zeroed baseline positions to make translate3d work
        cursorDot.style.top = '0';
        cursorDot.style.left = '0';
        cursorRing.style.top = '0';
        cursorRing.style.left = '0';
        
        document.body.classList.add('custom-cursor-active');

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (firstMove) {
                ringX = mouseX;
                ringY = mouseY;
                firstMove = false;
                
                // Show elements
                cursorDot.style.opacity = '1';
                cursorRing.style.opacity = '1';
            }
        });

        // LERP Factor
        const xp = 0.15;

        const animateCursor = () => {
            if (!firstMove) {
                // Smooth LERP calculation
                ringX += (mouseX - ringX) * xp;
                ringY += (mouseY - ringY) * xp;

                cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
                cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
            }
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hover scale effects on interactive components
        const hoverTargets = 'a, button, .btn, .tab-btn, .gallery-item, input, textarea, select, [role="button"]';
        
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverTargets)) {
                cursorRing.classList.add('hovered');
                cursorDot.classList.add('hovered');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverTargets)) {
                if (!e.relatedTarget || !e.relatedTarget.closest(hoverTargets)) {
                    cursorRing.classList.remove('hovered');
                    cursorDot.classList.remove('hovered');
                }
            }
        });

        // Toggle visibility when mouse leaves/enters viewport window
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            if (!firstMove) {
                cursorDot.style.opacity = '1';
                cursorRing.style.opacity = '1';
            }
        });
    } else {
        // If it's a touch device or elements missing, hide custom cursor elements
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorRing) cursorRing.style.display = 'none';
    }

    // ==========================================================================
    // 8. Scroll To Top Button Logic with Circular Progress
    // ==========================================================================
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    const progressCircle = scrollToTopBtn ? scrollToTopBtn.querySelector('.scroll-progress-circle') : null;
    
    if (scrollToTopBtn && progressCircle) {
        const pathLength = 289; // 2 * Math.PI * 46 (radius = 46)
        
        // Initialize style properties
        progressCircle.style.strokeDasharray = `${pathLength}`;
        progressCircle.style.strokeDashoffset = `${pathLength}`;
        
        const updateScrollProgress = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            
            // Toggle visibility of the button
            if (scrollTop > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
            
            // Calculate progress percentage and offset
            if (scrollHeight > 0) {
                const progress = scrollTop / scrollHeight;
                const offset = pathLength - (progress * pathLength);
                progressCircle.style.strokeDashoffset = Math.max(0, Math.min(pathLength, offset));
            }
        };

        window.addEventListener('scroll', updateScrollProgress);
        window.addEventListener('resize', updateScrollProgress);
        updateScrollProgress(); // Run once initially

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

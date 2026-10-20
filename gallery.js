/**
 * Nofil Ayaz Portfolio - Interactive Gallery Component
 * Handles tab-based filtering with animations and a premium, fully-accessible Lightbox media modal.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. Gallery Tab Filtering System
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryGrid = document.getElementById('gallery-grid');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Switch active classes on buttons
            tabButtons.forEach(t => t.classList.remove('active'));
            btn.classList.add('active');

            // Set grid to fade out momentarily for transition effect
            galleryGrid.style.opacity = '0';
            galleryGrid.style.transform = 'translateY(10px)';

            setTimeout(() => {
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        item.classList.remove('hide');
                    } else {
                        item.classList.add('hide');
                    }
                });

                // Fade back in with items updated
                galleryGrid.style.opacity = '1';
                galleryGrid.style.transform = 'translateY(0)';
            }, 300);
        });
    });

    // ==========================================================================
    // 2. Lightbox Media Modal System (with Navigations and Accessibilities)
    // ==========================================================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    
    let activeIndex = -1;
    let visibleItemsList = [];

    // Open Lightbox
    const openLightbox = (index) => {
        // Collect currently visible items (excluding hidden elements from current filter tab)
        visibleItemsList = Array.from(document.querySelectorAll('.gallery-item')).filter(item => !item.classList.contains('hide'));
        
        const allItems = Array.from(document.querySelectorAll('.gallery-item'));
        const clickedItem = allItems[index];
        activeIndex = visibleItemsList.indexOf(clickedItem);

        if (activeIndex === -1 && visibleItemsList.length > 0) {
            activeIndex = 0;
        }

        updateLightboxContent();
        
        lightbox.style.display = 'flex';
        lightbox.offsetHeight;
        
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    // Update Lightbox Display Content
    const updateLightboxContent = () => {
        if (activeIndex >= 0 && activeIndex < visibleItemsList.length) {
            const item = visibleItemsList[activeIndex];
            const videoSrc = item.getAttribute('data-video');
            const title = item.querySelector('.gallery-item-title').textContent;
            const category = item.querySelector('.gallery-item-category').textContent;

            if (videoSrc) {
                lightboxImg.style.display = 'none';
                lightboxVideo.style.display = 'block';
                lightboxVideo.src = videoSrc;
                lightboxVideo.play().catch(e => console.log('Autoplay prevented:', e));
            } else {
                lightboxVideo.pause();
                lightboxVideo.style.display = 'none';
                lightboxVideo.src = '';
                
                const img = item.querySelector('.gallery-img');
                lightboxImg.style.display = 'block';
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
            }

            lightboxCaption.innerHTML = `<span class="text-green font-display" style="text-transform: uppercase; font-size: 0.8rem; display: block;">${category}</span> ${title}`;
        }
    };

    // Close Lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        if (lightboxVideo) {
            lightboxVideo.pause();
            lightboxVideo.src = '';
        }
        
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300);
    };

    // Previous / Next Navigation Action
    const navigateLightbox = (direction) => {
        if (visibleItemsList.length <= 1) return;
        
        if (direction === 'next') {
            activeIndex = (activeIndex + 1) % visibleItemsList.length;
        } else if (direction === 'prev') {
            activeIndex = (activeIndex - 1 + visibleItemsList.length) % visibleItemsList.length;
        }
        
        // Apply smooth transition slide out/in feel
        lightboxImg.style.opacity = '0.3';
        lightboxImg.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            updateLightboxContent();
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1)';
        }, 150);
    };

    // Bind event listeners to items in gallery
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    // Close on click of close button or background area
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // Keyboard Listeners
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            navigateLightbox('next');
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox('prev');
        }
    });
});

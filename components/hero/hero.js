/* ==========================================
   HERO COMPONENT JS
   ========================================== */

(function () {
    'use strict';

    let currentSlide = 0;
    let slides = [];
    let dots = [];
    let carouselInterval;
    const CAROUSEL_DELAY = 5000;

    function initHeroCarousel() {
        slides = document.querySelectorAll('.carousel-slide');
        dots = document.querySelectorAll('.carousel-dot');

        if (slides.length === 0) return;

        // Ensure first slide is active
        showSlide(0);
        startAutoRotate();

        // Expose function globally for the dot onClick handlers in HTML
        window.goToSlide = function (n) {
            stopAutoRotate();
            showSlide(n);
            startAutoRotate();
        };

        // Pause on hover
        const heroSection = document.getElementById('jc-hero-section');
        if (heroSection) {
            heroSection.addEventListener('mouseover', stopAutoRotate);
            heroSection.addEventListener('mouseout', startAutoRotate);
        }
    }

    function showSlide(n) {
        slides.forEach(slide => {
            slide.classList.remove('opacity-100', 'pointer-events-auto');
            slide.classList.add('opacity-0', 'pointer-events-none');
            // Reset position relative for the active one to take flow if needed, 
            // but we used absolute positioning layout. 
            // Actually, in the HTML, all are absolute except the first one initially?
            // Let's standardise: all absolute except one? No, parent has height.
            // The HTML structure used absolute for 2,3,4.
            // We'll toggle opacity.
        });

        currentSlide = (n % slides.length + slides.length) % slides.length;

        const activeSlide = slides[currentSlide];
        activeSlide.classList.remove('opacity-0', 'pointer-events-none');
        activeSlide.classList.add('opacity-100', 'pointer-events-auto');

        updateDots();
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function updateDots() {
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.remove('bg-white/50');
                dot.classList.add('bg-white');
            } else {
                dot.classList.add('bg-white/50');
                dot.classList.remove('bg-white');
            }
        });
    }

    function startAutoRotate() {
        stopAutoRotate(); // prevent multiple intervals
        carouselInterval = setInterval(nextSlide, CAROUSEL_DELAY);
    }

    function stopAutoRotate() {
        clearInterval(carouselInterval);
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeroCarousel);
    } else {
        initHeroCarousel();
    }

})();

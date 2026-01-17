(function () {
    let currentSlide = 0;
    const totalSlides = 5;

    function showSlide(n) {
        try {
            const slides = document.querySelectorAll('.hero-slide');
            const dots = document.querySelectorAll('.hero-dot');

            if (slides.length === 0 || dots.length === 0) {
                if (window.JCErrorLogger) {
                    window.JCErrorLogger.warn(
                        window.JCErrorLogger.Category.COMPONENT,
                        'Hero slides or dots not found',
                        { slidesCount: slides.length, dotsCount: dots.length }
                    );
                }
                return;
            }

            slides.forEach(s => s.classList.remove('hero-slide-active'));
            dots.forEach(d => d.classList.remove('hero-dot-active'));

            currentSlide = (n + totalSlides) % totalSlides;

            if (slides[currentSlide]) {
                slides[currentSlide].classList.add('hero-slide-active');
            }
            if (dots[currentSlide]) {
                dots[currentSlide].classList.add('hero-dot-active');
            }
        } catch (error) {
            if (window.JCErrorLogger) {
                window.JCErrorLogger.error(
                    window.JCErrorLogger.Category.COMPONENT,
                    'Error in hero slide navigation',
                    error,
                    { slideNumber: n }
                );
            }
        }
    }

    window.goToSlide = function (n) {
        showSlide(n);
    };

    window.nextSlide = function () {
        showSlide(currentSlide + 1);
    };

    window.prevSlide = function () {
        showSlide(currentSlide - 1);
    };

    // Auto-rotate every 7 seconds
    try {
        setInterval(() => {
            showSlide(currentSlide + 1);
        }, 7000);
    } catch (error) {
        if (window.JCErrorLogger) {
            window.JCErrorLogger.error(
                window.JCErrorLogger.Category.COMPONENT,
                'Error starting hero slider auto-rotation',
                error
            );
        }
    }

})();
// ==========================================
// JEEVAN CHAKRA - HEADER COMPONENT JS
// ==========================================
// Mobile menu toggle and scroll highlighting
// Place in: components/header.js
// ==========================================

(function () {
    'use strict';

    // Initialize header functionality
    function jcHeaderInit() {
        try {
            const jcHeaderMenuBtn = document.getElementById('jc-header-mobile-menu-btn');
            const jcHeaderMobileMenu = document.getElementById('jc-header-mobile-menu');
            const jcHeaderIconOpen = document.getElementById('jc-header-menu-icon-open');
            const jcHeaderIconClose = document.getElementById('jc-header-menu-icon-close');

            // Retry if elements not loaded yet
            if (!jcHeaderMenuBtn || !jcHeaderMobileMenu) {
                setTimeout(jcHeaderInit, 100);
                return;
            }

            // Toggle mobile menu
            jcHeaderMenuBtn.addEventListener('click', function () {
                try {
                    const isOpen = !jcHeaderMobileMenu.classList.contains('hidden');

                    if (isOpen) {
                        jcHeaderMobileMenu.classList.add('hidden');
                        jcHeaderIconOpen.classList.remove('hidden');
                        jcHeaderIconClose.classList.add('hidden');
                        jcHeaderMenuBtn.setAttribute('aria-expanded', 'false');
                    } else {
                        jcHeaderMobileMenu.classList.remove('hidden');
                        jcHeaderIconOpen.classList.add('hidden');
                        jcHeaderIconClose.classList.remove('hidden');
                        jcHeaderMenuBtn.setAttribute('aria-expanded', 'true');
                    }
                } catch (error) {
                    if (window.JCErrorLogger) {
                        window.JCErrorLogger.error(
                            window.JCErrorLogger.Category.COMPONENT,
                            'Error toggling mobile menu',
                            error
                        );
                    }
                }
            });

            // Close mobile menu when clicking a link
            const jcHeaderMobileLinks = document.querySelectorAll('.jc-header-mobile-link');
            jcHeaderMobileLinks.forEach(function (link) {
                link.addEventListener('click', function () {
                    try {
                        jcHeaderMobileMenu.classList.add('hidden');
                        jcHeaderIconOpen.classList.remove('hidden');
                        jcHeaderIconClose.classList.add('hidden');
                        jcHeaderMenuBtn.setAttribute('aria-expanded', 'false');
                    } catch (error) {
                        if (window.JCErrorLogger) {
                            window.JCErrorLogger.error(
                                window.JCErrorLogger.Category.COMPONENT,
                                'Error closing mobile menu',
                                error
                            );
                        }
                    }
                });
            });

            // Highlight active section on scroll
            jcHeaderHighlightActiveSection();
            window.addEventListener('scroll', jcHeaderHighlightActiveSection);
        } catch (error) {
            if (window.JCErrorLogger) {
                window.JCErrorLogger.error(
                    window.JCErrorLogger.Category.COMPONENT,
                    'Error initializing header',
                    error
                );
            }
        }
    }

    // Highlight active nav link based on scroll position
    function jcHeaderHighlightActiveSection() {
        try {
            const sections = [
                'jc-manifesto-section',
                'jc-why-choose-section',
                'jc-system-section',
                'jc-pricing-section',
                'jc-faq-section',
                'jc-waitlist-section'
            ];

            const navLinks = document.querySelectorAll('.jc-header-nav-link');

            let currentSection = '';
            sections.forEach(function (sectionId) {
                const section = document.getElementById(sectionId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        currentSection = sectionId;
                    }
                }
            });

            navLinks.forEach(function (link) {
                const href = link.getAttribute('href');
                if (href === '#' + currentSection) {
                    link.classList.add('jc-header-active');
                } else {
                    link.classList.remove('jc-header-active');
                }
            });
        } catch (error) {
            if (window.JCErrorLogger) {
                window.JCErrorLogger.error(
                    window.JCErrorLogger.Category.COMPONENT,
                    'Error highlighting active section',
                    error
                );
            }
        }
    }

    // Start when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', jcHeaderInit);
    } else {
        jcHeaderInit();
    }

})();
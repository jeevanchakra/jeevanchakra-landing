/**
 * JEEVAN CHAKRA - OPTIMIZED COMPONENT LOADER
 * 
 * Performance optimizations:
 * - Parallel loading of components
 * - CSS preloading
 * - Deferred JS execution
 * - Resource hints
 */

(function () {
    'use strict';

    const components = [
        { id: 'header-placeholder', path: 'header.html', css: 'header.css', js: 'header.js', priority: 'high' },
        { id: 'hero-placeholder', path: 'hero/hero.html', css: 'hero/hero.css', js: 'hero/hero.js', priority: 'high' },
        { id: 'manifesto-placeholder', path: 'manifesto/manifesto.html', css: 'manifesto/manifesto.css', priority: 'medium' },
        { id: 'why-choose-placeholder', path: 'why-choose/why-choose.html', css: 'why-choose/why-choose.css', priority: 'medium' },
        { id: 'system-placeholder', path: 'system/system.html', css: 'system/system.css', js: 'system/system.js', priority: 'medium' },
        { id: 'pricing-placeholder', path: 'pricing/pricing.html', css: 'pricing/pricing.css', priority: 'low' },
        { id: 'testimonials-placeholder', path: 'testimonials/testimonials.html', css: 'testimonials/testimonials.css', priority: 'low' },
        { id: 'faq-placeholder', path: 'faq/faq.html', css: 'faq/faq.css', js: 'faq/faq.js', priority: 'low' },
        { id: 'waitlist-placeholder', path: 'waitlist/waitlist.html', css: 'waitlist/waitlist.css', js: 'waitlist/waitlist.js', priority: 'low' },
        { id: 'footer-placeholder', path: 'footer.html', css: 'footer.css', priority: 'low' }
    ];

    const basePath = './components/';
    const timestamp = Date.now(); // Single timestamp for cache busting

    // Preload critical CSS
    function preloadCSS(href) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    }

    // Load CSS with preload hint
    function loadCSS(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    // Load JS with defer
    function loadJS(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    async function loadComponent(component) {
        const placeholder = document.getElementById(component.id);
        if (!placeholder) {
            // Log missing placeholder
            if (window.JCErrorLogger) {
                window.JCErrorLogger.warn(
                    window.JCErrorLogger.Category.COMPONENT,
                    `Component placeholder not found: ${component.id}`,
                    { componentId: component.id, componentPath: component.path }
                );
            }
            return;
        }

        try {
            const response = await fetch(`${basePath}${component.path}?v=${timestamp}`);
            if (!response.ok) throw new Error(`Failed to load ${component.path}`);

            const html = await response.text();
            placeholder.innerHTML = html;

            // Load CSS
            if (component.css) {
                const cssPath = `${basePath}${component.css}?v=${timestamp}`;
                loadCSS(cssPath);
            }

            // Load JS (deferred)
            if (component.js) {
                const jsPath = `${basePath}${component.js}?v=${timestamp}`;
                await loadJS(jsPath);
            }

            // Log successful load
            if (window.JCErrorLogger) {
                window.JCErrorLogger.info(
                    window.JCErrorLogger.Category.COMPONENT,
                    `Component loaded successfully: ${component.id}`,
                    { componentId: component.id }
                );
            }

        } catch (error) {
            // Log error with full context
            if (window.JCErrorLogger) {
                window.JCErrorLogger.error(
                    window.JCErrorLogger.Category.COMPONENT,
                    `Failed to load component: ${component.path}`,
                    error,
                    {
                        componentId: component.id,
                        componentPath: component.path,
                        priority: component.priority,
                        basePath: basePath
                    }
                );
            } else {
                console.error(error);
            }

            let errorMessage = `Error loading section: ${component.path}`;
            if (window.location.protocol === 'file:') {
                errorMessage += '<br><small>Use a local server (e.g., python -m http.server)</small>';
            }
            placeholder.innerHTML = `<div class="text-red-500 p-4">${errorMessage}</div>`;
        }
    }

    async function initializeComponents() {
        // Preload critical CSS first
        components
            .filter(c => c.priority === 'high' && c.css)
            .forEach(c => preloadCSS(`${basePath}${c.css}?v=${timestamp}`));

        // Load high priority components first
        const highPriority = components.filter(c => c.priority === 'high');
        await Promise.all(highPriority.map(loadComponent));

        // Load medium priority
        const mediumPriority = components.filter(c => c.priority === 'medium');
        await Promise.all(mediumPriority.map(loadComponent));

        // Load low priority (lazy load below the fold)
        const lowPriority = components.filter(c => c.priority === 'low');

        // Use requestIdleCallback for low priority if available
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                Promise.all(lowPriority.map(loadComponent)).then(initScrollAnimations);
            });
        } else {
            setTimeout(() => {
                Promise.all(lowPriority.map(loadComponent)).then(initScrollAnimations);
            }, 100);
        }
    }

    function initScrollAnimations() {
        try {
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -100px 0px', // Trigger slightly before element enters viewport
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.reveal').forEach(el => {
                observer.observe(el);
            });
        } catch (error) {
            if (window.JCErrorLogger) {
                window.JCErrorLogger.error(
                    window.JCErrorLogger.Category.COMPONENT,
                    'Error initializing scroll animations',
                    error
                );
            } else {
                console.error('Error initializing scroll animations:', error);
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeComponents);
    } else {
        initializeComponents();
    }

})();
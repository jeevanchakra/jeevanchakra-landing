/**
 * JEEVAN CHAKRA - COMPONENT LOADER
 * 
 * Fetches HTML from /components/ and injects into placeholders.
 * Loads associated CSS/JS if defined in the component map.
 */

(function () {
    'use strict';

    const components = [
        { id: 'header-placeholder', path: 'header.html', css: 'header.css', js: 'header.js' },
        { id: 'hero-placeholder', path: 'hero/hero.html', css: 'hero/hero.css', js: 'hero/hero.js' },
        { id: 'manifesto-placeholder', path: 'manifesto/manifesto.html', css: 'manifesto/manifesto.css' },
        { id: 'why-choose-placeholder', path: 'why-choose/why-choose.html', css: 'why-choose/why-choose.css' },
        { id: 'system-placeholder', path: 'system/system.html', css: 'system/system.css', js: 'system/system.js' },
        { id: 'pricing-placeholder', path: 'pricing/pricing.html', css: 'pricing/pricing.css' },
        { id: 'faq-placeholder', path: 'faq/faq.html', css: 'faq/faq.css', js: 'faq/faq.js' },
        { id: 'waitlist-placeholder', path: 'waitlist/waitlist.html', css: 'waitlist/waitlist.css', js: 'waitlist/waitlist.js' },
        { id: 'footer-placeholder', path: 'footer.html', css: 'footer.css' }
    ];

    const basePath = './components/';

    async function loadComponent(component) {
        const placeholder = document.getElementById(component.id);
        if (!placeholder) return;

        try {
            const response = await fetch(basePath + component.path);
            if (!response.ok) throw new Error(`Failed to load ${component.path}`);

            const html = await response.text();
            placeholder.innerHTML = html;

            // Load CSS if exists
            if (component.css) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = basePath + component.css;
                document.head.appendChild(link);
            }

            // Load JS if exists
            if (component.js) {
                const script = document.createElement('script');
                script.src = basePath + component.js;
                script.defer = true;
                document.body.appendChild(script);
            }

        } catch (error) {
            console.error(error);
            placeholder.innerHTML = `<div class="text-red-500 p-4">Error loading section: ${component.path}</div>`;
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        components.forEach(loadComponent);

        // Initialize Scroll Animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with .reveal class
        // Use timeout to wait for components to inject content
        setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => {
                observer.observe(el);
            });
        }, 500); // 500ms delay to ensure DOM is populated
    });

})();

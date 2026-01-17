/**
 * JEEVAN CHAKRA - INTERNAL PAGE HEADER/FOOTER LOADER
 * 
 * Standardizes the header and footer across all internal pages (Legal, Auth, etc.)
 * Usage: Include this script in any HTML page to automatically inject Global Header & Footer.
 */

(function () {
    'use strict';

    const components = [
        { id: 'header-placeholder', path: '/components/header.html', css: '/components/header.css', js: '/components/header.js' },
        { id: 'footer-placeholder', path: '/components/footer.html', css: '/components/footer.css' }
    ];

    const timestamp = Date.now(); // Cache busting

    // Load CSS
    function loadCSS(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    // Load JS
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
        if (!placeholder) return;

        try {
            const response = await fetch(`${component.path}?v=${timestamp}`);
            if (!response.ok) throw new Error(`Failed to load ${component.path}`);

            const html = await response.text();
            placeholder.innerHTML = html;

            // Inject CSS
            if (component.css) {
                loadCSS(`${component.css}?v=${timestamp}`);
            }

            // Inject JS (if any)
            if (component.js) {
                await loadJS(`${component.js}?v=${timestamp}`);
            }

        } catch (error) {
            console.error(`Error loading ${component.id}:`, error);
            placeholder.innerHTML = `<div class="text-red-500 p-4">Error loading component. Please check console.</div>`;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => components.forEach(loadComponent));
    } else {
        components.forEach(loadComponent);
    }

})();

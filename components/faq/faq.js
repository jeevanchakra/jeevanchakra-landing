/* ==========================================
   FAQ COMPONENT JS
   ========================================== */

(function () {
    'use strict';

    window.toggleFAQ = function (id) {
        try {
            const content = document.getElementById(id);
            if (!content) {
                if (window.JCErrorLogger) {
                    window.JCErrorLogger.warn(
                        window.JCErrorLogger.Category.COMPONENT,
                        'FAQ content not found',
                        { faqId: id }
                    );
                }
                return;
            }

            const icon = content.previousElementSibling.querySelector('.faq-icon');

            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                if (icon) icon.textContent = '-';
            } else {
                content.classList.add('hidden');
                if (icon) icon.textContent = '+';
            }
        } catch (error) {
            if (window.JCErrorLogger) {
                window.JCErrorLogger.error(
                    window.JCErrorLogger.Category.COMPONENT,
                    'Error toggling FAQ',
                    error,
                    { faqId: id }
                );
            }
        }
    };

})();

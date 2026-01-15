/* ==========================================
   FAQ COMPONENT JS
   ========================================== */

(function () {
    'use strict';

    window.toggleFAQ = function (id) {
        const content = document.getElementById(id);
        const icon = content.previousElementSibling.querySelector('.faq-icon');

        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            icon.textContent = '-';
        } else {
            content.classList.add('hidden');
            icon.textContent = '+';
        }
    };

})();

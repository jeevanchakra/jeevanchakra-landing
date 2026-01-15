/* ==========================================
   SYSTEM COMPONENT JS
   ========================================== */

(function () {
    'use strict';

    window.toggleSystemCard = function (id) {
        const card = document.getElementById('card-' + id);
        if (!card) return;

        const isVisible = !card.classList.contains('hidden');

        // Hide all first
        const allCards = ['shield', 'grow', 'flow', 'gyaan'];
        allCards.forEach(cardId => {
            const c = document.getElementById('card-' + cardId);
            if (c) c.classList.add('hidden');
        });

        // Toggle selected if it was not already visible
        if (!isVisible) {
            card.classList.remove('hidden');
        }
    };

})();

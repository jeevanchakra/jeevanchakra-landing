/* ==========================================
   SYSTEM COMPONENT JS
   ========================================== */

(function () {
    'use strict';

    window.toggleSystemCard = function (id) {
        try {
            const card = document.getElementById('card-' + id);
            if (!card) {
                if (window.JCErrorLogger) {
                    window.JCErrorLogger.warn(
                        window.JCErrorLogger.Category.COMPONENT,
                        'System card not found',
                        { cardId: id }
                    );
                }
                return;
            }

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
        } catch (error) {
            if (window.JCErrorLogger) {
                window.JCErrorLogger.error(
                    window.JCErrorLogger.Category.COMPONENT,
                    'Error toggling system card',
                    error,
                    { cardId: id }
                );
            }
        }
    };

})();

/**
 * JEEVAN CHAKRA - GLOBAL ERROR HANDLER
 * 
 * Catches all uncaught errors, promise rejections, and resource loading failures
 * Provides graceful error recovery and detailed logging
 */

(function (window) {
    'use strict';

    // Wait for error logger to be available
    function waitForLogger(callback) {
        if (window.JCErrorLogger) {
            callback();
        } else {
            setTimeout(() => waitForLogger(callback), 50);
        }
    }

    waitForLogger(function () {
        const logger = window.JCErrorLogger;
        const { Category, Severity } = logger;

        /**
         * Global error handler for uncaught JavaScript errors
         */
        window.addEventListener('error', function (event) {
            // Check if it's a resource loading error
            if (event.target !== window) {
                handleResourceError(event);
                return;
            }

            // JavaScript runtime error
            try {
                const errorInfo = {
                    message: event.message,
                    filename: event.filename,
                    line: event.lineno,
                    column: event.colno,
                    error: event.error
                };

                logger.error(
                    Category.BROWSER,
                    `Uncaught Error: ${event.message}`,
                    event.error,
                    {
                        filename: event.filename,
                        line: event.lineno,
                        column: event.colno
                    }
                );

                // Show user-friendly error notification for critical errors
                if (shouldShowUserNotification(event.error)) {
                    showErrorNotification('An unexpected error occurred. The page may not work correctly.');
                }

            } catch (handlerError) {
                console.error('Error in global error handler:', handlerError);
            }

            // Return false to prevent default browser error handling
            return false;
        }, true);

        /**
         * Global handler for unhandled promise rejections
         */
        window.addEventListener('unhandledrejection', function (event) {
            try {
                const reason = event.reason;
                const message = reason instanceof Error ? reason.message : String(reason);

                logger.error(
                    Category.PROMISE,
                    `Unhandled Promise Rejection: ${message}`,
                    reason instanceof Error ? reason : new Error(message),
                    {
                        promiseRejection: true
                    }
                );

                // Prevent default behavior (logging to console)
                event.preventDefault();

            } catch (handlerError) {
                console.error('Error in promise rejection handler:', handlerError);
            }
        });

        /**
         * Handle resource loading errors (CSS, images, scripts)
         */
        function handleResourceError(event) {
            try {
                const target = event.target;
                const tagName = target.tagName;
                const resourceUrl = target.src || target.href || 'unknown';

                logger.error(
                    Category.RESOURCE,
                    `Failed to load ${tagName}: ${resourceUrl}`,
                    null,
                    {
                        tagName,
                        resourceUrl,
                        resourceType: getResourceType(tagName)
                    }
                );

                // Handle specific resource types
                if (tagName === 'LINK' && target.rel === 'stylesheet') {
                    logger.warn(Category.RESOURCE, 'CSS file failed to load - visual styling may be affected');
                } else if (tagName === 'SCRIPT') {
                    logger.warn(Category.RESOURCE, 'JavaScript file failed to load - functionality may be impaired');
                } else if (tagName === 'IMG') {
                    // Optionally replace broken images with placeholder
                    handleBrokenImage(target);
                }

            } catch (handlerError) {
                console.error('Error in resource error handler:', handlerError);
            }
        }

        /**
         * Get resource type from tag name
         */
        function getResourceType(tagName) {
            const typeMap = {
                'LINK': 'CSS',
                'SCRIPT': 'JavaScript',
                'IMG': 'Image',
                'VIDEO': 'Video',
                'AUDIO': 'Audio'
            };
            return typeMap[tagName] || 'Unknown';
        }

        /**
         * Handle broken images by showing placeholder
         */
        function handleBrokenImage(imgElement) {
            try {
                // Only replace once to avoid infinite loops
                if (imgElement.hasAttribute('data-error-handled')) {
                    return;
                }

                imgElement.setAttribute('data-error-handled', 'true');

                // You can set a placeholder image or hide it
                imgElement.style.display = 'none';

                logger.info(Category.RESOURCE, `Image hidden due to load failure: ${imgElement.src}`);

            } catch (error) {
                console.error('Error handling broken image:', error);
            }
        }

        /**
         * Determine if error should show user notification
         */
        function shouldShowUserNotification(error) {
            if (!error) return false;

            // Show notification for critical errors
            const criticalPatterns = [
                /Cannot read property.*of undefined/i,
                /Cannot read properties of null/i,
                /is not a function/i,
                /Network request failed/i
            ];

            return criticalPatterns.some(pattern => pattern.test(error.message));
        }

        /**
         * Show user-friendly error notification
         */
        function showErrorNotification(message) {
            try {
                // Check if notification container exists
                let container = document.getElementById('jc-error-notification-container');

                if (!container) {
                    // Container will be created in HTML
                    // For now, just log
                    logger.warn(Category.DOM, 'Error notification container not found');
                    return;
                }

                // Create notification element
                const notification = document.createElement('div');
                notification.className = 'jc-error-notification';
                notification.setAttribute('role', 'alert');
                notification.innerHTML = `
                    <div class="jc-error-content">
                        <span class="jc-error-icon">⚠️</span>
                        <span class="jc-error-message">${escapeHtml(message)}</span>
                        <button class="jc-error-close" aria-label="Close notification">×</button>
                    </div>
                `;

                // Add to container
                container.appendChild(notification);

                // Add close handler
                const closeBtn = notification.querySelector('.jc-error-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', function () {
                        notification.remove();
                    });
                }

                // Auto-dismiss after 10 seconds
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 10000);

            } catch (error) {
                console.error('Error showing notification:', error);
            }
        }

        /**
         * Escape HTML to prevent XSS
         */
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        /**
         * Monitor DOM for rendering issues
         */
        function initDOMMonitor() {
            try {
                // Check for missing critical placeholders on page load
                window.addEventListener('load', function () {
                    const criticalPlaceholders = [
                        'header-placeholder',
                        'hero-placeholder',
                        'footer-placeholder'
                    ];

                    criticalPlaceholders.forEach(id => {
                        const element = document.getElementById(id);
                        if (!element) {
                            logger.warn(
                                Category.DOM,
                                `Critical placeholder missing: ${id}`,
                                { placeholderId: id }
                            );
                        } else if (element.innerHTML.trim() === '') {
                            logger.warn(
                                Category.DOM,
                                `Critical placeholder is empty: ${id}`,
                                { placeholderId: id }
                            );
                        }
                    });
                });

            } catch (error) {
                logger.error(Category.DOM, 'Error initializing DOM monitor', error);
            }
        }

        /**
         * Safe wrapper for async operations
         */
        window.JCSafeAsync = function (asyncFn, context = {}) {
            return async function (...args) {
                try {
                    return await asyncFn.apply(this, args);
                } catch (error) {
                    logger.error(
                        Category.COMPONENT,
                        'Error in async operation',
                        error,
                        context
                    );
                    throw error; // Re-throw so caller can handle
                }
            };
        };

        /**
         * Safe wrapper for event handlers
         */
        window.JCSafeHandler = function (handlerFn, context = {}) {
            return function (...args) {
                try {
                    return handlerFn.apply(this, args);
                } catch (error) {
                    logger.error(
                        Category.COMPONENT,
                        'Error in event handler',
                        error,
                        context
                    );
                    // Don't re-throw to prevent error propagation
                }
            };
        };

        // Initialize DOM monitoring
        initDOMMonitor();

        // Log initialization
        console.log(
            '%c🛡️ Jeevan Chakra Global Error Handler Active',
            'color: #1B9C85; font-weight: bold; font-size: 1.2em'
        );

        // Expose utility to window
        window.JCErrorHandler = {
            showNotification: showErrorNotification
        };
    });

})(window);

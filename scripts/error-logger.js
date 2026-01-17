/**
 * JEEVAN CHAKRA - ERROR LOGGER
 * 
 * Centralized error logging service with structured reporting
 * Captures and logs all errors with detailed context for debugging
 */

(function (window) {
    'use strict';

    // Error severity levels
    const Severity = {
        INFO: 'INFO',
        WARN: 'WARN',
        ERROR: 'ERROR',
        CRITICAL: 'CRITICAL'
    };

    // Error categories
    const Category = {
        BROWSER: 'BROWSER',
        NETWORK: 'NETWORK',
        DOM: 'DOM',
        COMPONENT: 'COMPONENT',
        RESOURCE: 'RESOURCE',
        PROMISE: 'PROMISE',
        VALIDATION: 'VALIDATION'
    };

    // In-memory error storage (last 100 errors)
    const errorLog = [];
    const MAX_LOG_SIZE = 100;

    // Error deduplication - track recent errors to prevent spam
    const recentErrors = new Map();
    const DEDUP_WINDOW = 5000; // 5 seconds

    /**
     * Create structured error log entry
     */
    function createLogEntry(severity, category, message, error, context = {}) {
        return {
            timestamp: new Date().toISOString(),
            severity,
            category,
            message,
            error: error ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : null,
            context: {
                url: window.location.href,
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                ...context
            }
        };
    }

    /**
     * Generate error signature for deduplication
     */
    function getErrorSignature(severity, category, message) {
        return `${severity}:${category}:${message}`;
    }

    /**
     * Check if error is duplicate within dedup window
     */
    function isDuplicate(signature) {
        const lastOccurrence = recentErrors.get(signature);
        const now = Date.now();

        if (lastOccurrence && (now - lastOccurrence) < DEDUP_WINDOW) {
            return true;
        }

        recentErrors.set(signature, now);
        return false;
    }

    /**
     * Format log entry for console output
     */
    function formatConsoleOutput(entry) {
        const emoji = {
            INFO: 'ℹ️',
            WARN: '⚠️',
            ERROR: '❌',
            CRITICAL: '🚨'
        };

        const prefix = `[${emoji[entry.severity]} ${entry.severity}] [${entry.category}]`;
        return {
            prefix,
            entry
        };
    }

    /**
     * Log error to console with appropriate styling
     */
    function logToConsole(entry) {
        const { prefix, entry: logEntry } = formatConsoleOutput(entry);

        const style = {
            INFO: 'color: #3b82f6; font-weight: bold',
            WARN: 'color: #f59e0b; font-weight: bold',
            ERROR: 'color: #ef4444; font-weight: bold',
            CRITICAL: 'color: #dc2626; font-weight: bold; font-size: 1.1em'
        };

        console.groupCollapsed(`%c${prefix} ${logEntry.message}`, style[entry.severity]);
        console.log('Timestamp:', logEntry.timestamp);
        console.log('Category:', logEntry.category);
        console.log('Context:', logEntry.context);
        if (logEntry.error) {
            console.error('Error Details:', logEntry.error);
            if (logEntry.error.stack) {
                console.log('Stack Trace:', logEntry.error.stack);
            }
        }
        console.groupEnd();
    }

    /**
     * Store error in memory
     */
    function storeError(entry) {
        errorLog.push(entry);
        if (errorLog.length > MAX_LOG_SIZE) {
            errorLog.shift(); // Remove oldest entry
        }
    }

    /**
     * Main logging function
     */
    function log(severity, category, message, error = null, context = {}) {
        try {
            // Create signature for deduplication
            const signature = getErrorSignature(severity, category, message);

            // Skip if duplicate within dedup window
            if (isDuplicate(signature)) {
                return;
            }

            // Create log entry
            const entry = createLogEntry(severity, category, message, error, context);

            // Store in memory
            storeError(entry);

            // Log to console
            logToConsole(entry);

            // Extension point: Send to remote logging service
            // sendToRemoteLogger(entry);

        } catch (loggingError) {
            // Fallback: If logging itself fails, use basic console.error
            console.error('Error in error logger:', loggingError);
            console.error('Original error:', message, error);
        }
    }

    /**
     * Convenience methods for different severity levels
     */
    const ErrorLogger = {
        info: (category, message, context) => log(Severity.INFO, category, message, null, context),
        warn: (category, message, context) => log(Severity.WARN, category, message, null, context),
        error: (category, message, error, context) => log(Severity.ERROR, category, message, error, context),
        critical: (category, message, error, context) => log(Severity.CRITICAL, category, message, error, context),

        // Get all logged errors
        getErrors: () => [...errorLog],

        // Clear error log
        clearLog: () => {
            errorLog.length = 0;
            recentErrors.clear();
        },

        // Get errors by category
        getErrorsByCategory: (category) => errorLog.filter(e => e.category === category),

        // Get errors by severity
        getErrorsBySeverity: (severity) => errorLog.filter(e => e.severity === severity),

        // Export error log as JSON
        exportLog: () => JSON.stringify(errorLog, null, 2),

        // Expose constants
        Severity,
        Category
    };

    // Expose to window
    window.JCErrorLogger = ErrorLogger;

    // Log initialization
    if (console && console.log) {
        console.log(
            '%c🛡️ Jeevan Chakra Error Logger Initialized',
            'color: #1B9C85; font-weight: bold; font-size: 1.2em'
        );
    }

})(window);

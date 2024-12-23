/**
 * Custom error class to handle application-specific errors.
 * It extends the built-in Error class to include status codes and operational status.
 */
class AppError extends Error {
    /**
     * Creates an instance of AppError.
     * @param {string} message - The error message describing the issue.
     * @param {number} statusCode - The HTTP status code (e.g., 404 for client errors, 500 for server errors).
     */
    constructor(message, statusCode) {
        // Call the parent Error class's constructor to set the message
        super(message);

        /**
         * The status code associated with the error.
         * @type {number}
         */
        this.statusCode = statusCode;

        /**
         * A string representing the error status, determined based on the status code.
         * 'fail' for 4xx (client errors), 'error' for 5xx (server errors).
         * @type {string}
         */
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        /**
         * Indicates if the error is operational (app-related and expected).
         * @type {boolean}
         */
        this.isOperational = true;

        // Captures the stack trace, excluding the constructor call for better readability
        Error.captureStackTrace(this, this.constructor);
    }
}

// Exporting the AppError class for use in other modules
export default AppError;

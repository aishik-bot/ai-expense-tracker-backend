/**
 * Error handling middleware for Express.js.
 * Catches errors, logs stack traces in development, and sends formatted error responses.
 *
 * @param {Object} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
const errorHandler = (err, req, res, next) => {
    /**
     * The HTTP status code to send in the response.
     * Defaults to 500 if not specified by the error.
     * @type {number}
     */
    const statusCode = err.statusCode || 500;

    /**
     * The error message to include in the response.
     * Defaults to 'Something went wrong!' if not specified by the error.
     * @type {string}
     */
    let message = err.message || 'Something went wrong!';
  
    // Log the error stack trace only if in development environment
    console.error(err.stack);
  
    // Respond with the error details in JSON format
    res.status(statusCode).json({
      success: false,
      message,
      // Hide stack trace in production environment, show in development
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};
  
// Exporting the errorHandler for use in other modules
export default errorHandler;

/**
 * Sends a response to the client with the specified status code and data.
 *
 * @param {Object} res - The Express.js response object.
 * @param {number} statusCode - The HTTP status code to send.
 * @param {boolean} success - Whether the operation was successful.
 * @param {string} [message=""] - A message to be sent to the client.
 * @param {Object} [data=null] - Data to be sent to the client.
 */
const sendResponse = ({ res, statusCode, success, message = "", data = null }) => {
    res.status(statusCode).json({
        success,
        message,
        data,
    });
};

export default sendResponse;

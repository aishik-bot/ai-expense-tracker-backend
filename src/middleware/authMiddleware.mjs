import { auth } from "../firebase.mjs";
import AppError from "../utils/appError.mjs";
import asyncHandler from "./asyncHandler.mjs";

/**
 * Middleware function to verify the Firebase authentication token from the request.
 * It checks the Authorization header for the token, verifies it using Firebase Admin,
 * and attaches the decoded user information to the request object.
 *
 * @param {Object} req - The request object containing the incoming HTTP request.
 * @param {Object} res - The response object used to send back the desired HTTP response.
 * @param {function} next - The next middleware function to pass control to.
 * @returns {void} - Calls `next()` to pass control to the next middleware if token is valid.
 * @throws {AppError} - Throws an AppError with a 401 status if no token is provided or if verification fails.
 */
export const verifyToken = asyncHandler(async (req, res, next) => {
    // Check for token in headers (Authorization header as Bearer token)
    const token =
        req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
        return next(
            new AppError("Unauthorized access, No token provided", 401)
        );
    }

    // Verify the token using Firebase Admin
    const decodedToken = await auth.verifyIdToken(token);

    // Attach the user to the request object
    req.user = decodedToken;

    next();
});



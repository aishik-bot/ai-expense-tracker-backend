import { auth } from "../utils/firebase.mjs";
import AppError from "../utils/appError.mjs";
import asyncHandler from "./asyncHandler.mjs";
import prisma from "../prisma/client.mjs";

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
    const token = req.headers.authorization;

    if (!token) {
        return next(
            new AppError("Unauthorized access, No token provided", 401)
        );
    }

    // Verify the token using Firebase Admin
    const decodedToken = await auth.verifyIdToken(token);

    // Check if the user exists in the database
    const user = await prisma.user.findUnique({
        where: {
            firebaseId: decodedToken.uid,
        },
        select: {
            role: {
                select: {
                    name: true,
                },
            },
        },
    });

    // If user is not found, throw an error
    if (!user) {
        return next(new AppError("Unauthorized access, User not found", 401));
    }

    // Attach the user to the request object
    req.user = { ...decodedToken, role: user.role.name };

    next();
});

export const verifySocketToken = asyncHandler(async (socket, next) => {
    const token =
        socket.handshake.headers?.authorization || socket.handshake.auth?.token; // Get token from socket handshake

    // If no token is provided, throw an error
    if (!token) {
        return next(
            new AppError("Unauthorized access, No token provided", 401)
        );
    }

    const decodedToken = await auth.verifyIdToken(token);

    // Check if the user exists in the database
    const user = await prisma.user.findUnique({
        where: {
            firebaseId: decodedToken.uid,
        },
        select: {
            id: true,
            role: {
                select: {
                    name: true,
                },
            },
        },
    });

    socket.user = { ...decodedToken, role: user.role.name, id: user.id };

    next();
});

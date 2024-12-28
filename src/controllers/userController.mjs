import { createUser, getUser } from "../services/userService.mjs";
import prisma from "../prisma/client.mjs";
import asyncHandler from "../middleware/asyncHandler.mjs";
import sendResponse from "../utils/sendResponse.mjs";
import AppError from "../utils/appError.mjs";

/**
 * Controller function to register a new user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const registerUser = asyncHandler(async (req, res) => {
    // get the role id for user role
    const role = await prisma.role.findUnique({
        where: {
            name: "USER",
        },
        select: {
            id: true,
        },
    });

    // if role is not found, throw an error
    if (!role) {
        throw new Error("Role not found");
    }

    // create user with the role id
    const user = await createUser({ userData: req.body, roleId: role.id });

    // send the created user details in the response
    sendResponse({
        res,
        statusCode: 201,
        message: "User created successfully",
        data: user,
    });
});


/**
 * Controller function to get the details of the currently logged in user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next function.
 */
export const getUserDetails = asyncHandler(async (req, res, next) => {
    // Get the Firebase ID from the request object
    const firebaseId = req.user.user_id;

    // Fetch the user details from the database
    const user = await getUser({ firebaseId });

    // If the user is not found, return a 404 error
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    // Send the user details in the response
    sendResponse({
        res,
        statusCode: 200,
        message: "User details retrieved successfully",
        data: user,
    });
});

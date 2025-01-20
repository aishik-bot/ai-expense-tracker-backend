import prisma from "../prisma/client.mjs";
import asyncHandler from "../middleware/asyncHandler.mjs";

/**
 * Creates a new user in the database.
 * @param {Object} userData - An object containing user data (firstname, lastname, firebaseId, email).
 * @param {string} userData.firstname - The first name of the user.
 * @param {string} userData.lastname - The last name of the user.
 * @param {string} userData.firebaseId - The Firebase ID of the user.
 * @param {string} userData.email - The email address of the user.
 * @param {number} roleId - The ID of the role associated with the user.
 * @returns {Promise<Object>} A promise that resolves to the created user object.
 */
export const createUser = asyncHandler(async ({ userData, roleId }) => {
    // Extract user data from the userData object
    const { firstname, lastname, firebaseId, email } = userData;

    // Check if the user already exists
    const userExists = await prisma.user.findFirst({
        where: {
            OR: [{ firebaseId }, { email }],
        },
    });

    // If user already exists, throw an error
    if (userExists) {
        throw new Error("User already exists");
    }

    // Create the user in the database
    const user = await prisma.user.create({
        data: {
            firstname,
            lastname,
            firebaseId,
            email,
            roleId,
        },
    });

    // Return the created user
    return user;
});

/**
 * Fetches a user by their Firebase ID.
 * @param {string} firebaseId - The Firebase ID of the user to fetch.
 * @returns {Promise<Object>} A promise that resolves to the user object.
 */
export const getUser = asyncHandler(async ({ firebaseId }) => {
    // Fetch the user from the database based on the Firebase ID
    const user = await prisma.user.findUnique({
        where: {
            firebaseId,
        },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            role: {
                select: {
                    name: true,
                },
            },
        },
    });

    // Return the user
    return user;
});

/**
 * Fetches all users from the database.
 * @param {number} page - The page number to fetch (default is 1).
 * @param {number} limit - The number of users to fetch per page (default is 10).
 * @returns {Promise<Object>} A promise that resolves to an object containing users, total users, current page, and total pages.
 */
export const getAllUsers = asyncHandler(async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    // Fetch all users from the database
    const users = await prisma.user.findMany({
        skip,
        take: limit,
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            role: {
                select: {
                    name: true,
                },
            },
        },
    });

    const totalUsers = await prisma.user.count();

    // Return the users
    return {
        users,
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
    };
});

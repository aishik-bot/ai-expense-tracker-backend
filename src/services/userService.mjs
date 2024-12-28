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

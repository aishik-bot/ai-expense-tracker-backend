import prisma from "../prisma/client.mjs";
import asyncHandler from "../middleware/asyncHandler.mjs";

export const createUser = asyncHandler(async ({ userData, roleId }) => {
    const { firstname, lastname, firebaseId, email } = userData;

    const userExists = await prisma.user.findFirst({
        where: {
            OR: [{ firebaseId }, { email }],
        },
    });

    if (userExists) {
        throw new Error("User already exists");
    }

    const user = await prisma.user.create({
        data: {
            firstname,
            lastname,
            firebaseId,
            email,
            roleId,
        },
    });

    return user;
});

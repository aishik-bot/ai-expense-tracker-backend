import { createUser } from "../services/userService.mjs";
import prisma from "../prisma/client.mjs";
import asyncHandler from "../middleware/asyncHandler.mjs";
import sendResponse from "../utils/sendResponse.mjs";

export const registerUser = asyncHandler(async (req, res) => {
    const role = await prisma.role.findUnique({
        where: {
            name: "USER",
        },
        select: {
            id: true,
        },
    });

    if (!role) {
        throw new Error("Role not found");
    }

    const user = await createUser({ userData: req.body, roleId: role.id });

    sendResponse({
        res,
        statusCode: 201,
        message: "User created successfully",
        data: user,
    });
});

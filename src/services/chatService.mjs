import asyncHandler from "../middleware/asyncHandler.mjs";
import prisma from "../prisma/client.mjs";

// Service to save a message to the database
export const saveMessage = asyncHandler(async (userId, message) => {
    return await prisma.message.create({
        data: {
            userId,
            content: message,
        },
    });
});

// Service to get all messages from the database
export const getMessages = asyncHandler(async () => {
    return await prisma.message.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
});

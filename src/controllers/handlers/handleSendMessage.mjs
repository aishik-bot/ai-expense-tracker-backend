import prisma from "../../prisma/client.mjs";
import { saveMessage } from "../../services/chatService.mjs";
import { getParsedGeminiResponse } from "../../services/geminiService.mjs";

/**
 * Handles a message sent by the client. Saves the message to the database,
 * interprets the message using the Gemini API, and creates an expense in the database
 * using the interpreted data.
 * @param {import("socket.io").Server} io - The Socket.IO server
 * @param {import("socket.io").Socket} socket - The Socket.IO socket
 * @param {string} data - The message sent by the client
 */
const handleSendMessage = async (io, socket, data) => {
    try {
        console.log("Message received: ", data);

        // save the message to the database
        await saveMessage(socket.user.id, data);

        // Call the Gemini API to interpret the message
        const cleanedResponse = await getParsedGeminiResponse(data);

        // Check if the category exists in the database
        const category = await prisma.category.findFirst({
            where: {
                name: cleanedResponse.category,
            },
            select: {
                id: true,
            },
        });

        // if the category does not exist, throw an error
        if (!category) {
            throw new Error(`Invalid category: ${cleanedResponse.category}`);
        }

        // Create the expense in the database
        const expense = await prisma.expense.create({
            data: {
                categoryId: category.id,
                amount: cleanedResponse.amount,
                description: cleanedResponse.description,
                userId: socket.user.id,
            },
            select: {
                id: true,
                amount: true,
                description: true,
                category: {
                    select: {
                        name: true,
                    },
                },
                createdAt: true,
            },
        });

        // Emit the expense to the client
        io.emit("expenseAdded", expense);
    } catch (error) {
        console.error("Error: ", error);
        socket.emit("error", {
            message: error.message || "An unexpected error occurred.",
        }); // Emit the error message to the client
    }
};

export default handleSendMessage;

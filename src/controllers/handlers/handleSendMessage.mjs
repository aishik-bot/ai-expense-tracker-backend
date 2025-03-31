import prisma from "../../prisma/client.mjs";
import { saveMessage } from "../../services/chatService.mjs";
import { getParsedGeminiResponse } from "../../services/geminiService.mjs";

/**
 * Handles a message sent by the client. Saves the message to the database,
 * interprets the message using the Gemini API, and creates an expense in the database
 * using the interpreted data if it is a valid expense.
 * @param {import("socket.io").Server} io - The Socket.IO server
 * @param {import("socket.io").Socket} socket - The Socket.IO socket
 * @param {string} data - The message sent by the client
 */
const handleSendMessage = async (io, socket, data) => {
    try {
        console.log("Message received: ", data);

        // Save the raw message to the database
        await saveMessage(socket.user.id, data);

        // Call the Gemini API to interpret the message
        const cleanedResponse = await getParsedGeminiResponse(data);

        // If the message is not an expense, emit a response and return early
        if (!cleanedResponse.valid) {
            console.log("Non-expense message detected.");
            socket.emit("error", { message: cleanedResponse.reason }); 
            return;
        }

        // Check if the category exists in the database
        let category;
        try {
            category = await prisma.category.findFirst({
                where: { name: cleanedResponse.category },
                select: { id: true },
            });
        } catch (dbError) {
            console.error("Database error: ", dbError);
            socket.emit("error", { message: "Database error while checking category." });
            return;
        }

        // If the category does not exist, emit an error without throwing
        if (!category) {
            console.log(`Invalid category: ${cleanedResponse.category}`);
            socket.emit("error", { message: `Invalid category: ${cleanedResponse.category}` });
            return;
        }

        // Create the expense in the database
        let expense;
        try {
            expense = await prisma.expense.create({
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
                    category: { select: { name: true } },
                    createdAt: true,
                },
            });
        } catch (dbError) {
            console.error("Database error while creating expense: ", dbError);
            socket.emit("error", { message: "Database error while creating expense." });
            return;
        }

        // Emit the expense to the client
        io.emit("expenseAdded", expense);
    } catch (error) {
        console.error("Unexpected error: ", error);
        if (socket.connected) {
            socket.emit("error", { message: error.message || "An unexpected error occurred." });
        } else {
            console.warn("Socket was already disconnected before emitting the error.");
        }
    }
};

export default handleSendMessage;

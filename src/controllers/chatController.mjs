import asyncHandler from "../middleware/asyncHandler.mjs";
import { getMessages } from "../services/chatService.mjs";
import handleSendMessage from "./handlers/handleSendMessage.mjs";

export default (io, socket) => {
    console.log("ChatController executed for socket: ", socket.id); // Log the socket ID

    // Handle the "sendMessage" event
    socket.on(
        "sendMessage",
        async (data) => await handleSendMessage(io, socket, data)
    );

    socket.on(
        "getMessages",
        asyncHandler(async () => {
            const messages = await getMessages();
            console.log("messages: ", messages);
            socket.emit("receiveMessages", messages);
        })
    );
};

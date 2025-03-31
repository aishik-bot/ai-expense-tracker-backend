import { Server } from "socket.io";
import { verifySocketToken } from "../middleware/authMiddleware.mjs";
import chatController from "../controllers/chatController.mjs";

export const setupSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*", // Allow all origins
        },
    });

    io.use(verifySocketToken);

    io.on("connection", (socket) => {
        console.log("New connection: ", socket.id);

        chatController(io, socket);

        socket.on("disconnect", () => {
            console.log("User disconnected: ", socket.id);
        });
    });

    return io;
};

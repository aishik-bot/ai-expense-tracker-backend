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
        try {
            chatController(io, socket);
        } catch (error) {
            console.error("Error in chatController: ", error);
            socket.emit("error", {
                message: "Internal server error in chat controller.",
            });
        }

        socket.on("disconnect", (reason) => {
            console.log(`User ${socket.id} disconnected. Reason:`, reason);
        });
    });

    return io;
};

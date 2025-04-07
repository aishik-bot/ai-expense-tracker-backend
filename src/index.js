import "./utils/logger.mjs";
import http from "http";
import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.mjs";
import AppError from "./utils/appError.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import adminUserRoutes from "./routes/admin/userRoutes.mjs";
import adminCategoryRoutes from "./routes/admin/categoryRoutes.mjs";
import { setupSocket } from "./socket/socketConfig.mjs";

const app = express();
const server = http.createServer(app);

setupSocket(server);

app.use(cors());

const port = process.env.PORT || 8000;

// Middleware to parse incoming requests with JSON payload
app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);
app.use("/api/v1/admin/categories", adminCategoryRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("Hello World from Expense Tracker!");
});

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Attach the global error handler middleware to catch any
// unhandled errors and send error responses to the client
app.use(errorHandler);

// Start the server
server.listen(port, () => {
    logger.log(`Server is running on http://localhost:${port}`);
});

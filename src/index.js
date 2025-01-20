import "./utils/logger.mjs";
import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.mjs";
import AppError from "./utils/appError.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import adminUserRoutes from "./routes/admin/userRoutes.mjs";

const app = express();

app.use(cors());

const port = process.env.PORT || 8000;

// Middleware to parse incoming requests with JSON payload
app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("Hello World from Expense Tracker!");
});

// Attach the global error handler middleware to catch any
// unhandled errors and send error responses to the client
app.use(errorHandler);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Start the server
app.listen(port, () => {
    logger.log(`Server is running on http://localhost:${port}`);
});

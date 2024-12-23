import express from "express";
import errorHandler from "./middleware/errorHandler.mjs";

const app = express();
const port = 3000;

// Middleware to parse incoming requests with JSON payload
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('Hello World from Expense Tracker!');
});

app.use(errorHandler)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

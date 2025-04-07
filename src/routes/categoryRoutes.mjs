import express from "express";

// Import the getCategories controller function
import { getCategories } from "../controllers/categoryControllers.mjs";

// Import the verifyToken middleware function
import { verifyToken } from "../middleware/authMiddleware.mjs";

// Create a new express router
const router = express.Router();

// Define a route to get all categories
// This route is protected by the verifyToken middleware
router.route("/").get(verifyToken, getCategories);

// Export the router
export default router;


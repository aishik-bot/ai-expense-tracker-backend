import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.mjs";
import { addCategoriesToDatabase } from "../../controllers/categoryControllers.mjs";
import { requireRole } from "../../middleware/roleMiddleware.mjs";
import { validateMultipleCategories } from "../../validators/categoryValidators.mjs";

// Create a new express router
const router = express.Router();

// Define a route to add categories to the database
router
    .route("/")
    .post(
        // Verify the token to ensure the user is authenticated
        verifyToken,
        // Require the user to have the SUPER_ADMIN role
        requireRole("SUPER_ADMIN"),
        // Validate the categories in the request body
        validateMultipleCategories,
        // Call the controller function to add the categories
        addCategoriesToDatabase
    );

// Export the router
export default router;


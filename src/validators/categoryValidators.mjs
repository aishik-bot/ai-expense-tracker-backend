import Joi from "joi";
import AppError from "../utils/appError.mjs";

// Define the schema for validating multiple categories
const multipleCategoriesSchema = Joi.object({
    categories: Joi.array()
        .items(
            Joi.string().trim().min(1).required() // Each category must be a non-empty string
        )
        .min(1) // At least one category is required
        .required()
        .messages({
            "array.base": '"categories" must be an array', // Error message if categories is not an array
            "array.min": "At least one category is required", // Error message if no categories are provided
            "string.empty": "Category name cannot be empty", // Error message if a category is an empty string
        }),
});

// Middleware for validating multiple categories
export const validateMultipleCategories = (req, res, next) => {
    // Validate the request body against the schema
    const { error } = multipleCategoriesSchema.validate(req.body, {
        abortEarly: false, // Show all validation errors, not just the first
    });

    // If validation errors exist, create an AppError and pass it to the next middleware
    if (error) {
        const message = error.details.map((err) => err.message).join(", ");
        return next(new AppError(message, 400));
    }

    next(); // If no validation errors, proceed to the next middleware
};


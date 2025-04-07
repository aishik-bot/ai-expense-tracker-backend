import Joi from "joi";
import AppError from "../utils/appError.mjs";

/**
 * Validation schema for updating an expense.
 * Ensures that at least one of the fields (amount, description, or categoryId)
 * is provided and that they conform to the specified schema.
 */
const updateExpenseSchema = Joi.object({
    amount: Joi.number().positive().messages({
        "number.base": "Amount must be a number",
        "number.positive": "Amount must be a positive number",
    }),
    description: Joi.string().max(255).messages({
        "string.base": "Description must be a string",
        "string.max":
            "Description should be less than or equal to 255 characters",
    }),
    categoryId: Joi.string().uuid().messages({
        "string.base": "Category ID must be a string",
        "string.guid": "Category ID must be a valid UUID",
    }),
})
    .or("amount", "description", "categoryId")
    .messages({
        "object.missing":
            "Provide at least one of amount, description, or categoryId to update",
    });

/**
 * Middleware for validating request body when updating an expense.
 * Ensures that at least one of the fields (amount, description, or categoryId)
 * is provided and that they conform to the specified schema.
 * If validation fails, passes an AppError with a 400 status to the next middleware.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const validateUpdateExpense = (req, res, next) => {
    const { error } = updateExpenseSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        const message = error.details.map((err) => err.message).join(", ");
        return next(new AppError(message, 400));
    }

    next();

}
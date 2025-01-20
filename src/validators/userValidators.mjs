import Joi from "joi";
import AppError from "../utils/appError.mjs";

export const createUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Invalid email format",
  }),
  firstname: Joi.string().required().messages({
    "any.required": "First name is required",
  }),
  lastname: Joi.string().required().messages({
    "any.required": "Last name is required",
  }),
  firebaseId: Joi.string().required().messages({
    "any.required": "Firebase ID is required",
  }),
});

// Middleware for validation
export const createUserValidator = (req, res, next) => {
  const { error } = createUserSchema.validate(req.body, {
    abortEarly: false, // Show all errors, not just the first one
  });

  if (error) {
    const message = error.details.map((err) => err.message).join(", ");
    return next(new AppError(message, 400));
  }

  next(); // If no error, proceed
};

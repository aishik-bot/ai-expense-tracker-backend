import { body, validationResult } from "express-validator";
import AppError from "../utils/appError.mjs";

export const createUserValidator = (req, res, next) => {
    body("email").isEmail().withMessage("Email is required").normalizeEmail();
    body("firstname").isString().withMessage("First name is required").trim();
    body("lastname").isString().withMessage("Last name is required").trim();
    body("firebaseId").isString().withMessage("Firebase ID is required");

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new AppError(errors.array(), 400));
        }
    };

};

import asyncHandler from "../middleware/asyncHandler.mjs";
import { createMultipleCategories } from "../services/categoryService.mjs";
import sendResponse from "../utils/sendResponse.mjs";

/**
 * Add categories to the database.
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 */
export const addCategoriesToDatabase = asyncHandler(async (req, res) => {
    const { categories } = req.body;

    const createdCategories = await createMultipleCategories(categories);

    sendResponse({
        res,
        statusCode: 201,
        message: "Categories created successfully",
        data: createdCategories,
    });
});

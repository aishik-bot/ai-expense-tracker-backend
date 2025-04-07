import asyncHandler from "../middleware/asyncHandler.mjs";
import {
    createMultipleCategories,
    getAllCategories,
} from "../services/categoryService.mjs";
import sendResponse from "../utils/sendResponse.mjs";

/**
 * Add categories to the database.
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 *
 * @description
 * This controller function takes in a request body containing an array of category names,
 * creates the categories in the database, and responds with the newly created categories.
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

/**
 * Fetch all categories from the database.
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 *
 * @description
 * This controller function fetches all categories from the database and responds with them.
 */
export const getCategories = asyncHandler(async (req, res) => {
    const categories = await getAllCategories();

    sendResponse({
        res,
        statusCode: 200,
        message: "Categories fetched successfully",
        data: categories,
    });
});


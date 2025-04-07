import asyncHandler from "../middleware/asyncHandler.mjs";
import prisma from "../prisma/client.mjs";
import AppError from "../utils/appError.mjs";

/**
 * Capitalize the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} The capitalized string.
 */
const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

/**
 * Create multiple categories in the database.
 * @param {string[]} categories - Array of category names
 * @returns {Promise<import("prisma").Category[]>} Promise that resolves to an array of created categories
 */
export const createMultipleCategories = asyncHandler(async (categories) => {
    // Clean up and trim input
    const trimmed = categories.map((name) => name.trim());

    // Remove internal duplicates (case-insensitive)
    const uniqueTrimmed = [
        ...new Set(trimmed.map((name) => name.toLowerCase())),
    ];

    // Fetch existing categories (case-insensitive)
    const existingCategories = await prisma.category.findMany({
        where: {
            name: {
                in: uniqueTrimmed,
                mode: "insensitive",
            },
        },
    });

    // Get the names of existing categories (case-insensitive)
    const existingNames = existingCategories.map((c) => c.name.toLowerCase());

    // Filter new category names (not in existing)
    const newCategoryRawNames = uniqueTrimmed.filter(
        (name) => !existingNames.includes(name)
    );

    // If all categories already exist, throw an error
    if (newCategoryRawNames.length === 0) {
        throw new AppError("All categories already exist", 400);
    }

    // Capitalize only before inserting
    const formattedToInsert = newCategoryRawNames.map(capitalize);

    // Create the new categories
    const createdCategories = await prisma.category.createMany({
        data: formattedToInsert.map((name) => ({ name })),
        skipDuplicates: true,
    });

    return createdCategories;
});

/**
 * Fetch all categories from the database.
 * @returns {Promise<import("prisma").Category[]>} Promise that resolves to an array of category objects
 */
export const getAllCategories = asyncHandler(async () => {
    // Fetch all categories from the database
    const categories = await prisma.category.findMany({
        // Select only the id and name fields
        select: {
            id: true,
            name: true,
        },
    });

    // Return the categories
    return categories;
});

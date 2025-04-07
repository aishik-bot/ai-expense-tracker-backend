import asyncHandler from "../middleware/asyncHandler.mjs";
import prisma from "../prisma/client.mjs";
import AppError from "../utils/appError.mjs";

// Service to get expenses by user ID with optional filtering by category
export const getExpenses = asyncHandler(
    async ({ userId, categoryId, page, limit, orderBy, month, year, date }) => {
        // Calculate the number of records to skip for pagination
        const skip = (page - 1) * limit;

        // Define the sorting options based on the orderBy parameter
        const orderByOptions = {
            createdAt: orderBy === "asc" ? "asc" : "desc",
        };

        // Initialize an empty object to store date filtering options
        let dateFilter = {};

        // If month and year are provided, filter expenses by that month
        if (month && year) {
            // Calculate the start and end dates of the month
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 1); // Start of next month

            // Set the createdAt date range to filter expenses
            dateFilter.createdAt = {
                gte: startDate,
                lt: endDate,
            };
        }

        // If a specific date is provided, filter expenses by that date
        if (date) {
            // Parse the input date
            const inputDate = new Date(date);
            // Calculate the next day
            const nextDay = new Date(inputDate);
            nextDay.setDate(inputDate.getDate() + 1);

            // Set the createdAt date range to filter expenses
            dateFilter.createdAt = {
                gte: inputDate,
                lt: nextDay,
            };
        }

        // Construct the where clause with optional category filtering
        const whereClause = {
            userId,
            ...(categoryId && { categoryId }),
            ...dateFilter,
        };

        // Fetch expenses and count total expenses for the user within a transaction
        const [expenses, totalExpenses] = await prisma.$transaction([
            prisma.expense.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: orderByOptions,
                select: {
                    id: true,
                    amount: true,
                    description: true,
                    category: {
                        select: {
                            name: true,
                        },
                    },
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            // Count the total number of expenses for pagination metadata
            prisma.expense.count({
                where: whereClause,
            }),
        ]);

        // Calculate the total number of pages for the current limit
        const totalPages = Math.ceil(totalExpenses / limit);

        // Return the expenses along with pagination metadata
        return {
            expenses,
            meta: {
                totalItems: totalExpenses,
                currentPage: page,
                totalPages,
                limit,
            },
        };
    }
);

/**
 * Deletes an expense by its ID from the database.
 * @param {string} expenseId The ID of the expense to delete
 * @throws {AppError} If the expense is not found
 */
export const deleteExpenseById = asyncHandler(async (expenseId) => {
    // Find the expense to delete
    const existingExpense = await prisma.expense.findUnique({
        where: { id: expenseId },
    });

    if (!existingExpense) {
        // If the expense is not found, throw a 404 error
        throw new AppError("Expense not found", 404);
    }

    // Delete the expense
    return await prisma.expense.delete({
        where: {
            id: expenseId,
        },
    });
});



/**
 * Edits an expense by its ID in the database.
 * @param {string} expenseId The ID of the expense to edit
 * @param {Object} data The data to update the expense with
 * @returns {Promise<import("prisma").Expense>} The updated expense
 * @throws {AppError} If the expense is not found
 * @throws {AppError} If the category is not found
 */
export const editExpenseById = asyncHandler(async (expenseId, data) => {
    // Find the expense to edit
    const existingExpense = await prisma.expense.findUnique({
        where: { id: expenseId },
        select: {
            id: true,
        },
    });

    // If the expense is not found, throw a 404 error
    if (!existingExpense) {
        throw new AppError("Expense not found", 404);
    }

    // Validate the category ID if provided
    if (data.categoryId) {
        const category = await prisma.category.findUnique({
            where: { id: data.categoryId },
            select: {
                id: true,
            },
        });

        // If the category is not found, throw a 404 error
        if (!category) {
            throw new AppError("Category not found", 404);
        }
    }

    // Update the expense
    return await prisma.expense.update({
        where: { id: expenseId },
        data,
    });
});

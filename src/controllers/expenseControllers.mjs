import asyncHandler from "../middleware/asyncHandler.mjs";
import { deleteExpenseById, getExpenses } from "../services/expenseService.mjs";
import AppError from "../utils/appError.mjs";
import sendResponse from "../utils/sendResponse.mjs";

/**
 * Controller function to get all expenses for a user by user ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getExpensesByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const {
        categoryId,
        page = 1,
        limit = 10,
        orderBy = "desc",
        month,
        year,
        date,
    } = req.query;

    // Parse the page and limit query parameters
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(Math.max(1, parseInt(limit, 10) || 10), 100); // Cap limit to 100

    // Parse the month and year query parameters
    const parsedMonth = month ? parseInt(month, 10) : undefined;
    const parsedYear = year ? parseInt(year, 10) : undefined;

    // Check if both month and year query parameters are present
    if ((month && !year) || (!month && year)) {
        throw new AppError(
            "Both month and year must be provided together",
            400
        );
    }

    // Check if date query parameter is present with month or year query parameters
    if (date && (month || year)) {
        throw new AppError(
            "Date cannot be used with month or year filters",
            400
        );
    }

    // Check if month query parameter is within valid range
    if (parsedMonth && (parsedMonth < 1 || parsedMonth > 12)) {
        throw new AppError("Month must be between 1 and 12", 400);
    }

    // Check if year query parameter is within valid range
    if (parsedYear && (parsedYear < 1900 || parsedYear > 2100)) {
        throw new AppError("Year must be between 1900 and 2100", 400);
    }

    // Check if date query parameter is in valid format
    if (date && isNaN(Date.parse(date))) {
        throw new AppError("Invalid date format. Use YYYY-MM-DD", 400);
    }

    /**
     * Call the getExpenses service function to fetch the expenses
     * from the database. Pass the required parameters to the service function.
     */
    const expenses = await getExpenses({
        userId,
        categoryId,
        page: parsedPage,
        limit: parsedLimit,
        orderBy,
        month: parsedMonth,
        year: parsedYear,
        date,
    });

    /**
     * Send the response back to the client with the
     * fetched expenses and a success message.
     */
    sendResponse({
        res,
        statusCode: 200,
        message: "Expenses fetched successfully",
        data: expenses,
    });
});



/**
 * Controller function to delete an expense by its ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const deleteExpense = asyncHandler(async (req, res) => {
    const { expenseId } = req.params;

    // Delete the expense from the database
    await deleteExpenseById(expenseId);

    // Send a success message back to the client
    sendResponse({
        res,
        statusCode: 200,
        message: "Expense deleted successfully",
    });
});

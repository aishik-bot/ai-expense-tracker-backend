import asyncHandler from "../middleware/asyncHandler.mjs";
import { getExpenses } from "../services/expenseService.mjs";
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

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(Math.max(1, parseInt(limit, 10) || 10), 100); // Cap limit to 100
    const parsedMonth = month ? parseInt(month, 10) : undefined;
    const parsedYear = year ? parseInt(year, 10) : undefined;

    if ((month && !year) || (!month && year)) {
        throw new AppError(
            "Both month and year must be provided together",
            400
        );
    }

    if (date && (month || year)) {
        throw new AppError(
            "Date cannot be used with month or year filters",
            400
        );
    }

    if (parsedMonth && (parsedMonth < 1 || parsedMonth > 12)) {
        throw new AppError("Month must be between 1 and 12", 400);
    }

    if (parsedYear && (parsedYear < 1900 || parsedYear > 2100)) {
        throw new AppError("Year must be between 1900 and 2100", 400);
    }

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

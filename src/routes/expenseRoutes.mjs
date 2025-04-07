import express from "express";

import {
    deleteExpense,
    editExpense,
    getExpensesByUserId,
} from "../controllers/expenseControllers.mjs";
import { verifyToken } from "../middleware/authMiddleware.mjs";
import { validateUpdateExpense } from "../validators/expenseValidators.mjs";

const router = express.Router();

router.route("/user/:userId").get(verifyToken, getExpensesByUserId);
router
    .route("/:expenseId")
    .delete(verifyToken, deleteExpense)
    .patch(verifyToken, validateUpdateExpense, editExpense);

export default router;

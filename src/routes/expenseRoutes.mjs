import express from "express";

import { verifyToken } from "../middleware/authMiddleware.mjs";
import {
    deleteExpense,
    getExpensesByUserId,
} from "../controllers/expenseControllers.mjs";

const router = express.Router();

router.route("/user/:userId").get(verifyToken, getExpensesByUserId);
router.route("/:expenseId").delete(verifyToken, deleteExpense);

export default router;

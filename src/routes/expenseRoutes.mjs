import express from "express";

import { verifyToken } from "../middleware/authMiddleware.mjs";
import { getExpensesByUserId } from "../controllers/expenseControllers.mjs";

const router = express.Router();

router.route("/user/:userId").get(verifyToken, getExpensesByUserId);

export default router;

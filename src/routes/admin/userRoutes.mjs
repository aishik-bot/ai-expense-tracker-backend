import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.mjs";
import { requireRole } from "../../middleware/requireRole.mjs";
import { getAllUsersByAdmin } from "../../controllers/userController.mjs";

const router = express.Router();

router
    .route("/all")
    .get(verifyToken, requireRole('SUPER_ADMIN'), getAllUsersByAdmin);

export default router;
import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.mjs";

import { getAllUsersByAdmin } from "../../controllers/userController.mjs";
import { requireRole } from "../../middleware/roleMiddleware.mjs";

const router = express.Router();

router
    .route("/all")
    .get(verifyToken, requireRole("SUPER_ADMIN"), getAllUsersByAdmin);

export default router;

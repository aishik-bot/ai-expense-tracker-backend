import express from "express";
import { createUserValidator } from "../validators/userValidators.mjs";
import {
    getUserDetails,
    registerUser,
} from "../controllers/userController.mjs";
import { verifyToken } from "../middleware/authMiddleware.mjs";

const router = express.Router();

// route to register a new user
router.route("/").post(createUserValidator, registerUser);

// route to get the details of the currently logged in user
router.route("/me").get(verifyToken, getUserDetails);

export default router;

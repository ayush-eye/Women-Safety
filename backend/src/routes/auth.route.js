import { registerUser, loginUser } from "../controllers/auth.controller.js";
import express from "express";
import {authMiddleware, authorizeRole} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);




export default router;
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createAlert, getAlerts } from "../controllers/alert.controller.js";

const router = express.Router();

/**
 * - Create alert (Authenticated users)
 */
router.post('/alerts', authMiddleware, createAlert);

/**
 * - Get all alerts (Admin only)
 */
router.get('/alerts', authMiddleware, getAlerts);


export default router;
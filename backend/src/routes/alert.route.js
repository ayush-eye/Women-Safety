import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createAlert, getAlerts } from "../controllers/alert.controller.js";

const router = express.Router();

// router.post('/alerts', createAlert);
router.post('/alerts', authMiddleware, createAlert);

//get alerts
router.get('/alerts', authMiddleware, getAlerts);


export default router;
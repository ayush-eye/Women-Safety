
import express from "express";
import { calluser, callStatus } from "../controllers/sos.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post('/sos-call', authMiddleware, calluser);
router.post("/call-status", callStatus);

export default router;
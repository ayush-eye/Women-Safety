
import express from "express";
import { calluser } from "../controllers/sos.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post('/sos-call', calluser);




export default router;
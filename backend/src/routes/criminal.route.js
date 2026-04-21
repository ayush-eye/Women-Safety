import express from "express";
import { authMiddleware, authorizeRole } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  addCriminal,
  getCriminals,
  identifyCriminal,
} from "../controllers/criminal.controller.js";

const router = express.Router();

router.post(
  "/add",
  authMiddleware,
  authorizeRole(["ADMIN"]),
  upload.single("photo"),
  addCriminal
);
router.get("/", authMiddleware, authorizeRole(["ADMIN"]), getCriminals);
router.post("/identify", authMiddleware, upload.single("photo"), identifyCriminal);

export default router;

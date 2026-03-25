import { getprofile, uploadProfile, updateContacts } from "../controllers/user.controller.js";
import express from "express";
import { authMiddleware, authorizeRole } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/me",authMiddleware, authorizeRole(["USER","ADMIN"]), getprofile);
router.post("/update-contacts",authMiddleware, authorizeRole(["USER","ADMIN"]), updateContacts);
router.post("/upload-profile",authMiddleware,authorizeRole(["USER","ADMIN"]),upload.single("profilePhoto"),uploadProfile);

export default router;
import { registerUser, loginUser } from "../controllers/user.controller.js";
import express from "express";
import {authMiddleware, authorizeRole} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile', authMiddleware, authorizeRole(["ADMIN","USER"]), (req,res)=>{
    res.json({ message: "Authorized", user: req.user });
});


export default router;
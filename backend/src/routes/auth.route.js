import { registerUser, loginUser } from "../controllers/user.controller.js";
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile', authMiddleware, (req,res)=>{
    res.json({ message: "Authorized", user: req.user });
});


export default router;
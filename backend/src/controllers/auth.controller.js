import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User
const registerUser = async (req, res) => {
  try {

    const { name, email, password, contact, emergency_contacts } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      contact,
      emergency_contacts
    });

     const userobj = user.toObject();
    delete userobj.password;


    res.status(201).json({
      message: "User registered successfully",
      user: userobj
    });

  } catch (error) {

    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });

  }
};


// Login User
const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // create JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    // store token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    const userobj = user.toObject();
    delete userobj.password;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userobj
    });

  }
  catch (error) {

    res.status(500).json({
      message: "Login failed",
      error: error.message
    });

  }
};

export {
  registerUser,
  loginUser
};
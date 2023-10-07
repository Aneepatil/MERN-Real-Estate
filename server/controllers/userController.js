import { User } from "../models/UserModel.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: await hashedPassword,
    });
    res
      .status(201)
      .json({
        status: "success",
        message: "User registered successfully",
        newUser,
      });
  } catch (error) {
    res.status(500).json({ status: "failed", errorMessage:error.message });
  }
};

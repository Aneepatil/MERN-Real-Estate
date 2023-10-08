import { User } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { appError } from "../utils/appError.js";
import { hashPassword } from "../utils/hashPassword.js";

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {

    // Is email registered
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return next(appError(500, "Email Already Exist"));
    }

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: await hashPassword(password),
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      newUser,
    });
  } catch (error) {
    next(error);
    // res.status(500).json({ status: "failed", errorMessage:error.message });
  }
};

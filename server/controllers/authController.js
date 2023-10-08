import { User } from "../models/UserModel.js";
import { appError } from "../utils/appError.js";
import { comparePassword } from "../utils/comparePassword.js";
import { generateToken } from "../utils/generateToken.js";
import { hashPassword } from "../utils/hashPassword.js";

// Register Users

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
  }
};

// Login Users

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Is email registered
    const isUserExist = await User.findOne({ email });
    if (!isUserExist) return next(appError(404, "Invalid Login Credentials"));

    // Match Password
    const originalPass = await comparePassword(password, isUserExist);

    // Is password matched
    if (!originalPass) return next(appError(404, "Invalid Login Credentials"));

    if (isUserExist && originalPass) {
      const { password, ...others } = isUserExist._doc;
      const token = await generateToken(isUserExist._id);
      res
        .cookie("access-token", token, { httpOnly: true })
        .status(200)
        .json({
          status: "success",
          message: "User logged in successfully",
          user: { ...others, token },
        });
    }
  } catch (error) {
    next(error);
  }
};

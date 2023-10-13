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
      success: true,
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
      const { password, ...rest } = isUserExist._doc;
      const token = await generateToken(isUserExist._id);
      res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

// Google Sign in

export const googleSignin = async (req, res, next) => {
  try {
    // Is email registered
    const user = await User.findOne({ email:req.body.email });

    if (user) {
      const token = await generateToken(user._id);
      const { password, ...rest } = user._doc;
      res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = await hashPassword(generatePassword);
      const newUser = await User.create({
        username: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      const token = await generateToken(newUser._id);
      const { password, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

import { app } from "../../client/src/firebase.js";
import { User } from "../models/UserModel.js";
import { appError } from "../utils/appError.js";
import { hashPassword } from "../utils/hashPassword.js";

// Getting all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res
      .status(200)
      .json({ success: true, message: "User fetched successfully...", users });
  } catch (error) {
    next(error);
  }
};

// Updating User Profile
export const updateUser = async (req, res, next) => {
  if (req.user !== req.params.id) {
    return next(appError(403, "You only can update your own account"));
  }

  try {
    // Hash the password again
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Deleting User
export const deleteUser = async (req, res, next) => {
  try {
    if (req.user !== req.params.id) {
      return next(appError(401, "You only can delete your own account"));
    }
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User deleted successfully...");
  } catch (error) {
    next(error);
  }
};

// Sign out User
export const signOutUser = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User signed out successfully...");
  } catch (error) {
    next(error);
  }
};


// Get user
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user) return next(appError(404, 'User Not Found...'))

    const {password,...other}=user._doc
    res
      .status(200)
      .json({ success: true, message: "User fetched successfully...", other });
  } catch (error) {
    next(error);
  }
};
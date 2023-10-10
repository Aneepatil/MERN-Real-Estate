import express from "express";
import { getAllUsers, updateUser } from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyToken.js";

const userRoute = express.Router();

userRoute.get("/", getAllUsers);
userRoute.put("/update/:id",verifyToken, updateUser);

export default userRoute;

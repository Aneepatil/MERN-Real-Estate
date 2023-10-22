import express from "express";
import { deleteUser, getAllUsers, getUser, updateUser } from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyToken.js";

const userRoute = express.Router();

userRoute.get("/", getAllUsers);
userRoute.put("/update/:id",verifyToken, updateUser);
userRoute.delete("/delete/:id",verifyToken, deleteUser);
userRoute.get("/:id",verifyToken, getUser);

export default userRoute;

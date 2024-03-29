import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { createProperty, deleteProperty, getAllPropertiesOfPerticualarUser, getProperties, getProperty, updateProperty } from "../controllers/propertiesController.js";

const propertiesRoute = express.Router();

propertiesRoute.post("/",verifyToken, createProperty);
propertiesRoute.get("/", getProperties);
propertiesRoute.get("/:id", getProperty);
propertiesRoute.get("/list/:userId",verifyToken, getAllPropertiesOfPerticualarUser);
propertiesRoute.put("/:id",verifyToken, updateProperty);
propertiesRoute.delete("/:id",verifyToken, deleteProperty);

export default propertiesRoute;

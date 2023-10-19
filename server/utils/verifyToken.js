import { appError } from "./appError.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
//   console.log(token)
 

  if (!token) return next(appError(401, "Unauthorized"));
  jwt.verify(token, process.env.JWT_SEC_KEY, (error, user) => {
    if (error) return next(appError(403, "Forbidden"));
    req.user = user.id;
    next();
  });
};

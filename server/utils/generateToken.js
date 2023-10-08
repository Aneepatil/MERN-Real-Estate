import jwt from "jsonwebtoken";

export const generateToken = async (id) => {
  return await jwt.sign({ id }, process.env.JWT_SEC_KEY, { expiresIn: "2d" });
};

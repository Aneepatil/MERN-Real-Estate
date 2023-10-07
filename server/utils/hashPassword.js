import bcrypt from "bcryptjs";

export const hashPassword = async () => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

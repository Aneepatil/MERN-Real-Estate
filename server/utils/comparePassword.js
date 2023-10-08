import bcrypt from "bcryptjs";

export const comparePassword = async (password,user) => {
  const originalPassword = await bcrypt.compare(password, user.password);
  return originalPassword;
};


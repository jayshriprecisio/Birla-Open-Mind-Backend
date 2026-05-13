import bcrypt from "bcryptjs";
import { getUserByEmail } from "./auth.repository";
import { generateToken } from "@/backend/utils/jwt";
import { resolveRoleId } from "@/backend/utils/roles";

export const loginService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    schoolId: user.school_id,
    schoolCode: user.school_code,
  });

  return {
    user: { ...user },
    token,
  };
};
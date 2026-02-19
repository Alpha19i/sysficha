import type { AuthTokenPayload, LoginInput } from "@/types/auth";
import type { User } from "@/types/user";

type LoginDeps = {
  findUserByUsername: (username: string) => Promise<User | null>;
  verifyPassword: (plain: string, hash: string) => Promise<boolean>;
  generateToken: (payload: AuthTokenPayload) => string;
};

export async function login(input: LoginInput, deps: LoginDeps) {
  const user = await deps.findUserByUsername(input.username);
  if (!user || !user.active) {
    throw new Error("Invalid credentials");
  }

  const validPassword = await deps.verifyPassword(input.password, user.passwordHash);
  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  return deps.generateToken({
    sub: user.id,
    username: user.username,
    role: user.role
  });
}

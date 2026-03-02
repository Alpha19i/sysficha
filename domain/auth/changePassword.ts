import type { ChangePasswordInput } from "@/types/auth";
import type { User } from "@/types/user";

type ChangePasswordDeps = {
  findUserById: (id: string) => Promise<User | null>;
  verifyPassword: (plain: string, hash: string) => Promise<boolean>;
  hashPassword: (plain: string) => Promise<string>;
  updatePasswordHash: (id: string, passwordHash: string) => Promise<void>;
};

export async function changePassword(
  userId: string,
  input: ChangePasswordInput,
  deps: ChangePasswordDeps
) {
  const user = await deps.findUserById(userId);
  if (!user || !user.active) {
    throw new Error("Unauthorized");
  }

  const validCurrentPassword = await deps.verifyPassword(input.currentPassword, user.passwordHash);
  if (!validCurrentPassword) {
    throw new Error("Invalid credentials");
  }

  if (input.currentPassword === input.newPassword) {
    throw new Error("New password must be different");
  }

  const passwordHash = await deps.hashPassword(input.newPassword);
  await deps.updatePasswordHash(user.id, passwordHash);
}

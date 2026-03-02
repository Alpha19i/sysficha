import type { UserRole } from "@/types/user";

export type LoginInput = {
  username: string;
  password: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type AuthTokenPayload = {
  sub: string;
  username: string;
  role: UserRole;
};

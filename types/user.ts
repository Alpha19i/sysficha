export type UserRole = "admin" | "rh" | "viewer";

export type User = {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
};

export type PublicUser = Omit<User, "passwordHash">;

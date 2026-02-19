import { describe, expect, it } from "vitest";
import { login } from "@/domain/auth/login";
import type { User } from "@/types/user";

const baseUser: User = {
  id: "u-1",
  username: "john",
  passwordHash: "hashed",
  role: "admin",
  active: true,
  createdAt: new Date().toISOString()
};

describe("domain/auth/login", () => {
  it("returns token for valid credentials", async () => {
    const token = await login(
      { username: "john", password: "secret" },
      {
        findUserByUsername: async () => baseUser,
        verifyPassword: async () => true,
        generateToken: () => "jwt-token"
      }
    );

    expect(token).toBe("jwt-token");
  });

  it("throws for missing user", async () => {
    await expect(
      login(
        { username: "john", password: "secret" },
        {
          findUserByUsername: async () => null,
          verifyPassword: async () => true,
          generateToken: () => "jwt-token"
        }
      )
    ).rejects.toThrow("Invalid credentials");
  });

  it("throws for invalid password", async () => {
    await expect(
      login(
        { username: "john", password: "secret" },
        {
          findUserByUsername: async () => baseUser,
          verifyPassword: async () => false,
          generateToken: () => "jwt-token"
        }
      )
    ).rejects.toThrow("Invalid credentials");
  });
});

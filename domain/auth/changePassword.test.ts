import { describe, expect, it, vi } from "vitest";
import { changePassword } from "@/domain/auth/changePassword";
import type { User } from "@/types/user";

const baseUser: User = {
  id: "u-1",
  username: "john",
  passwordHash: "hashed",
  role: "admin",
  active: true,
  createdAt: new Date().toISOString()
};

describe("domain/auth/changePassword", () => {
  it("updates password hash when current password is valid", async () => {
    const updatePasswordHash = vi.fn();

    await changePassword(
      "u-1",
      { currentPassword: "secret", newPassword: "new-secret" },
      {
        findUserById: async () => baseUser,
        verifyPassword: async () => true,
        hashPassword: async () => "new-hash",
        updatePasswordHash
      }
    );

    expect(updatePasswordHash).toHaveBeenCalledWith("u-1", "new-hash");
  });

  it("throws when current password is invalid", async () => {
    await expect(
      changePassword(
        "u-1",
        { currentPassword: "secret", newPassword: "new-secret" },
        {
          findUserById: async () => baseUser,
          verifyPassword: async () => false,
          hashPassword: async () => "new-hash",
          updatePasswordHash: async () => {}
        }
      )
    ).rejects.toThrow("Invalid credentials");
  });

  it("throws when new password matches current password", async () => {
    await expect(
      changePassword(
        "u-1",
        { currentPassword: "same-password", newPassword: "same-password" },
        {
          findUserById: async () => baseUser,
          verifyPassword: async () => true,
          hashPassword: async () => "new-hash",
          updatePasswordHash: async () => {}
        }
      )
    ).rejects.toThrow("New password must be different");
  });
});

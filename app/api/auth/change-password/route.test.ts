import { describe, expect, it, vi } from "vitest";

const changePasswordInfraMock = vi.fn();
vi.mock("@/infra/auth/changePasswordInfra", () => ({
  changePasswordInfra: changePasswordInfraMock
}));

describe("POST /api/auth/change-password route", () => {
  it("delegates request body + token to changePasswordInfra", async () => {
    const { POST } = await import("./route");
    const expectedResponse = new Response(JSON.stringify({ changed: true }), { status: 200 });
    changePasswordInfraMock.mockResolvedValueOnce(expectedResponse);

    const request = new Request("http://localhost/api/auth/change-password", {
      method: "POST",
      headers: { cookie: "token=abc123" },
      body: JSON.stringify({ currentPassword: "secret", newPassword: "new-secret" })
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(changePasswordInfraMock).toHaveBeenCalledWith(
      { currentPassword: "secret", newPassword: "new-secret" },
      "abc123"
    );
  });
});

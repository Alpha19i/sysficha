import { describe, expect, it, vi } from "vitest";

const loginInfraMock = vi.fn();
vi.mock("@/infra/auth/loginInfra", () => ({
  loginInfra: loginInfraMock
}));

describe("POST /api/auth/login route", () => {
  it("delegates request body to loginInfra", async () => {
    const { POST } = await import("./route");
    const expectedResponse = new Response(JSON.stringify({ logged: true }), { status: 200 });
    loginInfraMock.mockResolvedValueOnce(expectedResponse);

    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: "john", password: "secret" })
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(loginInfraMock).toHaveBeenCalledWith({ username: "john", password: "secret" });
  });
});

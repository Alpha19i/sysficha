import { describe, expect, it, vi } from "vitest";

const createFichaInfraMock = vi.fn();
const listFichasInfraMock = vi.fn();

vi.mock("@/infra/ficha/createFichaInfra", () => ({
  createFichaInfra: createFichaInfraMock
}));

vi.mock("@/infra/ficha/listFichasInfra", () => ({
  listFichasInfra: listFichasInfraMock
}));

describe("/api/fichas route", () => {
  it("POST delegates token + body to createFichaInfra", async () => {
    const { POST } = await import("./route");
    createFichaInfraMock.mockResolvedValueOnce(new Response("{}", { status: 201 }));

    const request = new Request("http://localhost/api/fichas", {
      method: "POST",
      headers: { cookie: "token=abc123" },
      body: JSON.stringify({ servidorNome: "Maria", cpf: "12345678901", payloadJson: {} })
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    expect(createFichaInfraMock).toHaveBeenCalled();
  });

  it("GET delegates token + params to listFichasInfra", async () => {
    const { GET } = await import("./route");
    listFichasInfraMock.mockResolvedValueOnce(new Response("{}", { status: 200 }));

    const request = new Request("http://localhost/api/fichas?page=1&limit=20", {
      method: "GET",
      headers: { cookie: "token=abc123" }
    });

    const response = await GET(request);
    expect(response.status).toBe(200);
    expect(listFichasInfraMock).toHaveBeenCalled();
  });
});

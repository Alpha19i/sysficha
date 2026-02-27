import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Ficha } from "@/types/ficha";

const connectToDatabaseMock = vi.fn();
const getAuthContextFromTokenMock = vi.fn();

vi.mock("@/app/db/mongo", () => ({
  connectToDatabase: connectToDatabaseMock
}));

vi.mock("@/infra/auth/helpers", () => ({
  getAuthContextFromToken: getAuthContextFromTokenMock
}));

describe("createFichaInfra", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAuthContextFromTokenMock.mockResolvedValue({ userId: "admin-1", role: "admin" });
  });

  it("returns 409 when cpf already exists", async () => {
    const findOne = vi.fn().mockResolvedValue({ id: "existing-1", cpf: "12345678901" });
    const insertOne = vi.fn();
    const collection = vi.fn().mockReturnValue({ findOne, insertOne });
    connectToDatabaseMock.mockResolvedValue({ collection });

    const { createFichaInfra } = await import("./createFichaInfra");

    const response = await createFichaInfra("token", {
      servidorNome: "Maria",
      cpf: "123.456.789-01",
      payloadJson: { nome: "Maria" }
    });

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({
      created: false,
      message: "CPF already exists"
    });
    expect(insertOne).not.toHaveBeenCalled();
  });

  it("creates ficha once and normalizes cpf", async () => {
    const findOne = vi.fn().mockResolvedValue(null);
    const insertOne = vi.fn().mockResolvedValue(undefined);
    const collection = vi.fn().mockReturnValue({ findOne, insertOne });
    connectToDatabaseMock.mockResolvedValue({ collection });

    const { createFichaInfra } = await import("./createFichaInfra");

    const response = await createFichaInfra("token", {
      servidorNome: "Maria",
      cpf: "123.456.789-01",
      payloadJson: { nome: "Maria" }
    });

    expect(response.status).toBe(201);
    expect(insertOne).toHaveBeenCalledTimes(1);

    const inserted = insertOne.mock.calls[0][0] as Ficha;
    expect(inserted.cpf).toBe("12345678901");
  });
});

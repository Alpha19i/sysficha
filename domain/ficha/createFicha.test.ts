import { describe, expect, it } from "vitest";
import { createFicha } from "@/domain/ficha/createFicha";
import type { Ficha } from "@/types/ficha";

describe("domain/ficha/createFicha", () => {
  it("creates ficha for admin/rh", async () => {
    const saved: Ficha[] = [];
    const fichaId = await createFicha(
      "token",
      { servidorNome: "Maria", cpf: "12345678901", payloadJson: { a: 1 } },
      {
        getAuthContext: async () => ({ userId: "u-1", role: "rh" }),
        saveFicha: async (ficha) => {
          saved.push(ficha);
        },
        generateId: () => "f-1",
        now: () => "2026-02-19T00:00:00.000Z"
      }
    );

    expect(fichaId).toBe("f-1");
    expect(saved[0]?.createdBy).toBe("u-1");
  });

  it("blocks viewer", async () => {
    await expect(
      createFicha(
        "token",
        { servidorNome: "Maria", cpf: "12345678901", payloadJson: {} },
        {
          getAuthContext: async () => ({ userId: "u-2", role: "viewer" }),
          saveFicha: async () => {},
          generateId: () => "f-1",
          now: () => "2026-02-19T00:00:00.000Z"
        }
      )
    ).rejects.toThrow("Not allowed");
  });
});

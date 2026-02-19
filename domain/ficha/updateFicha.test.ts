import { describe, expect, it } from "vitest";
import { updateFicha } from "@/domain/ficha/updateFicha";
import type { Ficha } from "@/types/ficha";

const ficha: Ficha = {
  id: "f-1",
  servidorNome: "Maria",
  cpf: "12345678901",
  payloadJson: {},
  createdBy: "u-1",
  createdAt: "2026-02-01T00:00:00.000Z",
  updatedAt: "2026-02-01T00:00:00.000Z"
};

describe("domain/ficha/updateFicha", () => {
  it("updates existing ficha for rh", async () => {
    let updated = false;

    await updateFicha("token", "f-1", { servidorNome: "Maria B" }, {
      getAuthContext: async () => ({ userId: "u-1", role: "rh" }),
      findFichaById: async () => ficha,
      saveUpdatedFicha: async () => {
        updated = true;
      },
      now: () => "2026-02-19T00:00:00.000Z"
    });

    expect(updated).toBe(true);
  });

  it("throws for not found", async () => {
    await expect(
      updateFicha("token", "f-404", { servidorNome: "X" }, {
        getAuthContext: async () => ({ userId: "u-1", role: "admin" }),
        findFichaById: async () => null,
        saveUpdatedFicha: async () => {},
        now: () => "2026-02-19T00:00:00.000Z"
      })
    ).rejects.toThrow("Ficha not found");
  });
});

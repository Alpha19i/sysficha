import { describe, expect, it } from "vitest";
import { listFichas } from "@/domain/ficha/listFichas";

describe("domain/ficha/listFichas", () => {
  it("returns paginated result when authenticated", async () => {
    const result = await listFichas("token", { page: 1, limit: 20, search: "" }, {
      getAuthContext: async () => ({ userId: "u-1", role: "viewer" }),
      listFichas: async () => ({ items: [], page: 1, limit: 20, total: 0 })
    });

    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
    expect(result.total).toBe(0);
  });
});

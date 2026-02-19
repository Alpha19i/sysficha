import type { AuthContext, Ficha, UpdateFichaInput } from "@/types/ficha";

type UpdateFichaDeps = {
  getAuthContext: (token: string | undefined) => Promise<AuthContext>;
  findFichaById: (id: string) => Promise<Ficha | null>;
  saveUpdatedFicha: (id: string, update: UpdateFichaInput & { updatedAt: string }) => Promise<void>;
  now: () => string;
};

export async function updateFicha(
  token: string | undefined,
  id: string,
  input: UpdateFichaInput,
  deps: UpdateFichaDeps
) {
  const auth = await deps.getAuthContext(token);
  if (auth.role !== "admin" && auth.role !== "rh") {
    throw new Error("Not allowed");
  }

  const existing = await deps.findFichaById(id);
  if (!existing) {
    throw new Error("Ficha not found");
  }

  await deps.saveUpdatedFicha(id, { ...input, updatedAt: deps.now() });
  return true;
}

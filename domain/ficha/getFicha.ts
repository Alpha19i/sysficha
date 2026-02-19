import type { AuthContext, Ficha } from "@/types/ficha";

type GetFichaDeps = {
  getAuthContext: (token: string | undefined) => Promise<AuthContext>;
  findFichaById: (id: string) => Promise<Ficha | null>;
};

export async function getFicha(token: string | undefined, id: string, deps: GetFichaDeps) {
  await deps.getAuthContext(token);
  const ficha = await deps.findFichaById(id);
  if (!ficha) {
    throw new Error("Ficha not found");
  }
  return ficha;
}

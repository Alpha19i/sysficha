import type { PaginatedFichas } from "@/types/api";
import type { AuthContext } from "@/types/ficha";

export type ListFichasInput = {
  page: number;
  limit: number;
  search: string;
};

type ListFichasDeps = {
  getAuthContext: (token: string | undefined) => Promise<AuthContext>;
  listFichas: (input: ListFichasInput) => Promise<PaginatedFichas>;
};

export async function listFichas(
  token: string | undefined,
  input: ListFichasInput,
  deps: ListFichasDeps
) {
  await deps.getAuthContext(token);
  return deps.listFichas(input);
}

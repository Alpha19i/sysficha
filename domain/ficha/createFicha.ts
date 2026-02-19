import type { AuthContext, CreateFichaInput, Ficha } from "@/types/ficha";

type CreateFichaDeps = {
  getAuthContext: (token: string | undefined) => Promise<AuthContext>;
  saveFicha: (ficha: Ficha) => Promise<void>;
  generateId: () => string;
  now: () => string;
};

export async function createFicha(
  token: string | undefined,
  input: CreateFichaInput,
  deps: CreateFichaDeps
) {
  const auth = await deps.getAuthContext(token);
  if (auth.role !== "admin" && auth.role !== "rh") {
    throw new Error("Not allowed");
  }

  const timestamp = deps.now();
  const ficha: Ficha = {
    id: deps.generateId(),
    servidorNome: input.servidorNome,
    cpf: input.cpf,
    payloadJson: input.payloadJson,
    createdBy: auth.userId,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  await deps.saveFicha(ficha);
  return ficha.id;
}

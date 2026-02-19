import type { UserRole } from "@/types/user";

export type FichaPayload = Record<string, unknown>;

export type Ficha = {
  id: string;
  servidorNome: string;
  cpf: string;
  payloadJson: FichaPayload;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateFichaInput = {
  servidorNome: string;
  cpf: string;
  payloadJson: FichaPayload;
};

export type UpdateFichaInput = Partial<CreateFichaInput>;

export type AuthContext = {
  userId: string;
  role: UserRole;
};

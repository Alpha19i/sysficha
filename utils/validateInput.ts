import type { ChangePasswordInput, LoginInput } from "@/types/auth";
import type { CreateFichaInput, UpdateFichaInput } from "@/types/ficha";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireNonEmptyString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Validation failed: ${field} is required`);
  }
  return value.trim();
}

function normalizeCpf(input: string) {
  return input.replace(/\D/g, "");
}

export function parseLoginInput(input: unknown): LoginInput {
  if (!isObject(input)) {
    throw new Error("Validation failed: body must be an object");
  }

  return {
    username: requireNonEmptyString(input.username, "username"),
    password: requireNonEmptyString(input.password, "password")
  };
}

export function parseChangePasswordInput(input: unknown): ChangePasswordInput {
  if (!isObject(input)) {
    throw new Error("Validation failed: body must be an object");
  }

  return {
    currentPassword: requireNonEmptyString(input.currentPassword, "currentPassword"),
    newPassword: requireNonEmptyString(input.newPassword, "newPassword")
  };
}

export function parseCreateFichaInput(input: unknown): CreateFichaInput {
  if (!isObject(input)) {
    throw new Error("Validation failed: body must be an object");
  }

  const servidorNome = requireNonEmptyString(input.servidorNome, "servidorNome");
  const cpf = normalizeCpf(requireNonEmptyString(input.cpf, "cpf"));
  if (cpf.length !== 11) {
    throw new Error("Validation failed: cpf must contain 11 digits");
  }

  const payloadJson = input.payloadJson;
  if (!isObject(payloadJson)) {
    throw new Error("Validation failed: payloadJson must be an object");
  }

  return { servidorNome, cpf, payloadJson };
}

export function parseUpdateFichaInput(input: unknown): UpdateFichaInput {
  if (!isObject(input)) {
    throw new Error("Validation failed: body must be an object");
  }

  const update: UpdateFichaInput = {};

  if (input.servidorNome !== undefined) {
    update.servidorNome = requireNonEmptyString(input.servidorNome, "servidorNome");
  }

  if (input.cpf !== undefined) {
    const cpf = normalizeCpf(requireNonEmptyString(input.cpf, "cpf"));
    if (cpf.length !== 11) {
      throw new Error("Validation failed: cpf must contain 11 digits");
    }
    update.cpf = cpf;
  }

  if (input.payloadJson !== undefined) {
    if (!isObject(input.payloadJson)) {
      throw new Error("Validation failed: payloadJson must be an object");
    }
    update.payloadJson = input.payloadJson;
  }

  if (Object.keys(update).length === 0) {
    throw new Error("Validation failed: at least one field must be provided");
  }

  return update;
}

export function parsePagination(searchParams: URLSearchParams) {
  const rawPage = Number(searchParams.get("page") ?? 1);
  const rawLimit = Number(searchParams.get("limit") ?? 20);
  const search = (searchParams.get("search") ?? "").trim();

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const parsedLimit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.floor(rawLimit) : 20;
  const limit = Math.min(parsedLimit, 100);

  return { page, limit, search };
}

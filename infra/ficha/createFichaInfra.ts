import { connectToDatabase } from "@/app/db/mongo";
import { createFicha } from "@/domain/ficha/createFicha";
import type { CreateFichaInput, Ficha } from "@/types/ficha";
import { parseCreateFichaInput } from "@/utils/validateInput";
import { getAuthContextFromToken } from "@/infra/auth/helpers";

export async function createFichaInfra(token: string | undefined, input: unknown) {
  try {
    const parsedInput: CreateFichaInput = parseCreateFichaInput(input);
    const db = await connectToDatabase();
    const fichas = db.collection<Ficha>("fichas");

    const fichaId = await createFicha(token, parsedInput, {
      getAuthContext: (rawToken) => getAuthContextFromToken(rawToken),
      saveFicha: async (ficha) => {
        await fichas.insertOne(ficha);
      },
      generateId: () => crypto.randomUUID(),
      now: () => new Date().toISOString()
    });

    return new Response(JSON.stringify({ created: true, fichaId }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message === "Not allowed" ? 403 : message === "Unauthorized" ? 401 : 400;
    return new Response(JSON.stringify({ created: false, message }), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }
}

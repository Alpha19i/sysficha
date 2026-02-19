import { connectToDatabase } from "@/app/db/mongo";
import { updateFicha } from "@/domain/ficha/updateFicha";
import type { Ficha, UpdateFichaInput } from "@/types/ficha";
import { mapMongoDoc } from "@/utils/mapMongoDoc";
import { parseUpdateFichaInput } from "@/utils/validateInput";
import { getAuthContextFromToken } from "@/infra/auth/helpers";

export async function updateFichaInfra(
  token: string | undefined,
  id: string,
  input: unknown
) {
  try {
    const parsedInput: UpdateFichaInput = parseUpdateFichaInput(input);
    const db = await connectToDatabase();
    const fichas = db.collection<Ficha>("fichas");

    await updateFicha(token, id, parsedInput, {
      getAuthContext: (rawToken) => getAuthContextFromToken(rawToken),
      findFichaById: async (fichaId) => {
        const doc = await fichas.findOne({ id: fichaId });
        if (!doc) return null;
        return mapMongoDoc<Ficha>(doc as unknown as Record<string, unknown>);
      },
      saveUpdatedFicha: async (fichaId, update) => {
        await fichas.updateOne({ id: fichaId }, { $set: update });
      },
      now: () => new Date().toISOString()
    });

    return new Response(JSON.stringify({ updated: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status =
      message === "Ficha not found"
        ? 404
        : message === "Not allowed"
          ? 403
          : message === "Unauthorized"
            ? 401
            : 400;

    return new Response(JSON.stringify({ updated: false, message }), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }
}

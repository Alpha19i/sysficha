import { connectToDatabase } from "@/app/db/mongo";
import { getFicha } from "@/domain/ficha/getFicha";
import type { Ficha } from "@/types/ficha";
import { mapMongoDoc } from "@/utils/mapMongoDoc";
import { getAuthContextFromToken } from "@/infra/auth/helpers";

export async function getFichaInfra(token: string | undefined, id: string) {
  try {
    const db = await connectToDatabase();
    const fichas = db.collection<Ficha>("fichas");

    const ficha = await getFicha(token, id, {
      getAuthContext: (rawToken) => getAuthContextFromToken(rawToken),
      findFichaById: async (fichaId) => {
        const doc = await fichas.findOne({ id: fichaId });
        if (!doc) return null;
        return mapMongoDoc<Ficha>(doc as unknown as Record<string, unknown>);
      }
    });

    return new Response(JSON.stringify(ficha), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status =
      message === "Ficha not found" ? 404 : message === "Unauthorized" ? 401 : 400;

    return new Response(JSON.stringify({ message }), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }
}

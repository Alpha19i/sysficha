import { connectToDatabase } from "@/app/db/mongo";
import { listFichas } from "@/domain/ficha/listFichas";
import type { Ficha } from "@/types/ficha";
import { mapMongoDoc } from "@/utils/mapMongoDoc";
import { parsePagination } from "@/utils/validateInput";
import { getAuthContextFromToken } from "@/infra/auth/helpers";

export async function listFichasInfra(token: string | undefined, searchParams: URLSearchParams) {
  try {
    const { page, limit, search } = parsePagination(searchParams);
    const db = await connectToDatabase();
    const fichas = db.collection<Ficha>("fichas");

    const result = await listFichas(token, { page, limit, search }, {
      getAuthContext: (rawToken) => getAuthContextFromToken(rawToken),
      listFichas: async ({ page: currentPage, limit: currentLimit, search: q }) => {
        const query = q
          ? {
              $or: [
                { servidorNome: { $regex: q, $options: "i" } },
                { cpf: { $regex: q } }
              ]
            }
          : {};

        const skip = (currentPage - 1) * currentLimit;
        const docs = await fichas
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(currentLimit)
          .toArray();
        const total = await fichas.countDocuments(query);

        return {
          items: docs.map((doc) => mapMongoDoc<Ficha>(doc as unknown as Record<string, unknown>)),
          page: currentPage,
          limit: currentLimit,
          total
        };
      }
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message === "Unauthorized" ? 401 : 400;

    return new Response(JSON.stringify({ message }), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }
}

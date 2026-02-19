import { connectToDatabase } from "@/app/db/mongo";
import { me } from "@/domain/auth/me";
import type { User } from "@/types/user";
import { mapMongoDoc } from "@/utils/mapMongoDoc";
import { verifyToken } from "@/utils/authToken";

export async function meInfra(token: string | undefined) {
  try {
    const db = await connectToDatabase();
    const users = db.collection<User>("users");

    const user = await me(token, {
      verifyToken: (raw) => verifyToken(raw),
      findUserById: async (id) => {
        const doc = await users.findOne({ id });
        if (!doc) return null;
        return mapMongoDoc<User>(doc as unknown as Record<string, unknown>);
      }
    });

    return new Response(JSON.stringify({ authenticated: true, user }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message === "Unauthorized" ? 401 : 400;
    return new Response(JSON.stringify({ authenticated: false, message }), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }
}

import { connectToDatabase } from "@/app/db/mongo";
import type { AuthContext } from "@/types/ficha";
import type { User } from "@/types/user";
import { mapMongoDoc } from "@/utils/mapMongoDoc";
import { verifyToken } from "@/utils/authToken";

export async function getAuthContextFromToken(token: string | undefined): Promise<AuthContext> {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const payload = verifyToken(token);
  const db = await connectToDatabase();
  const users = db.collection<User>("users");
  const doc = await users.findOne({ id: payload.sub });
  if (!doc) {
    throw new Error("Unauthorized");
  }

  const user = mapMongoDoc<User>(doc as unknown as Record<string, unknown>);
  if (!user.active) {
    throw new Error("Unauthorized");
  }

  return { userId: user.id, role: user.role };
}

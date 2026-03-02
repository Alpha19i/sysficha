import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/app/db/mongo";
import { changePassword } from "@/domain/auth/changePassword";
import type { ChangePasswordInput } from "@/types/auth";
import type { User } from "@/types/user";
import { getAuthContextFromToken } from "@/infra/auth/helpers";
import { parseChangePasswordInput } from "@/utils/validateInput";

export async function changePasswordInfra(input: unknown, token: string | undefined) {
  try {
    const parsedInput: ChangePasswordInput = parseChangePasswordInput(input);
    const auth = await getAuthContextFromToken(token);
    const db = await connectToDatabase();
    const users = db.collection<User>("users");

    await changePassword(auth.userId, parsedInput, {
      findUserById: async (id) => users.findOne({ id }),
      verifyPassword: (password, hash) => bcrypt.compare(password, hash),
      hashPassword: (password) => bcrypt.hash(password, 10),
      updatePasswordHash: async (id, passwordHash) => {
        await users.updateOne({ id }, { $set: { passwordHash } });
      }
    });

    return new Response(JSON.stringify({ changed: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message === "Unauthorized" || message === "Invalid credentials" ? 401 : 400;
    return new Response(JSON.stringify({ changed: false, message }), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }
}

import bcrypt from "bcrypt";
import { connectToDatabase } from "@/app/db/mongo";
import { login } from "@/domain/auth/login";
import type { LoginInput } from "@/types/auth";
import type { User } from "@/types/user";
import { buildAuthCookie } from "@/utils/authCookie";
import { signToken } from "@/utils/authToken";
import { parseLoginInput } from "@/utils/validateInput";

export async function loginInfra(input: unknown) {
  try {
    const parsedInput: LoginInput = parseLoginInput(input);
    const db = await connectToDatabase();
    const users = db.collection<User>("users");

    const token = await login(parsedInput, {
      findUserByUsername: async (username) => users.findOne({ username }),
      verifyPassword: (password, hash) => bcrypt.compare(password, hash),
      generateToken: (payload) => signToken(payload)
    });

    return new Response(JSON.stringify({ logged: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": buildAuthCookie(token)
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message === "Invalid credentials" ? 401 : 400;
    return new Response(JSON.stringify({ logged: false, message }), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }
}

import jwt from "jsonwebtoken";
import type { AuthTokenPayload } from "@/types/auth";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "16h") as jwt.SignOptions["expiresIn"];

function getJwtSecret() {
  if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET");
  }
  return JWT_SECRET;
}

export function signToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
  } catch {
    throw new Error("Unauthorized");
  }
}

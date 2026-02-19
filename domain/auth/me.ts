import type { AuthTokenPayload } from "@/types/auth";
import type { PublicUser, User } from "@/types/user";

type MeDeps = {
  verifyToken: (token: string) => AuthTokenPayload;
  findUserById: (id: string) => Promise<User | null>;
};

export async function me(token: string | undefined, deps: MeDeps): Promise<PublicUser> {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const payload = deps.verifyToken(token);
  const user = await deps.findUserById(payload.sub);

  if (!user || !user.active) {
    throw new Error("Unauthorized");
  }

  const { passwordHash: _ignored, ...publicUser } = user;
  return publicUser;
}

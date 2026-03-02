import { changePasswordInfra } from "@/infra/auth/changePasswordInfra";
import { getAuthCookieName } from "@/utils/authCookie";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${getAuthCookieName()}=`))
    ?.split("=")[1];

  return changePasswordInfra(body, token);
}

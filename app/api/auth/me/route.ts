import { meInfra } from "@/infra/auth/meInfra";
import { getAuthCookieName } from "@/utils/authCookie";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${getAuthCookieName()}=`))
    ?.split("=")[1];

  return meInfra(token);
}

import { createFichaInfra } from "@/infra/ficha/createFichaInfra";
import { listFichasInfra } from "@/infra/ficha/listFichasInfra";
import { getAuthCookieName } from "@/utils/authCookie";

export const runtime = "nodejs";

function extractToken(cookieHeader: string) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${getAuthCookieName()}=`))
    ?.split("=")[1];
}

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = extractToken(cookieHeader);
  const body = await request.json().catch(() => ({}));
  return createFichaInfra(token, body);
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = extractToken(cookieHeader);
  const { searchParams } = new URL(request.url);
  return listFichasInfra(token, searchParams);
}

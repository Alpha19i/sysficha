import { getFichaInfra } from "@/infra/ficha/getFichaInfra";
import { updateFichaInfra } from "@/infra/ficha/updateFichaInfra";
import { getAuthCookieName } from "@/utils/authCookie";

export const runtime = "nodejs";

function extractToken(cookieHeader: string) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${getAuthCookieName()}=`))
    ?.split("=")[1];
}

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Params) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = extractToken(cookieHeader);
  const { id } = await context.params;
  return getFichaInfra(token, id);
}

export async function PUT(request: Request, context: Params) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = extractToken(cookieHeader);
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  return updateFichaInfra(token, id, body);
}

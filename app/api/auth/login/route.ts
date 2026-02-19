import { loginInfra } from "@/infra/auth/loginInfra";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return loginInfra(body);
}

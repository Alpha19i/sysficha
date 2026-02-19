import { logoutInfra } from "@/infra/auth/logoutInfra";

export const runtime = "nodejs";

export async function POST() {
  return logoutInfra();
}

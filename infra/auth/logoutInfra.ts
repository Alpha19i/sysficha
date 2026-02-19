import { logout } from "@/domain/auth/logout";
import { buildClearAuthCookie } from "@/utils/authCookie";

export async function logoutInfra() {
  await logout();

  return new Response(JSON.stringify({ loggedOut: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": buildClearAuthCookie()
    }
  });
}

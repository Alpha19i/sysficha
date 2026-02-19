const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "token";
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 16;

export function getAuthCookieName() {
  return AUTH_COOKIE_NAME;
}

export function buildAuthCookie(token: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${AUTH_COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${TOKEN_MAX_AGE_SECONDS}${secure}`;
}

export function buildClearAuthCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${AUTH_COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0${secure}`;
}

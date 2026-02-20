import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "token";

function hasSession(request: NextRequest) {
  return Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value);
}

function isPublicPage(pathname: string) {
  return pathname === "/login";
}

function isPrivateApi(pathname: string) {
  return pathname.startsWith("/api/fichas");
}

function isPublicApi(pathname: string) {
  return pathname === "/api/auth/login";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = hasSession(request);

  if (isPrivateApi(pathname) && !authenticated) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (pathname.startsWith("/api/")) {
    return isPublicApi(pathname) || authenticated
      ? NextResponse.next()
      : NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (isPublicPage(pathname)) {
    if (authenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!authenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export { proxy as middleware };

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)"]
};

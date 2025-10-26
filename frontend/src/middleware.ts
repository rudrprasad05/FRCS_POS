import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/api") ||
    req.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next(); // skip assets & API
  }

  if (!token) {
    console.error("qqqqq no token");
    const returnUrl = req.nextUrl.pathname + req.nextUrl.search;
    console.log("qqqqq", returnUrl);

    if (returnUrl == "/") {
      return NextResponse.redirect(new URL(`/auth/login`, req.url));
    }
    if (returnUrl.includes("redirect")) {
      return NextResponse.redirect(new URL(`/redirect`, req.url));
    }
    return NextResponse.redirect(
      new URL(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`, req.url)
    );
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!auth|error|receipt|_next|api|favicon.ico).*)"],
};

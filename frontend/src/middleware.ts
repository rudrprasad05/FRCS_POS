import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, User } from "./types/models";
import { LoginDTO } from "./types/res";

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
    console.error("qqqqq no token md.ts"); // ⬅️ optional debug
    const returnUrl = req.nextUrl.pathname + req.nextUrl.search;
    return NextResponse.redirect(
      new URL(`/login?returnUrl=${encodeURIComponent(returnUrl)}`, req.url)
    );
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    });

    if (!res.ok) {
      console.error("qqqqq Auth check failed  md.ts:", res.status);
      const returnUrl = req.nextUrl.pathname + req.nextUrl.search;
      return NextResponse.redirect(
        new URL(`/login?returnUrl=${encodeURIComponent(returnUrl)}`, req.url)
      );
    }

    const data: ApiResponse<LoginDTO> = await res.json();

    // Role check
    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      (data.data?.role as string).toLowerCase() !== "superadmin"
    ) {
      return NextResponse.redirect(new URL("/error/unauthorised", req.url));
    }
  } catch (error) {
    console.error("Middleware auth error:", error);
    return NextResponse.redirect(new URL("/error/unauthorised", req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!login|quickconnect|error|_next|api|favicon.ico).*)"],
};

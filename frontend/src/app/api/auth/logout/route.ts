import { axiosGlobal } from "@/lib/axios";
import { ApiResponse } from "@/types/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // ---------------------------------------------------------
    // 1. Grab the token that the browser sent in the Cookie header
    // ---------------------------------------------------------
    const cookieHeader = req.headers.get("cookie") ?? "";
    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    const accessToken = tokenMatch ? tokenMatch[1] : null;

    if (!accessToken) {
      return NextResponse.json(
        { message: "No authentication cookie found" },
        { status: 401 }
      );
    }

    const backendRes = await axiosGlobal.get<ApiResponse<string>>(
      `auth/logout`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );

    const newHeaders = new Headers();

    const setCookieHeaders: string[] | undefined = (backendRes.headers as any)[
      "set-cookie"
    ];

    if (Array.isArray(setCookieHeaders)) {
      setCookieHeaders.forEach((c) => newHeaders.append("Set-Cookie", c));
    } else if (setCookieHeaders) {
      newHeaders.append("Set-Cookie", setCookieHeaders);
    }

    return NextResponse.json(backendRes.data, {
      status: 200,
      headers: newHeaders,
    });
  } catch (err: any) {
    console.error("Logout proxy error:", err);

    if (err.response?.status) {
      return NextResponse.json(
        { message: err.response.data?.message ?? "Unauthorized" },
        { status: err.response.status }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

import { ApiResponse, User, UserRoles } from "@/types/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://frcs-api.procyonfiji.com/api/";
    console.log("33", apiBaseUrl);
    const response = await fetch(`${apiBaseUrl}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    console.log("be1", response);

    const data: ApiResponse<User> = await response.json();
    const resp: User = {
      id: data.data?.id || "", // Adjust fields based on your API response
      username: data.data?.username || "",
      email: data.data?.email || "",
      token: data.data?.token,
      role: data.data?.role || UserRoles.CASHIER,
    } as User;

    console.log("be2", data);
    console.log("be3", resp);

    const setCookieHeader = response.headers.get("set-cookie");
    const headers = new Headers();
    if (setCookieHeader) {
      headers.append("Set-Cookie", setCookieHeader);
    }

    return new NextResponse(JSON.stringify({ ...resp }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Login error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      {
        status: 500,
      }
    );
  }
}

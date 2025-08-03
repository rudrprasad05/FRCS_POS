"use server";

import { axiosGlobal } from "@/lib/axios";
// import { LoginResponse } from "@/types/schema";
// import { SignInFormType } from "@/types/zod";
import https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false, // Allow self-signed cert
});

export async function GetUser() {
  const res = await axiosGlobal.get("account/google/user", {
    withCredentials: true,
    httpAgent: agent,
  });
  return res;
}

// export async function LoginUser(data: SignInFormType): Promise<LoginResponse> {
//   const res = await axiosGlobal.post<LoginResponse>("auth/login", data);

//   return res.data;
// }

export async function ConfirmEmail(token: string): Promise<boolean> {
  try {
    await axiosGlobal.post("auth/confirm-email/" + token);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function GetToken(): Promise<string | undefined> {
  //   const a = await cookies();
  //   const token = a.get("token")?.value;

  //   if (!token) return undefined;
  //   return token;
  return "";
}

// export async function GetUserByEmail(email: string) {
//   const token = await GetToken();
//   if (!token) {
//     return redirect("/");
//   }
//   const res = await axiosGlobal.get<Partial<User>>("user/get/" + email, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   return res.data;
// }

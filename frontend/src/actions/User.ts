"use server";

import { NewUserForm } from "@/components/superadmin/users/NewUserDialoge";
import { axiosGlobal } from "@/lib/axios";
import { ApiResponse, QueryObject, User } from "@/types/models";
import { cookies } from "next/headers";

import https from "https";
import { RequestWrapper } from "./RequestWrapper";
import { buildMediaQueryParams } from "@/lib/params";

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

export async function GetAllAdmins(
  query?: QueryObject
): Promise<ApiResponse<User[]>> {
  return RequestWrapper<User[]>("GET", `user/get-all-users`, {
    query,
  });
}
export async function GetUsersByCompany(
  query?: QueryObject
): Promise<ApiResponse<User[]>> {
  return RequestWrapper<User[]>("GET", `user/get-user-by-company`, { query });
}

export async function GetUnAssignedUsers(
  query?: QueryObject
): Promise<ApiResponse<User[]>> {
  return RequestWrapper<User[]>("GET", `user/get-all-users-not-in-company`, {
    query,
  });
}

export async function CreateUser(
  data: NewUserForm,
  query?: QueryObject
): Promise<ApiResponse<User>> {
  return RequestWrapper<User>("POST", `user/create`, { data, query });
}

export async function Logout(): Promise<ApiResponse<string>> {
  const token = await GetToken();

  const res = await axiosGlobal.get<ApiResponse<string>>("auth/logout", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}

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
  const a = await cookies();
  const token = a.get("token")?.value;

  if (!token) return undefined;
  return token;
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

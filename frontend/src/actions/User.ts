"use server";

import { NewUserForm } from "@/components/superadmin/users/NewUserDialoge";
import { axiosGlobal } from "@/lib/axios";
import { ApiResponse, QueryObject, User } from "@/types/models";
import { cookies } from "next/headers";

import { ResetPasswordSchemaType } from "@/types/forms/zod";
import https from "https";
import { RequestWrapper } from "./RequestWrapper";

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

export async function SoftDeleteUser(uuid: string): Promise<ApiResponse<User>> {
  return RequestWrapper<User>("DELETE", `user/soft-delete`, {
    query: { uuid },
  });
}

export async function ActivateUser(uuid: string): Promise<ApiResponse<User>> {
  return RequestWrapper<User>("DELETE", `user/activate`, {
    query: { uuid },
  });
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

export async function VerifyEmail(
  query?: QueryObject
): Promise<ApiResponse<User>> {
  return RequestWrapper<User>("GET", `user/verify-email`, { query });
}
export async function GetOneUser(
  query?: QueryObject
): Promise<ApiResponse<User>> {
  return RequestWrapper<User>("GET", `user/get-user-by-uuid`, { query });
}

export async function ChangeUsername(
  data: { newUsername: string },
  query?: QueryObject
): Promise<ApiResponse<User>> {
  return RequestWrapper<User>("POST", `user/change-username`, { query, data });
}

export async function ChangePfp(
  data: FormData,
  query: QueryObject
): Promise<ApiResponse<User>> {
  return RequestWrapper<User>("POST", `user/profile-picture`, { query, data });
}

export async function RequestPasswordReset(
  email: string
): Promise<ApiResponse<User>> {
  return RequestWrapper<User>("POST", `user/request-password-reset`, {
    data: { email },
  });
}

export async function RequestReEmailVerification(
  email: string
): Promise<ApiResponse<User>> {
  return RequestWrapper<User>(
    "POST",
    `user/request-email-verification-resend`,
    {
      data: { email },
    }
  );
}

export async function PasswordReset(
  data: ResetPasswordSchemaType
): Promise<ApiResponse<User>> {
  return RequestWrapper<User>("POST", `user/handle-password-reset`, {
    data: {
      code: data.code,
      userId: data.userId,
      password: data.newPassword,
    },
  });
}

export async function Login(
  email: string,
  password: string
): Promise<ApiResponse<User>> {
  return RequestWrapper<User>("POST", `auth/login`, {
    data: { email, password },
  });
}

export async function CreateUser(
  data: NewUserForm,
  query?: QueryObject
): Promise<ApiResponse<User>> {
  return RequestWrapper<User>("POST", `user/create`, { data, query });
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

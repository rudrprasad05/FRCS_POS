"use server";

import { NewUserForm } from "@/components/superadmin/users/NewUserDialoge";
import { axiosGlobal } from "@/lib/axios";
import { ApiResponse, QueryObject, User } from "@/types/models";
import { cookies } from "next/headers";

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

export async function GetAllAdmins(
  query?: QueryObject
): Promise<ApiResponse<User[]>> {
  const token = await GetToken();

  const res = await axiosGlobal.get<ApiResponse<User[]>>("user/get-all-users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(res.data);
  return res.data;
}

// TODO do this. rn the add new user dialog gets all users, regardless of wheather its in company or not
export async function GetAllAdminsNotInCompany(
  query?: QueryObject
): Promise<ApiResponse<User[]>> {
  const token = await GetToken();

  const res = await axiosGlobal.get<ApiResponse<User[]>>(
    "user/get-all-users-not-in-company",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log(res.data);
  return res.data;
}

export async function CreateUser(
  data: NewUserForm
): Promise<ApiResponse<User[]>> {
  const token = await GetToken();

  try {
    const res = await axiosGlobal.post<ApiResponse<User[]>>(
      "user/create",
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data as ApiResponse<User[]>;
    }

    return {
      success: false,
      statusCode: 500,
      data: [],
      errors: ["Network error"],
      message: "Unable to reach the server",
      timestamp: Date.now.toString(),
    };
  }
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

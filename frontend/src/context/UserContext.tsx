"use client";

import { Logout } from "@/actions/User";
import { axiosGlobal } from "@/lib/axios";
import { RegisterFormType } from "@/types/forms/zod";
import { ApiResponse, User } from "@/types/models";
import { LoginResponse } from "@/types/res";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, redirect?: string) => Promise<void>;
  register: (data: RegisterFormType) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  // 🔹 Load session from cookies on mount

  const helperHandleRedirectAfterLogin = (tmp: User) => {
    setUser(tmp);
    toast.success("Successfully logged in", {
      description: "Redirecting shortly",
    });

    router.push((returnUrl as string) || "/redirect");
    // router.push("/redirect");
  };

  const login = async (email: string, password: string, redirect?: string) => {
    setIsLoading(true);
    let tempUser: User;
    try {
      const res = await axiosGlobal.post<ApiResponse<LoginResponse>>(
        "auth/login",
        {
          email,
          password,
        }
      );
      const data = res.data.data;
      if (data == undefined) {
        return;
      }
      localStorage.setItem("token", data.token);
      tempUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        token: data.token,
        role: data.role,
      } as User;

      setUser(tempUser);
      localStorage.setItem("user", JSON.stringify(tempUser));

      if (redirect && redirect.trim().length > 0) {
        router.push("/admin" + redirect);
      } else {
        helperHandleRedirectAfterLogin(tempUser);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid credentials");
    }
    setIsLoading(false);
  };

  const register = async (data: RegisterFormType) => {
    let tempUser: User;
    try {
      const res = await axiosGlobal.post<LoginResponse>("auth/register", {
        email: data.email,
        username: data.username,
        password: data.password,
      });
      localStorage.setItem("token", res.data.token);
      tempUser = {
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        token: res.data.token,
        role: res.data.role,
      } as User;
      setUser(tempUser);
      localStorage.setItem("user", JSON.stringify(tempUser));

      toast.success("Successfully registered");
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid credentials");
    }

    // helperHandleRedirectAfterLogin(tempUser);
  };

  // 🔹 Logout function
  const logout = async () => {
    await Logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    toast.info("Logging out");
    router.push("/login");
  };

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    const isAdmin = pathname.includes("admin");
    let tempUser: User = JSON.parse(localStorage.getItem("user") ?? "");

    if (tempUser) {
      setUser(tempUser);
      return;
    }

    if (isAdmin)
      try {
        const res = await axiosGlobal.get<ApiResponse<LoginResponse>>(
          "auth/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = res.data.data;
        if (!data) return;
        tempUser = {
          id: data.id,
          username: data.username,
          email: data.email,
          token: data.token,
          role: data.role,
        } as User;
      } catch (error) {
        console.log(error);
      }
  }, [pathname]);

  useEffect(() => {
    checkAuth();
  }, [pathname, router, checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use cake context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

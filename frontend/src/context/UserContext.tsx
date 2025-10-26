"use client";

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

  // 🔹 Load session from cookies on mount

  const helperHandleRedirectAfterLogin = (tmp: User) => {
    setUser(tmp);
    toast.success("Successfully logged in", {
      description: "Redirecting shortly",
    });

    let redirectUrl = searchParams.get("returnUrl");

    if (redirectUrl?.toLowerCase() == "redirect") redirectUrl = null;

    router.push(redirectUrl || "/redirect");
  };

  const login = async (email: string, password: string, redirect?: string) => {
    setIsLoading(true);
    let tempUser: User;
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensures cookies are sent and received
        body: JSON.stringify({ email, password }),
      });

      console.log("d12456", res);

      // Check response status
      if (!res.ok) {
        if (res.status === 422) {
          router.push("/auth/verify-email");
          return;
        }
        const errorData = await res.json();
        toast.error("An error occurred", {
          description: errorData.message || "Invalid credentials",
        });
        return;
      }

      // Parse JSON response
      const resp: ApiResponse<User> = await res.json();
      const data = resp.data;

      console.log("d123", data);
      // Validate response data
      if (!data || !data.token) {
        toast.error("An error occurred", { description: resp.message });
        return;
      }

      tempUser = {
        id: data.id || "",
        username: data.username || "",
        email: data.email || "",
        token: data.token,
        role: data.role || "",
        profilePicture: data.profilePicture,
        profilePictureLink: data.profilePictureLink,
      } as User;

      setUser(tempUser);
      localStorage.setItem("user", JSON.stringify(tempUser));
      localStorage.setItem("token", data.token);

      // Handle redirect
      console.log("1wwwq hit", user);

      helperHandleRedirectAfterLogin(tempUser);
      //   }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed", {
        description: "Invalid credentials or server error",
      });
    } finally {
      setIsLoading(false);
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
        profilePicture: res.data.profilePicture,
        profilePictureLink: res.data.profilePictureLink,
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

  const logout = async () => {
    console.log("hit1");
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: user?.email }),
    });
    console.log("hit2");

    const resp: ApiResponse<User> = await res.json();
    const data = resp.data;

    if (!data) {
      toast.error("An error occurred", { description: resp.message });
      return;
    }

    console.log("hit3", res);

    setUser(null);

    toast.info("Logging out");
    router.push("/auth/login");

    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
      } catch (error) {}
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

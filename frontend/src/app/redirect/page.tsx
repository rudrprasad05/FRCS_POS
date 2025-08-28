"use client";

import { GetCompanyByAdminUserId } from "@/actions/Company";
import { useAuth } from "@/context/UserContext";
import { UserRoles } from "@/types/models";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Redirect() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    handleCompanyRedirect();
  }, []);

  useEffect(() => {
    console.log("prefecthed");
    router.prefetch("/admin/dashboard");
    router.prefetch("/companyname");
  }, [router]);

  const handleCompanyRedirect = async () => {
    if (user == null) {
      console.log("1");
      router.push("/login");
      return;
    }

    if (user.role?.toUpperCase() == UserRoles.SUPERADMIN) {
      console.log("su", user.role);
      router.push("/admin/dashboard");
      return;
    }

    try {
      console.log(user);
      const res = await GetCompanyByAdminUserId(user.id);
      console.log(res);
      if (res.success) {
        let name = res.data?.name;

        router.push(`/${name}`);
        return;
      } else {
        router.push(`/error/unassigned`);
        return;
      }
    } catch (error) {
      router.push(`/error/unassigned`);
      return;
    }
  };

  return (
    <div className="w-screen h-screen grid grid-cols-1">
      <div className="flex items-center justify-center gap-2 text-xl">
        Redirecting <Loader2 className="animate-spin" />
      </div>
    </div>
  );
}

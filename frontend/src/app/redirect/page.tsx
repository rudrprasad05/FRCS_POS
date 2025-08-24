"use client";

import { GetCompanyByAdminUserId } from "@/actions/Company";
import { useAuth } from "@/context/UserContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

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

    console.log(user);

    if (user.role?.toLowerCase() == "superadmin") {
      console.log("2");

      router.push("/admin/dashboard");
      return;
    }

    if (user.role?.toLowerCase() == "admin") {
      console.log("3");

      const res = await GetCompanyByAdminUserId(user.id);
      console.dir(res);
      let name = res.data?.name;
      console.log(name);
      router.push(`/${name}`);
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

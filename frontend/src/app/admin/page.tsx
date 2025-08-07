import { redirect } from "next/navigation";
import React from "react";

export default function AdminPage() {
  return redirect("/admin/dashboard");
}

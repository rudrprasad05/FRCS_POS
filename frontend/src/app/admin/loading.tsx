import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

export default function LoadingPage() {
  return (
    <div className="flex items-center gap-2">
      <Loader2 className="animate-spin" /> Loading
    </div>
  );
}

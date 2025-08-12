import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

export default function LoadingPage() {
  return (
<<<<<<< HEAD
    <div className="items-center gap-2 w-screen h-screen grid grid-cols-1">
      <div className="flex items-center gap-2">
        <Loader2 className="animate-spin" /> Loading
      </div>
=======
    <div className="flex items-center gap-2">
      <Loader2 className="animate-spin" /> Loading
>>>>>>> bf0601d (feat: password random generate in new user dialoge. some new pages with TODO)
    </div>
  );
}

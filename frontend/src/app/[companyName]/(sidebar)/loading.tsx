import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="items-center gap-2 w-screen h-screen grid grid-cols-1">
      <div className="flex items-center gap-2">
        <Loader2 className="animate-spin" /> Loading
      </div>
    </div>
  );
}

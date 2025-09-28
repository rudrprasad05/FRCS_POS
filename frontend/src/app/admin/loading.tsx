import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex items-center gap-2 w-full grow h-full">
      <Loader2 className="animate-spin" /> Loading
    </div>
  );
}

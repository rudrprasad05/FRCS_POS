import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className="flex items-center flex-col ">
        <Loader2 className="animate-spin" />
        Loading Products
      </div>
    </div>
  );
}

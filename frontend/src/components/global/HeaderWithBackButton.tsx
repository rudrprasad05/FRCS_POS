import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function HeaderWithBackButton({
  link,
  title,
  description,
}: {
  link?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <Button asChild variant="ghost" size="icon" className="h-9 w-9">
        <Link href={link || "/admin/users"} prefetch>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Go back</span>
        </Link>
      </Button>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground capitalize">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

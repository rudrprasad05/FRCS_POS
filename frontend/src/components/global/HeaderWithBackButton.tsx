import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { H1, P } from "../font/HeaderFonts";

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
      {link && (
        <Button asChild variant="ghost" size="icon" className="h-9 w-9">
          <Link href={link || "/admin/users"} prefetch>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
          </Link>
        </Button>
      )}

      <div>
        <H1 className="capitalize">{title}</H1>
        <P className="mt-1 text-sm text-muted-foreground">{description}</P>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-[12rem] md:text-[16rem] font-bold leading-none text-foreground/20 select-none">
            404
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-4 -mt-8">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground text-balance">
            Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto text-pretty leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto bg-transparent"
          >
            <Link href="javascript:history.back()">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Link>
          </Button>
        </div>

        {/* Additional Help */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Need help? Try searching or{" "}
            <Link
              href="/contact"
              className="text-primary/50 hover:underline font-medium"
            >
              contact support
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

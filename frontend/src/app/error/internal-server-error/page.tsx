"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ServerCrash, ArrowLeft, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function InternalServerError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <ServerCrash className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            500 - Internal Server Error
          </CardTitle>
          <CardDescription className="text-gray-600">
            We&apos;re experiencing some technical difficulties. Our team has
            been notified and is working to resolve the issue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Button onClick={() => window.location.reload()} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button variant="ghost" asChild className="w-full">
              <Link href="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
          </div>
          <div className="text-center text-sm text-gray-500">
            If the problem persists,{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact Support
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

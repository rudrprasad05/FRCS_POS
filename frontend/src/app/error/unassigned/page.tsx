"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Home, LogIn } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function UnAssigned() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ">
              <AlertTriangle className="h-8 w-8 " />
            </div>
            <CardTitle className="text-2xl font-bold ">
              403 - Forbidden
            </CardTitle>
            <CardDescription className="">
              You don&apos;t have permission to access this resource. Please log
              in or contact an administrator.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full bg-transparent"
              >
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
            <div className="text-center text-sm">
              Need help?{" "}
              <Link href="/contact" className=" hover:underline">
                Contact Support
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}

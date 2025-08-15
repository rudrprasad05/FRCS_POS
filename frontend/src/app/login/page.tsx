'use client';

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;
    console.log("Email:", email, "Password:", password);
    // Add your login logic here (e.g., API call)
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <EmailLabel />
      <PasswordLabel />
      <LoginButton />
    </form>
  );
}

export function EmailLabel() {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="email">Email</Label>
      <Input
        type="email"
        id="email"
        name="email"
        placeholder="Enter Your Email"
        required
      />
    </div>
  );
}

export function PasswordLabel() {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="password">Password</Label>
      <Input
        type="password"
        id="password"
        name="password"
        placeholder="Enter Your Password"
        required
      />
    </div>
  );
}

export function LoginButton() {
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button type="submit">Login</Button>
    </div>
  );
}

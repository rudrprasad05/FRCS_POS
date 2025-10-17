import { redirect } from "next/navigation";

export default function Auth() {
  return redirect("/auth/login");
}

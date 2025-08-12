"use client";

<<<<<<< HEAD
import { redirect } from "next/navigation";
=======
>>>>>>> bf0601d (feat: password random generate in new user dialoge. some new pages with TODO)
import React, { use } from "react";

type PageProps = {
  params: Promise<{ companyName: string }>;
};

export default function CompanyAdminPage({ params }: PageProps) {
  const { companyName } = use(params);

<<<<<<< HEAD
  return redirect(`${companyName}/dashboard`);
=======
  return <div>{companyName}</div>;
>>>>>>> bf0601d (feat: password random generate in new user dialoge. some new pages with TODO)
}

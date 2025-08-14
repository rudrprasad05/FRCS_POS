"use client";

<<<<<<< HEAD
<<<<<<< HEAD
import { redirect } from "next/navigation";
=======
>>>>>>> bf0601d (feat: password random generate in new user dialoge. some new pages with TODO)
=======
import { redirect } from "next/navigation";
>>>>>>> 5f375dd (feat (ui): create pages for company admin portal. fix routing issues. finish soft delete for company in superadmin panel.)
import React, { use } from "react";

type PageProps = {
  params: Promise<{ companyName: string }>;
};

export default function CompanyAdminPage({ params }: PageProps) {
  const { companyName } = use(params);

<<<<<<< HEAD
<<<<<<< HEAD
  return redirect(`${companyName}/dashboard`);
=======
  return <div>{companyName}</div>;
>>>>>>> bf0601d (feat: password random generate in new user dialoge. some new pages with TODO)
=======
  return redirect(`${companyName}/dashboard`);
>>>>>>> 5f375dd (feat (ui): create pages for company admin portal. fix routing issues. finish soft delete for company in superadmin panel.)
}

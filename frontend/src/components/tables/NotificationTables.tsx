"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { AlertCircle, AlertTriangle, Edit, Eye } from "lucide-react";

import { CompanyUser, Notification, NotificationTypes } from "@/types/models";
import Link from "next/link";
import RemoveUserFromCompanyDialoge from "../superadmin/companies/RemoveUserFromCompanyDialoge";
import { Badge } from "../ui/badge";
import { GetNotificationIcon } from "../global/NotificationIcons";

function formatTimeAgo(str: string) {
  const date = new Date(str);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export const NotificationColumns: ColumnDef<Notification>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const company = row.original;
      return (
        <div className="flex gap-2">
          <GetNotificationIcon type={company.type} />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "message",
    header: "Message",
  },
  {
    accessorKey: "isRead",
    header: "Status",
    cell: ({ row }) => {
      const isRead = row.original.isRead as boolean;
      if (isRead) {
        return <Badge variant={"outline"}>Read</Badge>;
      }
      return <Badge variant={"destructive"}>Unread</Badge>;
    },
  },
  {
    accessorKey: "createdOn",
    header: "Time Ago",
    cell: ({ row }) => {
      const isRead = row.original.createdOn;

      return <div>{formatTimeAgo(isRead)}</div>;
    },
  },

  {
    id: "actions",
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const company = row.original; // Get the entire row data (of type companyType)

      return (
        <div className="flex gap-2">
          <Button variant={"outline"} asChild className="w-24">
            <Link
              href={`/admin/companies/${company.uuid}/view`}
              className="w-24 flex items-center justify-between"
            >
              View
              <Eye className="" />
            </Link>
          </Button>
          <Button variant={"outline"} asChild className="w-24">
            <Link
              href={`/admin/companies/${company.uuid}/edit`}
              className="w-24 flex items-center justify-between"
            >
              Edit
              <Edit className="" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];

export const CompanyUserColumn: ColumnDef<CompanyUser>[] = [
  {
    accessorKey: "user.name",
    header: "Name",
    cell: ({ row }) => {
      const company = row.original; // Get the entire row data (of type companyType)

      return <div className="flex gap-2">{company.user?.username}</div>;
    },
  },
  {
    accessorKey: "user.email",
    header: "Email",
    cell: ({ row }) => {
      const company = row.original; // Get the entire row data (of type companyType)
      return <div className="flex gap-2">{company.user?.email}</div>;
    },
  },
  {
    accessorKey: "user.role",
    header: "Role",
    cell: ({ row }) => {
      const company = row.original; // Get the entire row data (of type companyType)
      return (
        <Badge variant={"outline"} className="flex gap-2">
          {company.user?.role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdOn",
    header: "Created On",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdOn"));
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },

  {
    id: "actions",
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const company = row.original; // Get the entire row data (of type companyType)

      return (
        <div className="flex gap-2">
          <Button variant={"outline"} asChild>
            <Link
              href={`/admin/users/${company.uuid}/edit`}
              className="flex items-center justify-between"
            >
              <Edit className="" />
            </Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link
              href={`/admin/users/${encodeURI(company.userId)}/view`}
              className="flex items-center justify-between"
            >
              <Eye className="" />
            </Link>
          </Button>
          <RemoveUserFromCompanyDialoge userId={company.userId} />
        </div>
      );
    },
  },
];

"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2, MailCheck, MailX } from "lucide-react";

import { MarkAsRead } from "@/actions/Notifications";
import { Notification } from "@/types/models";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { GetNotificationIcon } from "../global/NotificationIcons";
import { Badge } from "../ui/badge";

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
          <ReadBtn notification={company} />
        </div>
      );
    },
  },
];

const ReadBtn = ({ notification }: { notification: Notification }) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleRead = async () => {
    setIsLoading(true);
    const res = await MarkAsRead({ uuid: notification.uuid });
    if (res.success) {
      toast.success("Notification Status changed");
      notification.isRead = !notification.isRead;
    } else {
      toast.error("An error occured", { description: res.message });
    }
    queryClient.invalidateQueries({
      queryKey: ["adminNotifications", {}],
      exact: false,
    });
    setIsLoading(false);
  };

  if (notification.isRead)
    return (
      <Button variant={"outline"} onClick={() => handleRead()}>
        Mark As Unread
        {!isLoading && <MailX className="" />}
        {isLoading && <Loader2 className="animate-spin" />}
      </Button>
    );
  return (
    <Button variant={"outline"} onClick={() => handleRead()}>
      Mark As Read
      {!isLoading && <MailCheck className="" />}
      {isLoading && <Loader2 className="animate-spin" />}
    </Button>
  );
};

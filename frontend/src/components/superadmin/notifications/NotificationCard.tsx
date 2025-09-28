"use client";
import { MarkAsRead, SafeDeleteNotification } from "@/actions/Notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Notification } from "@/types/models";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Info,
  MoreHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function getNotificationIcon(type: any) {
  switch (type) {
    case "ERROR":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "WARNING":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "SUCCESS":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
}

function formatTimeAgo(date: Date) {
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

export function NotificationCard({ data }: { data: Notification }) {
  const [notification, setNotification] = useState(data);
  useEffect(() => {
    setNotification(data);
  }, [data]);

  const handleMarkAsRead = async () => {
    toast.success("Marked as read");
    setNotification((prev) => ({ ...prev, isRead: true }));

    const res = await MarkAsRead(notification.uuid);

    if (!res.success) {
      toast.error("An Error occured");
      setNotification((prev) => ({ ...prev, isRead: false }));
    }
  };

  const handleSafeDelete = async () => {
    toast.success("Notification Deleted");
    setNotification((prev) => ({ ...prev, isDeleted: true }));

    const res = await SafeDeleteNotification(notification.uuid);
    if (!res.success) {
      toast.error("An Error occured");
      setNotification((prev) => ({ ...prev, isDeleted: false }));
    }
  };

  if (notification.isDeleted) {
    return;
  }

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${
        !notification.isRead ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm">{notification.title}</h3>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleMarkAsRead()}>
                    Mark as read
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSafeDelete()}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {notification.message}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(new Date(notification.createdOn))}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

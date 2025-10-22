"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import * as signalR from "@microsoft/signalr";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { GetAllNotificationsSuperAdmin } from "@/actions/Notifications";
import { ESortBy, Notification, NotificationTypes } from "@/types/models";
import { useParams } from "next/navigation";

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case NotificationTypes.ERROR:
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case NotificationTypes.WARNING:
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case NotificationTypes.SUCCESS:
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
}

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

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const params = useParams();
  const companyName = String(params.companyName);

  const apiUrl = process.env.NEXT_PUBLIC_API_SOCKET_URL;

  useEffect(() => {
    setNotifications([]);
    const getData = async () => {
      const data = await GetAllNotificationsSuperAdmin({
        pageNumber: 1,
        pageSize: 10,
        sortBy: ESortBy.DSC,
        companyName,
      });

      setNotifications(data.data as unknown as Notification[]);
      setUnreadCount(data.meta?.totalCount as number);
    };
    getData();
  }, [companyName]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiUrl}/socket/notificationHub`)
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (notification) => {
      setNotifications((prev) => [notification, ...(prev ?? [])]);
      setUnreadCount((prev) => prev + 1);
    });

    connection
      .start()
      .then(() => console.log("Connected to notification hub"))
      .catch((err) => console.error(err));

    return () => {
      connection
        .stop()
        .catch((err) => console.error("Error stopping connection", err));
    };
  }, [apiUrl]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <div className="bg-rose-500 rounded-full w-4 h-4 absolute -top-0.5 -right-0.5 flex items-center justify-center p-0 text-[8px]">
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <Badge variant="secondary">{unreadCount} unread</Badge>
        </div>
        <ScrollArea className="h-96">
          <div className="p-2">
            {notifications &&
              notifications.map((notification, index) => (
                <div key={notification.id}>
                  <Link
                    href={`/admin/notifications/${notification.id}`}
                    onClick={() => setOpen(false)}
                  >
                    <div
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        !notification.isRead
                          ? "bg-green-950/40"
                          : "bg-transparent"
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(
                          notification.type as NotificationTypes
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="w-2 h-2  rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs  mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <Clock className="h-3 w-3 " />
                          <span className="text-xs ">
                            {formatTimeAgo(notification.createdOn as string)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  {index < notifications.length - 1 && (
                    <Separator className="my-1" />
                  )}
                </div>
              ))}
          </div>
        </ScrollArea>
        <div className="border-t">
          <Link href="/admin/notifications" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-center text-sm">
              See All Notifications
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

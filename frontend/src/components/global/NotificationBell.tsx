"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

import { Notification, NotificationTypes } from "@/types/models";
import { GetAllNotifications } from "@/actions/Notifications";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //  const recentNotifications = mockNotifications.slice(0, 10);
  }, []);

  useEffect(() => {
    setNotifications([]);
    const getData = async () => {
      const data = await GetAllNotifications({
        pageNumber: 1,
        pageSize: 10,
      });

      setNotifications(data.data as unknown as Notification[]);
      setUnreadCount(
        (data.data as unknown as Notification[]).filter((n) => !n.isRead).length
      );
      setLoading(false);
    };
    getData();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
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
                      className={`flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
                        !notification.isRead ? "bg-blue-50/50" : ""
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
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
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

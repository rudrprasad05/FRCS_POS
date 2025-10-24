import { Notification, NotificationTypes } from "@/types/models";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

export function GetNotificationIcon({ type }: { type: Notification["type"] }) {
  console.log(type);
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

import { NotificationBell } from "@/components/global/NotificationBell";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationProvider } from "@/context/NotificationContext";

export function CompanyHeader() {
  return (
    <header className="z-50 sticky top-0 left-0 flex items-center justify-between px-6 py-4 bg-background border-b border-solid">
      <div className="flex items-center gap-4 w-full">
        <SidebarTrigger />

        <div className="ml-auto">
          <NotificationProvider>
            <NotificationBell />
          </NotificationProvider>
        </div>
      </div>
    </header>
  );
}

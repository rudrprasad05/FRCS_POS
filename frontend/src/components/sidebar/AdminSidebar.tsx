import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarLogo } from "./SideBarLogo";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarUserMenu } from "./SidebarUserMenu";


export function AdminSidebar() {
  return (
    <Sidebar className="border-r bg-background">
      <SidebarHeader className="border-b border-solid p-4">
        <SidebarLogo />
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarNavigation />
      </SidebarContent>

      <SidebarFooter className="border-t border-solid p-2">
        <SidebarUserMenu />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

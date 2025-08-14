import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { CompanySidebarLogo } from "./CompanySideBarLogo";
import { CompanySidebarNavigation } from "./CompanySidebarNavigation";
import { CompanySidebarUserMenu } from "./CompanySidebarUserMenu";

export function CompanySidebar() {
  return (
    <Sidebar className="border-r bg-background">
      <SidebarHeader className="border-b border-solid p-4">
        <CompanySidebarLogo />
      </SidebarHeader>

      <SidebarContent className="p-2">
        <CompanySidebarNavigation />
      </SidebarContent>

      <SidebarFooter className="border-t border-solid p-2">
        <CompanySidebarUserMenu />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

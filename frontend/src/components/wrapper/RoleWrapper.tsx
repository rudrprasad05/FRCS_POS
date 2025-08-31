import { useAuth } from "@/context/UserContext";
import { UserRoles } from "@/types/models";

interface RoleWrapperProps {
  allowedRoles: UserRoles[];
  children: React.ReactNode;
}

export function RoleWrapper({ allowedRoles, children }: RoleWrapperProps) {
  const { user } = useAuth();

  if (!user) return null;
  if (!allowedRoles.includes(user.role?.toUpperCase() as UserRoles))
    return null;

  return <>{children}</>;
}

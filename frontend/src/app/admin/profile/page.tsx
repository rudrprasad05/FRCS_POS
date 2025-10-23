"use client";

import { GetOneUser } from "@/actions/User";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { HeaderWithBackButton } from "@/components/global/HeaderWithBackButton";
import { PasswordSection } from "@/components/profile/PasswordSection";
import { ProfilePictureSection } from "@/components/profile/ProfilePicture";
import { UsernameSection } from "@/components/profile/UserameSection";
import { RoleWrapper } from "@/components/wrapper/RoleWrapper";
import { useAuth } from "@/context/UserContext";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { User, UserRoles } from "@/types/models";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <Loader2 className="animate-spin" />;
  }

  return <ProfileContainer user={user} />;
}

const ProfileContainer = ({ user }: { user: User }) => {
  const queryClient = useQueryClient();
  const userId = user.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["editUser", userId],
    queryFn: () => GetOneUser({ uuid: userId }),
    staleTime: FIVE_MINUTE_CACHE,
  });

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (error || !data?.success || !data.data) {
    toast.error("Failed to fetch product data");
    return <NoDataContainer />;
  }

  console.log("rhrhr", user);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto ">
        <HeaderWithBackButton
          link="/admin/users"
          title="User Profile"
          description="Manage user account settings and preferences"
        />

        <div className="mt-8 space-y-6">
          <ProfilePictureSection user={data.data} />
          <UsernameSection user={data.data} />

          <RoleWrapper allowedRoles={[UserRoles.SUPERADMIN]}>
            <PasswordSection user={data.data} />
          </RoleWrapper>
        </div>
      </div>
    </div>
  );
};

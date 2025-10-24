"use client";

import { GetOneUser } from "@/actions/User";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { HeaderWithBackButton } from "@/components/global/HeaderWithBackButton";
import { ProfilePictureSection } from "@/components/profile/ProfilePicture";
import { UsernameSection } from "@/components/profile/UserameSection";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { User } from "@/types/models";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const params = useParams();
  const userId = String(params.userId);
  const companyName = String(params.companyName);

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

  const user = data.data as User;

  console.log("rhrhr", user);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto ">
        <HeaderWithBackButton
          link={`/${companyName}/users`}
          title="User Profile"
          description="Manage user account settings and preferences"
        />

        <div className="mt-8 space-y-6">
          <ProfilePictureSection user={user} />
          <UsernameSection user={user} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { ActivateUser, GetOneUser, SoftDeleteUser } from "@/actions/User";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { ConfirmDialog } from "@/components/global/ConfirmDialog";
import { HeaderWithBackButton } from "@/components/global/HeaderWithBackButton";
import { ProfilePictureSection } from "@/components/profile/ProfilePicture";
import { UsernameSection } from "@/components/profile/UserameSection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { User } from "@/types/models";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
export default function ProfilePage() {
  const queryClient = useQueryClient();
  const params = useParams();
  const userId = String(params.userId);

  const deleteFn = async (): Promise<{ success: boolean }> => {
    const res = await SoftDeleteUser(userId);

    queryClient.invalidateQueries({
      queryKey: ["editUser", userId],
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: ["adminUsers", {}],
      exact: false,
    });
    return { success: res.success };
  };

  const activateFn = async (): Promise<{ success: boolean }> => {
    const res = await ActivateUser(userId);

    queryClient.invalidateQueries({
      queryKey: ["editUser", userId],
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: ["adminUsers", {}],
      exact: false,
    });

    return { success: res.success };
  };

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
          link="/admin/users"
          title="User Profile"
          description="Manage user account settings and preferences"
        />

        <div className="my-8 space-y-6">
          <ProfilePictureSection user={user} />
          <UsernameSection user={user} />
        </div>

        {!user.isDeleted && (
          <Card className="flex flex-col border border-dashed border-rose-400 rounded-lg">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <Label>Delete entity</Label>
                <CardDescription>
                  This action is reversable but will remove the item from user
                  view
                </CardDescription>
              </div>
              <ConfirmDialog
                uuid={user.id}
                title="Delete entity"
                description="This action cannot be undone."
                confirmWord="delete"
                actionLabel="Delete"
                successMessage="Entity Deleted"
                errorMessage="Error Occurred"
                buttonVariant="destructive"
                buttonIcon={<Trash />}
                queryKeys={[
                  ["entitys", user.email],
                  ["editentity", user.id],
                ]}
                onConfirm={async () => {
                  return await deleteFn();
                }}
              />
            </CardContent>
          </Card>
        )}

        {user.isDeleted && (
          <Card className="flex flex-col border border-dashed border-green-400 rounded-lg">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <Label>Activate entity</Label>
                <CardDescription>
                  This action is reversable but will include the item to user
                  view
                </CardDescription>
              </div>
              <ConfirmDialog
                uuid={user.id}
                title="Activate entity"
                description="This will make the entity visible again."
                confirmWord="activate"
                actionLabel="Activate"
                successMessage="Entity Activated"
                errorMessage="Error Occurred"
                buttonVariant="default"
                buttonIcon={<Check />}
                queryKeys={[
                  ["entitys", user.email],
                  ["editentity", user.id],
                ]}
                onConfirm={async () => {
                  return await activateFn();
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

"use client";

import { HeaderWithBackButton } from "@/components/global/HeaderWithBackButton";
import { PasswordSection } from "@/components/profile/PasswordSection";
import { ProfilePictureSection } from "@/components/profile/ProfilePicture";
import { UsernameSection } from "@/components/profile/UserameSection";
import { RoleWrapper } from "@/components/wrapper/RoleWrapper";
import { UserRoles } from "@/types/models";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <HeaderWithBackButton
          title="User Profile"
          description="Manage user account settings and preferences"
        />

        <div className="mt-8 space-y-6">
          <ProfilePictureSection />
          <UsernameSection />

          <RoleWrapper allowedRoles={[UserRoles.ADMIN, UserRoles.CASHIER]}>
            <PasswordSection />
          </RoleWrapper>
        </div>
      </div>
    </div>
  );
}

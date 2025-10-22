"use client";

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ProfilePictureSection() {
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    setIsUploading(true);

    try {
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // TODO: Upload to your backend/storage service
      // const formData = new FormData()
      // formData.append('file', file)
      // await fetch('/api/profile/picture', { method: 'POST', body: formData })

      toast.success("Profile picture updated");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>
          Update your profile picture. Recommended size: 400x400px
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={profileImage || undefined}
                alt="Profile picture"
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-card p-1.5 shadow-md">
              <Camera className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <Button
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() =>
                document.getElementById("profile-picture")?.click()
              }
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload new picture"}
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF. Max size 5MB.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

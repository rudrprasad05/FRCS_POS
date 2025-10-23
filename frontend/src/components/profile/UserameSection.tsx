"use client";

import { ChangeUsername } from "@/actions/User";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/types/models";
import { Check, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function UsernameSection({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [newUsername, setNewUsername] = useState(username);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (newUsername.trim() === "") {
      return;
    }

    if (newUsername === username) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);

    try {
      const res = await ChangeUsername(
        { newUsername: newUsername },
        { userId: user.id }
      );

      if (res.success) {
        toast.success("Username updated");
      } else {
        toast.error("An error occured", { description: res.message });
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setNewUsername(username);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Username</CardTitle>
        <CardDescription>
          This is your unique identifier within the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="flex gap-2">
              <Input
                id="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                disabled={!isEditing || isSaving}
                className="max-w-md"
                placeholder="Enter username"
              />
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit username</span>
                </Button>
              ) : (
                <>
                  <Button
                    variant="default"
                    size="icon"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Save username</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

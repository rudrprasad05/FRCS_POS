"use client";

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
import { Check, Pencil } from "lucide-react";
import { useState } from "react";

export function UsernameSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("johndoe");
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
      // TODO: Call your API to update username
      // await fetch('/api/profile/username', {
      //   method: 'PATCH',
      //   body: JSON.stringify({ username: newUsername })
      // })

      setUsername(newUsername);
      setIsEditing(false);
    } catch (error) {
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

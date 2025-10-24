"use client";

import { ConfirmDialog } from "@/components/global/ConfirmDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BaseModel } from "@/types/models";
import { Check, Trash } from "lucide-react";
import { useParams } from "next/navigation";

interface IConfigTab {
  entity: BaseModel;
  deleteFn: (a: string) => Promise<{ success: boolean }>;
  activateFn: (a: string) => Promise<{ success: boolean }>;
}

export default function ConfigTab({
  entity,
  deleteFn,
  activateFn,
}: IConfigTab) {
  console.log("conf", entity);
  const params = useParams();
  const entityName = decodeURIComponent(params.entityName as string);
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // set to false for 24h format
  };

  const parseDate = (
    options: Intl.DateTimeFormatOptions,
    date?: string
  ): string => {
    const dateFormatOptions: Intl.DateTimeFormatOptions = {
      ...options,
      timeZone: "Pacific/Auckland", // GMT+12 (handles daylight saving too)
    };

    if (!date || date.trim().length === 0) {
      return new Intl.DateTimeFormat(undefined, dateFormatOptions).format(
        new Date()
      );
    }

    const parsedDate = new Date(date);
    return new Intl.DateTimeFormat(undefined, dateFormatOptions).format(
      parsedDate
    );
  };

  return (
    <div className="grow">
      <div className="space-y-6 w-full py-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="co">Created On</Label>
          <Input
            id="co"
            disabled
            value={parseDate(dateFormatOptions, entity.createdOn)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="uo">Updated On</Label>
          <Input
            id="uo"
            disabled
            value={parseDate(dateFormatOptions, entity.updatedOn)}
          />
        </div>

        {!entity.isDeleted && (
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
                uuid={entity.uuid}
                title="Delete entity"
                description="This action cannot be undone."
                confirmWord="delete"
                actionLabel="Delete"
                successMessage="Entity Deleted"
                errorMessage="Error Occurred"
                buttonVariant="destructive"
                buttonIcon={<Trash />}
                queryKeys={[
                  ["entitys", entityName],
                  ["editentity", entity.uuid],
                ]}
                onConfirm={async () => {
                  return await deleteFn(entity.uuid);
                }}
              />
            </CardContent>
          </Card>
        )}

        {entity.isDeleted && (
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
                uuid={entity.uuid}
                title="Activate entity"
                description="This will make the entity visible again."
                confirmWord="activate"
                actionLabel="Activate"
                successMessage="Entity Activated"
                errorMessage="Error Occurred"
                buttonVariant="default"
                buttonIcon={<Check />}
                queryKeys={[
                  ["entitys", entityName],
                  ["editentity", entity.uuid],
                ]}
                onConfirm={async () => {
                  return await activateFn(entity.uuid);
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

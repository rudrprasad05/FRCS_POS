"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Company } from "@/types/models";
import { ConfirmDialog } from "@/components/global/ConfirmDialog";
import { Check, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { ActivateCompany, SoftDeleteCompany } from "@/actions/Company";

export default function ConfigTab({ company }: { company: Company }) {
  const params = useParams();
  const companyName = decodeURIComponent(params.companyName as string);
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
            value={parseDate(dateFormatOptions, company.createdOn)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="uo">Updated On</Label>
          <Input
            id="uo"
            disabled
            value={parseDate(dateFormatOptions, company.updatedOn)}
          />
        </div>

        {!company.isDeleted && (
          <Card className="flex flex-col border border-dashed border-rose-400 rounded-lg">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <Label>Delete company</Label>
                <CardDescription>
                  This action is reversable but will remove the item from user
                  view
                </CardDescription>
              </div>
              <ConfirmDialog
                uuid={company.uuid}
                title="Delete company"
                description="This action cannot be undone."
                confirmWord="delete"
                actionLabel="Delete"
                successMessage="company Deleted"
                errorMessage="Error Occurred"
                buttonVariant="destructive"
                buttonIcon={<Trash />}
                queryKeys={[
                  ["companys", companyName],
                  ["editcompany", company.uuid],
                ]}
                onConfirm={async (uuid) => {
                  return await SoftDeleteCompany(company.uuid);
                }}
              />
            </CardContent>
          </Card>
        )}

        {company.isDeleted && (
          <Card className="flex flex-col border border-dashed border-green-400 rounded-lg">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <Label>Activate company</Label>
                <CardDescription>
                  This action is reversable but will include the item to user
                  view
                </CardDescription>
              </div>
              <ConfirmDialog
                uuid={company.uuid}
                title="Activate company"
                description="This will make the company visible again."
                confirmWord="activate"
                actionLabel="Activate"
                successMessage="company Activated"
                errorMessage="Error Occurred"
                buttonVariant="default"
                buttonIcon={<Check />}
                queryKeys={[
                  ["companys", companyName],
                  ["editcompany", company.uuid],
                ]}
                onConfirm={async (uuid) => {
                  return await ActivateCompany(company.uuid);
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

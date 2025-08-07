"use client";

import { Loader2 } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

interface IDashData {
  title: string;
  val?: number;
  icon: React.ElementType;
  isLoading: boolean;
}

export default function DashboardStatsCard({ input }: { input: IDashData }) {
  const Icon = input.icon;

  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium ">{input.title}</CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent className="mt-auto">
        {input.isLoading && <Loader2 className="text-2xl  animate-spin" />}
        <div className="text-2xl font-bold ">
          {input?.val || (!input.isLoading && 0)}
        </div>
      </CardContent>
    </Card>
  );
}

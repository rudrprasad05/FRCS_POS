"use client";

import NoDataContainer from "@/components/containers/NoDataContainer";
import { HeaderWithBackButton } from "@/components/global/HeaderWithBackButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Warehouse } from "@/types/models";
import { Box, Building, Edit, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function WarehouseInfo({ wh }: { wh: Warehouse | null }) {
  const params = useParams();
  const companyName = String(params.companyName);
  if (!wh) {
    return <NoDataContainer />;
  }
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <HeaderWithBackButton
          link={`/${companyName}/warehouse`}
          title={wh.name}
          description={wh.isActive ? "Active" : "Inactive"}
        />

        <Button asChild className="w-24">
          <Link
            prefetch
            href={`edit`}
            className="w-24 flex items-center justify-between"
          >
            Edit
            <Edit className="" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Company</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="capitalize text-2xl font-bold">
              {wh.name || "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Location</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="capitalize text-2xl font-bold">
              {wh.location || "Not specified"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Batches
            </CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="capitalize text-2xl font-bold">
              {wh.productBatches?.length || "0"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

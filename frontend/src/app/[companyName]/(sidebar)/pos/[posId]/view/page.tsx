"use client";
import { GetPosTerminalById } from "@/actions/PosTerminal";
import NewSessionDialog from "@/components/company/pos/NewPosSessionDialoge";
import SalesSection from "@/components/company/pos/view/ViewPosSales";
import SessionsSection from "@/components/company/pos/view/ViewPosSessions";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { H1 } from "@/components/font/HeaderFonts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { type PosTerminal } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PenBox } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { toast } from "sonner";

type PageProps = {
  params: Promise<{ companyId: string; posId: string; sessionId: string }>;
};

export default function PosTerminalPage({ params }: PageProps) {
  const { posId } = use(params);

  const { data, isLoading, error } = useQuery({
    queryKey: ["editTerminal", posId],
    queryFn: () => GetPosTerminalById(posId),
    staleTime: FIVE_MINUTE_CACHE,
  });

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (error || !data?.success || !data.data) {
    toast.error("Failed to fetch product data");
    return <NoDataContainer />;
  }

  return (
    <div className="space-y-6">
      <PosTerminalInfo posTerminal={data.data} />
      <PosTerminalDataTabs />
    </div>
  );
}

function PosTerminalInfo({ posTerminal }: { posTerminal: PosTerminal | null }) {
  if (!posTerminal) {
    return <NoDataContainer />;
  }
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <H1>{posTerminal.name}</H1>
            <Badge variant={posTerminal.isActive ? "default" : "secondary"}>
              {posTerminal.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <Button variant={"secondary"} className="ml-auto mr-2" asChild>
          <Link href={`edit`}>
            <PenBox />
            Edit Terminal
          </Link>
        </Button>
        <NewSessionDialog terminal={posTerminal} />
      </div>
    </div>
  );
}

function PosTerminalDataTabs() {
  return (
    <Tabs defaultValue="sessions" className="space-y-4">
      <TabsList>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
        <TabsTrigger value="sales">Sales</TabsTrigger>
      </TabsList>

      <TabsContent value="sessions" className="space-y-4">
        <SessionsSection />
      </TabsContent>

      <TabsContent value="sales" className="space-y-4">
        <SalesSection />
      </TabsContent>
    </Tabs>
  );
}

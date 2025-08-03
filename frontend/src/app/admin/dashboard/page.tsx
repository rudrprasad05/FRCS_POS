"use client";

import { GetSuperAdminDashboard } from "@/actions/SuperAdminDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import React, { useEffect, useState } from "react";
import { SuperAdminDashboardDTO } from "@/types/res";
import { LoadingCard } from "@/components/global/LoadingContainer";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Company } from "@/types/models";

export default function SuperAdminDashboardPage() {
  const [data, setData] = useState<SuperAdminDashboardDTO | undefined>();

  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    const res = await GetSuperAdminDashboard();
    setData(res.data);
    setIsLoading(false);
  };
  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <div className="p-12 space-y-6">
      <Card className="">
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 text-muted-foreground capitalize text-sm">
            <div>Username</div>
            <div>Email</div>
            <div>Id</div>
          </div>
          {data?.users.map((user, i) => (
            <div className="grid grid-cols-3" key={i}>
              <div>{user.username}</div>
              <div>{user.email}</div>
              <div>{user.id}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pos Terminals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data?.companies.map((company) => (
            <CollapsibleCard company={company} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function CollapsibleCard({ company }: { company: Company }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible>
      <CollapsibleTrigger
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center border w-full p-2 rounded-lg text-start"
      >
        Company: {company.name}
        {isOpen && <ChevronLeft className="rotate-90" />}
        {!isOpen && <ChevronRight className="rotate-90" />}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="w-11/12 mt-2 ml-auto border rounded-lg p-2">
          {company.posTerminals?.map((pos) => (
            <div>PosTerminal: {pos.name}</div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

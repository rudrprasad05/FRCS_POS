"use client";

import { Input } from "@/components/ui/input";

import { useParams } from "next/navigation";

import { GetOneSupplierWithBatch } from "@/actions/Supplier";
import NoDataContainer from "@/components/containers/NoDataContainer";
import { HeaderWithBackButton } from "@/components/global/HeaderWithBackButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FIVE_MINUTE_CACHE } from "@/lib/const";
import { Supplier } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PenBox } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ViewSupplierPage() {
  const params = useParams();
  const companyName = params.companyName;
  const supplierId = String(params.supplierId);

  const { data, isLoading, error } = useQuery({
    queryKey: ["editSupplier", supplierId],
    queryFn: () => GetOneSupplierWithBatch({ uuid: supplierId }),
    staleTime: FIVE_MINUTE_CACHE,
  });

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  if (error || !data?.success || !data.data) {
    toast.error("Failed to fetch product data");
    return <NoDataContainer />;
  }

  const supplier = data.data as Supplier;

  return (
    <div className="min-h-screen bg-background">
      <div className="mb-8 flex pr-4 justify-between items-start">
        <HeaderWithBackButton
          title={"View Supplier"}
          description={`You are veiwing the supplier "${supplier.name}"`}
          link={`/${companyName}/suppliers`}
        />
        <Button asChild>
          <Link href={`edit`}>
            <PenBox />
            Edit Supplier
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 p-4 items-start">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input disabled value={supplier.name} />
        </div>

        <div className="space-y-2">
          <Label>Code</Label>
          <Input disabled value={supplier.code} />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input disabled value={supplier.email} />
        </div>
        <div className="space-y-2">
          <Label>Contact Name</Label>
          <Input disabled value={supplier.contactName} />
        </div>

        <div className="space-y-2">
          <Label>Supplier Address</Label>

          <Input disabled value={supplier.address} />
        </div>

        <div className="space-y-2">
          <Label>TIN</Label>
          <Input disabled value={supplier.taxNumber} />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input disabled value={supplier.phone} />
        </div>
      </div>
    </div>
  );
}

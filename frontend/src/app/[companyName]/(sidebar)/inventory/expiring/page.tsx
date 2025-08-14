"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductBatchDTO, Warehouse } from "@/types/models";
import { GetExpiringProductBatches } from "@/actions/Inventory";
import { LoadingContainer } from "@/components/global/LoadingContainer";
import { Clock } from "lucide-react";
import { differenceInDays } from "date-fns";

export default function ExpiringProductsPage() {
  const params = useParams();
  const companyId = Number(params.companyId);
  
  const [loading, setLoading] = useState(true);
  const [expiringBatches, setExpiringBatches] = useState<ProductBatchDTO[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [daysThreshold, setDaysThreshold] = useState<number>(30); // Default to 30 days
  
  useEffect(() => {
    // Fetch warehouses for the company
    // This is a placeholder - you would need to implement this API call
    const fetchWarehouses = async () => {
      // Placeholder for fetching warehouses
      // setWarehouses(warehousesData);
    };
    
    fetchWarehouses();
  }, [companyId]);
  
  useEffect(() => {
    const fetchExpiringBatches = async () => {
      setLoading(true);
      try {
        const warehouseId = selectedWarehouse ? Number(selectedWarehouse) : undefined;
        const response = await GetExpiringProductBatches(companyId, daysThreshold, warehouseId);
        if (response.success && response.data) {
          setExpiringBatches(response.data);
        }
      } catch (error) {
        console.error("Error fetching expiring product batches:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpiringBatches();
  }, [companyId, selectedWarehouse, daysThreshold]);
  
  const handleWarehouseChange = (value: string) => {
    setSelectedWarehouse(value);
  };
  
  const handleDaysThresholdChange = (value: string) => {
    setDaysThreshold(Number(value));
  };
  
  // Function to determine expiry severity level
  const getExpirySeverity = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = differenceInDays(expiry, today);
    
    if (daysUntilExpiry <= 7) return "high";
    if (daysUntilExpiry <= 14) return "medium";
    return "low";
  };
  
  // Function to get severity class for styling
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 border-red-500 text-red-800";
      case "medium":
        return "bg-amber-100 border-amber-500 text-amber-800";
      case "low":
        return "bg-yellow-100 border-yellow-500 text-yellow-800";
      default:
        return "bg-gray-100 border-gray-500 text-gray-800";
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Expiring Products</h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select value={selectedWarehouse} onValueChange={handleWarehouseChange}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="All Warehouses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Warehouses</SelectItem>
            {warehouses.map((warehouse) => (
              <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                {warehouse.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={daysThreshold.toString()} onValueChange={handleDaysThresholdChange}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Expiring within" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 days</SelectItem>
            <SelectItem value="14">14 days</SelectItem>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="60">60 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {loading ? (
        <LoadingContainer />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expiringBatches.length > 0 ? (
            expiringBatches.map((batch) => {
              const severity = batch.expiryDate ? getExpirySeverity(batch.expiryDate) : "low";
              const severityClass = getSeverityClass(severity);
              
              return (
                <Card key={batch.uuid} className={`border-l-4 ${severityClass}`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {batch.productName}
                    </CardTitle>
                    <Clock className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      <p>SKU: {batch.productSku}</p>
                      <p>Quantity: {batch.quantity}</p>
                      {batch.expiryDate && (
                        <p className="font-semibold">
                          Expires: {new Date(batch.expiryDate).toLocaleDateString()}
                          {batch.expiryDate && (
                            <span className="ml-2">
                              ({differenceInDays(new Date(batch.expiryDate), new Date())} days left)
                            </span>
                          )}
                        </p>
                      )}
                      <p>Warehouse: {batch.warehouseName}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10">
              <p>No expiring products found within the selected timeframe.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
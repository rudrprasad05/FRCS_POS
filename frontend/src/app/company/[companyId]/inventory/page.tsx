"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventorySummaryDTO, ProductBatchDTO, ProductStockDTO, StockTransferDTO } from "@/types/models";
import { GetInventorySummary, GetLowStockProducts, GetExpiringProductBatches, GetStockTransferHistory } from "@/actions/Inventory";
import { LoadingContainer } from "@/components/global/LoadingContainer";

export default function InventoryPage() {
  const params = useParams();
  const companyId = Number(params.companyId);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary");
  
  const [summary, setSummary] = useState<InventorySummaryDTO | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<ProductStockDTO[]>([]);
  const [expiringProducts, setExpiringProducts] = useState<ProductBatchDTO[]>([]);
  const [stockTransfers, setStockTransfers] = useState<StockTransferDTO[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "summary") {
          const summaryRes = await GetInventorySummary(companyId);
          if (summaryRes.success && summaryRes.data) {
            setSummary(summaryRes.data);
          }
        } else if (activeTab === "low-stock") {
          const lowStockRes = await GetLowStockProducts(companyId);
          if (lowStockRes.success && lowStockRes.data) {
            setLowStockProducts(lowStockRes.data);
          }
        } else if (activeTab === "expiring") {
          const expiringRes = await GetExpiringProductBatches(companyId);
          if (expiringRes.success && expiringRes.data) {
            setExpiringProducts(expiringRes.data);
          }
        } else if (activeTab === "transfers") {
          const transfersRes = await GetStockTransferHistory(companyId);
          if (transfersRes.success && transfersRes.data) {
            setStockTransfers(transfersRes.data);
          }
        }
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [companyId, activeTab]);
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      
      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Products</TabsTrigger>
          <TabsTrigger value="transfers">Stock Transfers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          {loading ? (
            <LoadingContainer />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Total Products: {summary?.totalProducts || 0}</p>
                  <p>Total Batches: {summary?.totalBatches || 0}</p>
                  <p>Total Warehouses: {summary?.totalWarehouses || 0}</p>
                  <p>Total Inventory Value: ${summary?.totalInventoryValue.toFixed(2) || "0.00"}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Low Stock Products: {summary?.lowStockProductsCount || 0}</p>
                  <p>Expiring Products: {summary?.expiringProductsCount || 0}</p>
                </CardContent>
              </Card>
              
              {/* Warehouse summaries will be added in the Inventory Summary component */}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="low-stock">
          {loading ? (
            <LoadingContainer />
          ) : (
            <div>
              {/* Low Stock Products component will be added here */}
              <p>Low Stock Products will be displayed here</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="expiring">
          {loading ? (
            <LoadingContainer />
          ) : (
            <div>
              {/* Expiring Products component will be added here */}
              <p>Expiring Products will be displayed here</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="transfers">
          {loading ? (
            <LoadingContainer />
          ) : (
            <div>
              {/* Stock Transfers component will be added here */}
              <p>Stock Transfers will be displayed here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
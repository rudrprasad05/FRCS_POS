"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductStockDTO, Warehouse } from "@/types/models";
import { GetLowStockProducts } from "@/actions/Inventory";
import { LoadingContainer } from "@/components/global/LoadingContainer";
import { AlertTriangle } from "lucide-react";

export default function LowStockPage() {
  const params = useParams();
  const companyId = Number(params.companyId);

  const [loading, setLoading] = useState(true);
  const [lowStockProducts, setLowStockProducts] = useState<ProductStockDTO[]>(
    []
  );
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");

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
    const fetchLowStockProducts = async () => {
      setLoading(true);
      try {
        const warehouseId = selectedWarehouse
          ? Number(selectedWarehouse)
          : undefined;
        const response = await GetLowStockProducts(companyId, warehouseId);
        if (response.success && response.data) {
          setLowStockProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching low stock products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockProducts();
  }, [companyId, selectedWarehouse]);

  const handleWarehouseChange = (value: string) => {
    setSelectedWarehouse(value);
  };

  // Function to determine severity level based on stock percentage
  const getStockSeverity = (
    currentStock: number,
    minStock: number,
    maxStock: number
  ) => {
    if (!maxStock) return "high"; // If no max stock is set, default to high severity

    const stockPercentage = (currentStock / maxStock) * 100;

    if (stockPercentage <= 10) return "high";
    if (stockPercentage <= 30) return "medium";
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
        <h1 className="text-3xl font-bold">Low Stock Products</h1>
      </div>

      <div className="mb-6">
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
      </div>

      {loading ? (
        <LoadingContainer />
      ) : (
        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        //   {lowStockProducts.length > 0 ? (
        //     lowStockProducts.map((product) => {
        //       const severity = getStockSeverity(
        //         product.currentStock,
        //         product.minStockLevel || 0,
        //         product.maxStockLevel || 0
        //       );
        //       const severityClass = getSeverityClass(severity);

        //       return (
        //         <Card key={product.productId} className={`border-l-4 ${severityClass}`}>
        //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        //             <CardTitle className="text-sm font-medium">
        //               {product.productName}
        //             </CardTitle>
        //             <AlertTriangle className="h-4 w-4" />
        //           </CardHeader>
        //           <CardContent>
        //             <div className="text-xs text-muted-foreground">
        //               <p>SKU: {product.productSku}</p>
        //               <p>Current Stock: {product.currentStock}</p>
        //               {product.minStockLevel !== null && (
        //                 <p>Minimum Stock Level: {product.minStockLevel}</p>
        //               )}
        //               {product.maxStockLevel !== null && (
        //                 <p>Maximum Stock Level: {product.maxStockLevel}</p>
        //               )}
        //               {product.warehouseName && (
        //                 <p>Warehouse: {product.warehouseName}</p>
        //               )}
        //             </div>
        //           </CardContent>
        //         </Card>
        //       );
        //     })
        //   ) : (
        //     <div className="col-span-full text-center py-10">
        //       <p>No low stock products found.</p>
        //     </div>
        //   )}
        // </div>
        <></>
      )}
    </div>
  );
}

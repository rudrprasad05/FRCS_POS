"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventorySummaryDTO, WarehouseInventorySummaryDTO } from "@/types/models/inventory";
import { GetInventorySummary } from "@/actions/Inventory";
import { LoadingContainer } from "@/components/global/LoadingContainer";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function InventorySummaryPage() {
  const params = useParams();
  const companyId = Number(params.companyId);
  
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<InventorySummaryDTO | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const response = await GetInventorySummary(companyId);
        if (response.success && response.data) {
          setSummary(response.data);
        }
      } catch (error) {
        console.error("Error fetching inventory summary:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSummary();
  }, [companyId]);
  
  // Prepare data for warehouse distribution chart
  const prepareWarehouseData = () => {
    if (!summary || !summary.warehouseSummaries) return [];
    
    return summary.warehouseSummaries.map(warehouse => ({
      name: warehouse.warehouseName,
      value: warehouse.totalProducts,
    }));
  };
  
  // Prepare data for product category distribution chart
  const prepareCategoryData = () => {
    if (!summary || !summary.categorySummaries) return [];
    
    return summary.categorySummaries.map(category => ({
      name: category.categoryName || "Uncategorized",
      value: category.productCount,
    }));
  };
  
  // Prepare data for product value by warehouse chart
  const prepareValueData = () => {
    if (!summary || !summary.warehouseSummaries) return [];
    
    return summary.warehouseSummaries.map(warehouse => ({
      name: warehouse.warehouseName,
      value: warehouse.totalValue,
    }));
  };
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1'];
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Inventory Summary</h1>
      
      {loading ? (
        <LoadingContainer />
      ) : summary ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalProducts}</div>
                <p className="text-xs text-muted-foreground">Unique products in inventory</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${summary.totalValue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Estimated value of all inventory</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.lowStockCount}</div>
                <p className="text-xs text-muted-foreground">Products below minimum stock level</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.expiringCount}</div>
                <p className="text-xs text-muted-foreground">Products expiring within 30 days</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Warehouse Overview</TabsTrigger>
              <TabsTrigger value="categories">Product Categories</TabsTrigger>
              <TabsTrigger value="value">Inventory Value</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Products by Warehouse</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareWarehouseData()}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 70,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" name="Products" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {summary.warehouseSummaries.map((warehouse) => (
                  <Card key={warehouse.warehouseId}>
                    <CardHeader>
                      <CardTitle className="text-lg">{warehouse.warehouseName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Products:</span>
                          <span className="font-medium">{warehouse.totalProducts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Items:</span>
                          <span className="font-medium">{warehouse.totalItems}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Value:</span>
                          <span className="font-medium">${warehouse.totalValue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Low Stock Items:</span>
                          <span className="font-medium">{warehouse.lowStockCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Expiring Soon:</span>
                          <span className="font-medium">{warehouse.expiringCount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="categories" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Products by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareCategoryData()}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareCategoryData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} products`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {summary.categorySummaries.map((category, index) => (
                        <div key={index} className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{category.categoryName || "Uncategorized"}</span>
                              <span>{category.productCount} products</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                              <div 
                                className="h-2.5 rounded-full" 
                                style={{ 
                                  width: `${(category.productCount / summary.totalProducts) * 100}%`,
                                  backgroundColor: COLORS[index % COLORS.length]
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="value" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Value by Warehouse</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareValueData()}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 70,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Value']} />
                        <Bar dataKey="value" name="Value" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Value Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {summary.warehouseSummaries.map((warehouse, index) => (
                        <div key={warehouse.warehouseId} className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{warehouse.warehouseName}</span>
                              <span>${warehouse.totalValue.toFixed(2)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                              <div 
                                className="h-2.5 rounded-full" 
                                style={{ 
                                  width: `${(warehouse.totalValue / summary.totalValue) * 100}%`,
                                  backgroundColor: COLORS[index % COLORS.length]
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="text-center py-10">
          <p>No inventory data available.</p>
        </div>
      )}
    </div>
  );
}
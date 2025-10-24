"use client";

import { GetSalesLast12Months, GetTaxDueLast12Months } from "@/actions/Report";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MonthlySalesReportDto, MonthlyTaxReportDto } from "@/types/res";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

//

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label, type }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="font-semibold mb-2">{label}</p>
        {type === "sales" ? (
          <>
            <p className="text-sm text-blue-600">
              Sales: {formatCurrency(payload[0].value)}
            </p>
            <p className="text-sm text-gray-600">
              Count: {payload[0].payload.saleCount}
            </p>
          </>
        ) : (
          <p className="text-sm text-green-600">
            Tax Due: {formatCurrency(payload[0].value)}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function SalesAndTaxReports() {
  const [salesData, setSalesData] = useState<MonthlySalesReportDto[]>([]);
  const [taxData, setTaxData] = useState<MonthlyTaxReportDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const companyName = String(params.companyName);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const [sales, tax] = await Promise.all([
          GetSalesLast12Months({ companyName }),
          GetTaxDueLast12Months({ companyName }),
        ]);
        setSalesData(sales.data as MonthlySalesReportDto[]);
        setTaxData(tax.data as MonthlyTaxReportDto[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [companyName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const totalSales = salesData.reduce((sum, item) => sum + item.totalSales, 0);
  const totalTax = taxData.reduce((sum, item) => sum + item.taxDue, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Sales (12 Months)
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              {formatCurrency(totalSales)}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Tax Due (12 Months)
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              {formatCurrency(totalTax)}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales - Last 12 Months</CardTitle>
          <CardDescription>Total sales amount per month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="monthName"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip type="sales" />} />
              <Legend />
              <Bar
                dataKey="totalSales"
                fill="#3b82f6"
                name="Total Sales"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Tax Due - Last 12 Months</CardTitle>
          <CardDescription>Tax collected per month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={taxData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="monthName"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value)}
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip type="tax" />} />
              <Legend />
              <Bar
                dataKey="taxDue"
                fill="#10b981"
                name="Tax Due"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

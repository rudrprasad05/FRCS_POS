"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Generate mock sales data for the previous 12 months
const generateSalesData = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentMonth = new Date().getMonth();
  const data = [];

  for (let i = 11; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const baseAmount = 15000 + Math.random() * 25000;
    const seasonalMultiplier =
      monthIndex === 11 ? 1.8 : monthIndex === 0 ? 1.5 : 1;
    const sales = Math.round(baseAmount * seasonalMultiplier);

    data.push({
      month: months[monthIndex],
      sales: sales,
      fill: "hsl(var(--chart-1))",
    });
  }

  return data;
};

const chartConfig = {
  sales: {
    label: "Sales ($)",
    color: "hsl(142, 76%, 36%)", // Green color matching the dashboard
  },
};

export default function SuperAdminSalesGraph() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedData, setAnimatedData] = useState<any[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const salesData = useRef(generateSalesData());

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateBars();
        }
      },
      { threshold: 0.3 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateBars = () => {
    const duration = 1500; // Animation duration in ms
    const steps = 60; // Number of animation steps
    const stepDuration = duration / steps;

    // Initialize with zero values
    setAnimatedData(salesData.current.map((item) => ({ ...item, sales: 0 })));

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4); // Easing function

      setAnimatedData(
        salesData.current.map((item) => ({
          ...item,
          sales: Math.round(item.sales * easeOutQuart),
        }))
      );

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedData(salesData.current); // Ensure final values are exact
      }
    }, stepDuration);
  };

  return (
    <div ref={chartRef} className="w-full">
      <Card className="w-full ">
        <CardHeader>
          <CardTitle className="text-white">Sales Performance</CardTitle>
          <CardDescription className="text-gray-400">
            Monthly sales revenue for the past 12 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={animatedData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Sales",
                      ]}
                      labelStyle={{ color: "#00c950" }}
                      contentStyle={{
                        backgroundColor: "#00c950",
                        border: "1px solid #374151",
                        borderRadius: "6px",
                      }}
                    />
                  }
                />
                <Bar
                  dataKey="sales"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  className="transition-all duration-300 hover:opacity-80"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 flex justify-between text-sm text-gray-400">
            <span>
              Total Revenue: $
              {animatedData
                .reduce((sum, item) => sum + item.sales, 0)
                .toLocaleString()}
            </span>
            <span>
              Average: $
              {Math.round(
                animatedData.reduce((sum, item) => sum + item.sales, 0) / 12
              ).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { axiosGlobal } from "@/lib/axios";

export const ReportAPI = {
  getDailySales: (date: string) =>
    axiosGlobal.get("report/daily-sales", { params: { date } }),
  getAnnualSales: (year: number) =>
    axiosGlobal.get("report/annual-sales", { params: { year } }),
  getTopProducts: (limit = 5) =>
    axiosGlobal.get("report/top-products", { params: { limit } }),
  getStockLevels: () => axiosGlobal.get("report/stock-levels"),
};

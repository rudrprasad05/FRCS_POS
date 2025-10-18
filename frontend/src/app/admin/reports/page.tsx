"use client";

import { useEffect, useState } from "react";
import { getSalesReports } from "@/actions/Report";
import { H1, P } from "@/components/font/HeaderFonts";

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      const res = await getSalesReports();
      if (res.success) {
        setReportData(res.data);
      }
      setLoading(false);
    }
    fetchReports();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <H1>Reports</H1>
        <P className="text-muted-foreground">
          View your business performance and sales summaries.
        </P>
      </div>

      {loading ? (
        <p>Loading reports...</p>
      ) : reportData ? (
        <div className="bg-card p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Sales Report Summary</h2>
          <pre className="text-sm bg-muted p-3 rounded-md overflow-x-auto">
            {JSON.stringify(reportData, null, 2)}
          </pre>
        </div>
      ) : (
        <p>No report data available.</p>
      )}
    </div>
  );
}

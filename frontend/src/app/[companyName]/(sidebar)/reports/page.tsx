// pages/Dashboard.tsx

import SalesAndTaxReports from "@/components/company/report/MonthlyReport";
import { HeaderWithBackButton } from "@/components/global/HeaderWithBackButton";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-8">
      <HeaderWithBackButton
        title={"Reports"}
        description={"A detialed outline of your companies earnings"}
      />
      <SalesAndTaxReports />
    </div>
  );
}

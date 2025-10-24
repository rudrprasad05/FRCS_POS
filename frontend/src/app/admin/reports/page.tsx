// pages/Dashboard.tsx

import { HeaderWithBackButton } from "@/components/global/HeaderWithBackButton";
import SalesAndTaxReports from "@/components/superadmin/report/MonthlyReport";

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

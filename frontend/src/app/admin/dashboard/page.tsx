"use client";

import { H1, MutedText, P } from "@/components/font/HeaderFonts";
import { DashboardStats } from "@/components/superadmin-dashboard/DashboardStats";
import SuperAdminSalesGraph from "@/components/superadmin-dashboard/SuperAdminSalesGraph";

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <H1 className="">Dashboard</H1>
        <P className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your site.
        </P>
      </div>

      <DashboardStats />
      <SuperAdminSalesGraph />
    </div>
  );
}

// export default function SuperAdminDashboardPage() {
//   const [data, setData] = useState<SuperAdminDashboardDTO | undefined>();

//   const [isLoading, setIsLoading] = useState(true);

//   const getData = async () => {
//     const res = await GetSuperAdminDashboard();
//     setData(res.data);
//     setIsLoading(false);
//   };
//   useEffect(() => {
//     getData();
//   }, []);

//   if (isLoading) {
//     return <Loader2 className="animate-spin" />;
//   }

//   return (
//     <div className="p-12 space-y-6">
//       <Card className="">
//         <CardHeader>
//           <CardTitle>Users</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-3 text-muted-foreground capitalize text-sm">
//             <div>Username</div>
//             <div>Email</div>
//             <div>Id</div>
//           </div>
//           {data?.users.map((user, i) => (
//             <div className="grid grid-cols-3" key={i}>
//               <div>{user.username}</div>
//               <div>{user.email}</div>
//               <div>{user.id}</div>
//             </div>
//           ))}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Pos Terminals</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-2">
//           {data?.companies.map((company) => (
//             <CollapsibleCard key={company.uuid} company={company} />
//           ))}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// function CollapsibleCard({ company }: { company: Company }) {
//   const [isOpen, setIsOpen] = useState(false);
//   return (
//     <Collapsible>
//       <CollapsibleTrigger
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex justify-between items-center border w-full p-2 rounded-lg text-start"
//       >
//         Company: {company.name}
//         {isOpen && <ChevronLeft className="rotate-90" />}
//         {!isOpen && <ChevronRight className="rotate-90" />}
//       </CollapsibleTrigger>
//       <CollapsibleContent>
//         <div className="w-11/12 mt-2 ml-auto border rounded-lg p-2">
//           {company.posTerminals?.map((pos) => (
//             <div key={pos.uuid} className="flex items-center justify-between">
//               <div>PosTerminal: {pos.name}</div>
//               <Link href={`/company/${company.uuid}/pos/${pos.uuid}`}>
//                 Open
//               </Link>
//             </div>
//           ))}
//         </div>
//       </CollapsibleContent>
//     </Collapsible>
//   );
// }

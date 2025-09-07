"use client";
import { H1, P } from "@/components/font/HeaderFonts";
import { TableSkeleton } from "@/components/global/LoadingContainer";
import PaginationSection from "@/components/global/PaginationSection";
import { User } from "@/types/models";
// import { columns } from "./CompaniesColumns";
// import { DataTable } from "./CompaniesDataTable";
import { GetAllAdmins } from "@/actions/User";
import { DataTable } from "@/components/global/DataTable";
import { Header } from "@/components/global/GenericSortableHeader";
import { createGenericListDataContext } from "@/context/GenericDataTableContext";
import NewUserDialoge from "./NewUserDialoge";
import { columns } from "./UserColumns";
import { buttonVariants } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export const { Provider: UserDataProvider, useGenericData: useUser } =
  createGenericListDataContext<User>();

export default function UsersSection() {
  return (
    <UserDataProvider fetchFn={(query) => GetAllAdmins(query)}>
      <Header<User> useHook={useUser} newButton={<NewUserButton />}>
        <H1>Users</H1>
        <P className="text-muted-foreground">Create and manage users</P>
      </Header>
      <HandleDataSection />
    </UserDataProvider>
  );
}

function NewUserButton() {
  return (
    <NewUserDialoge>
      <div
        className={`${buttonVariants({
          variant: "default",
        })} w-full text-start justify-start px-2 my-2`}
      >
        <UserPlus />
        New User
      </div>
    </NewUserDialoge>
  );
}

// function Header() {
//   return (
//     <div>
//       <div className="space-b-2">
//         <H1 className="">Users</H1>
//         <P className="text-muted-foreground">Create and manage user accounts</P>
//       </div>
//       <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//         <div className="flex items-center gap-4 flex-1">
//           <div className="relative flex-1 max-w-md">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
//             <Input placeholder="Search users..." className="pl-10 " />
//           </div>

//           <Select>
//             <SelectTrigger className="w-32 ">
//               <SelectValue defaultValue={"all"} />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Types</SelectItem>
//               <SelectItem value="cake">Cakes</SelectItem>
//               <SelectItem value="feature">Features</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select>
//             <SelectTrigger className="w-32 ">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="active">Active</SelectItem>
//               <SelectItem value="inactive">Inactive</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <NewUserDialoge />
//       </div>
//     </div>
//   );
// }
function HandleDataSection() {
  const { items, loading, pagination, setPagination } = useUser();

  if (loading) {
    return <TableSkeleton columns={3} rows={8} showHeader />;
  }

  if (!items) {
    return <>Invalid URL</>;
  }

  return (
    <>
      <DataTable columns={columns} data={items} />
      <div className="py-8">
        <PaginationSection
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
    </>
  );
}

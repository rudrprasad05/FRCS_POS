import { ColumnDef } from "@tanstack/react-table";
import { TaxCategory } from "@/types/models";

export const TaxOnlyColumn: ColumnDef<TaxCategory>[] = [
  {
    accessorKey: "name",
    header: "Tax Name",
  },
  {
    accessorKey: "rate",
    header: "Rate (%)",
  },
  {
    accessorKey: "description",
    header: "Description",
  }
];

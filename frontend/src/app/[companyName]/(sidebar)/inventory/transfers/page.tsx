"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StockTransferDTO, Product, Warehouse } from "@/types/models";
import {
  CreateStockTransfer,
  GetStockTransferHistory,
} from "@/actions/Inventory";
import { LoadingContainer } from "@/components/global/LoadingContainer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowRightIcon } from "lucide-react";

const newTransferSchema = z
  .object({
    productId: z.string().min(1, { message: "Product is required" }),
    sourceWarehouseId: z
      .string()
      .min(1, { message: "Source warehouse is required" }),
    destinationWarehouseId: z
      .string()
      .min(1, { message: "Destination warehouse is required" }),
    quantity: z
      .string()
      .min(1, { message: "Quantity is required" })
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Quantity must be a positive number",
      }),
    notes: z.string().optional(),
  })
  .refine((data) => data.sourceWarehouseId !== data.destinationWarehouseId, {
    message: "Source and destination warehouses must be different",
    path: ["destinationWarehouseId"],
  });

export default function StockTransfersPage() {
  const params = useParams();
  const companyId = Number(params.companyId);

  const [loading, setLoading] = useState(true);
  const [transfers, setTransfers] = useState<StockTransferDTO[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isNewTransferDialogOpen, setIsNewTransferDialogOpen] = useState(false);

  const newTransferForm = useForm<z.infer<typeof newTransferSchema>>({
    resolver: zodResolver(newTransferSchema),
    defaultValues: {
      productId: "",
      sourceWarehouseId: "",
      destinationWarehouseId: "",
      quantity: "",
      notes: "",
    },
  });

  useEffect(() => {
    // Fetch warehouses and products for the company
    // This is a placeholder - you would need to implement these API calls
    const fetchWarehousesAndProducts = async () => {
      // Placeholder for fetching warehouses and products
      // setWarehouses(warehousesData);
      // setProducts(productsData);
    };

    fetchWarehousesAndProducts();
  }, [companyId]);

  useEffect(() => {
    const fetchTransfers = async () => {
      setLoading(true);
      try {
        const response = await GetStockTransferHistory(companyId);
        if (response.success && response.data) {
          setTransfers(response.data);
        }
      } catch (error) {
        console.error("Error fetching stock transfers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
  }, [companyId]);

  const onSubmitNewTransfer = async (
    values: z.infer<typeof newTransferSchema>
  ) => {
    try {
      const response = await CreateStockTransfer(
        companyId,
        Number(values.productId),
        Number(values.sourceWarehouseId),
        Number(values.destinationWarehouseId),
        Number(values.quantity),
        values.notes || ""
      );

      if (response.success) {
        // Refresh transfers
        const updatedResponse = await GetStockTransferHistory(companyId);
        if (updatedResponse.success && updatedResponse.data) {
          setTransfers(updatedResponse.data);
        }

        setIsNewTransferDialogOpen(false);
        newTransferForm.reset();
      }
    } catch (error) {
      console.error("Error creating stock transfer:", error);
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Stock Transfers</h1>
        <Button onClick={() => setIsNewTransferDialogOpen(true)}>
          New Transfer
        </Button>
      </div>

      {loading ? (
        <LoadingContainer />
      ) : (
        <div className="space-y-4">
          {transfers.length > 0 ? (
            transfers.map((transfer) => (
              <Card key={transfer.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Transfer #{transfer.id} - {transfer.productName}
                  </CardTitle>
                  <div className="text-xs text-muted-foreground">
                    {/* {formatDate(transfer.transferredOn)} */}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6">
                      <div className="text-sm">
                        <p className="font-semibold">
                          {transfer.sourceWarehouseName}
                        </p>
                        <p className="text-xs text-muted-foreground">Source</p>
                      </div>

                      <div className="flex items-center">
                        <ArrowRightIcon className="h-4 w-4 mx-2" />
                        <div className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm">
                          {transfer.quantity} units
                        </div>
                        <ArrowRightIcon className="h-4 w-4 mx-2" />
                      </div>

                      <div className="text-sm">
                        <p className="font-semibold">
                          {transfer.destinationWarehouseName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Destination
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 text-sm">
                      <p className="text-xs text-muted-foreground">
                        Transferred by
                      </p>
                      <p>{transfer.transferredByUserName}</p>
                    </div>
                  </div>

                  {transfer.notes && (
                    <div className="mt-4 text-sm">
                      <p className="text-xs text-muted-foreground">Notes</p>
                      <p className="mt-1 text-sm">{transfer.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p>No stock transfers found.</p>
            </div>
          )}
        </div>
      )}

      {/* New Transfer Dialog */}
      <Dialog
        open={isNewTransferDialogOpen}
        onOpenChange={setIsNewTransferDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Stock Transfer</DialogTitle>
          </DialogHeader>
          <Form {...newTransferForm}>
            <form
              onSubmit={newTransferForm.handleSubmit(onSubmitNewTransfer)}
              className="space-y-4"
            >
              <FormField
                control={newTransferForm.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem
                            key={product.id}
                            value={product.id.toString()}
                          >
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={newTransferForm.control}
                name="sourceWarehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Warehouse</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source warehouse" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {warehouses.map((warehouse) => (
                          <SelectItem
                            key={warehouse.id}
                            value={warehouse.id.toString()}
                          >
                            {warehouse.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={newTransferForm.control}
                name="destinationWarehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Warehouse</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination warehouse" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {warehouses.map((warehouse) => (
                          <SelectItem
                            key={warehouse.id}
                            value={warehouse.id.toString()}
                          >
                            {warehouse.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={newTransferForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={newTransferForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Add any additional notes here"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewTransferDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Transfer</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

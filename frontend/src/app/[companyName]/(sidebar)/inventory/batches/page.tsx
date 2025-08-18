"use client";

import { useParams, useRouter } from "next/navigation";
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
import { ProductBatchDTO, Product, Warehouse } from "@/types/models";
import {
  GetProductBatchesByWarehouseId,
  CreateProductBatch,
  UpdateProductBatch,
  DeleteProductBatch,
} from "@/actions/Inventory";
import { LoadingContainer } from "@/components/global/LoadingContainer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Pencil, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

const newBatchSchema = z.object({
  productId: z.string().min(1, { message: "Product is required" }),
  warehouseId: z.string().min(1, { message: "Warehouse is required" }),
  quantity: z
    .string()
    .min(1, { message: "Quantity is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Quantity must be a positive number",
    }),
  expiryDate: z.date().optional(),
});

const updateBatchSchema = z.object({
  quantity: z
    .string()
    .min(1, { message: "Quantity is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Quantity must be a non-negative number",
    }),
  expiryDate: z.date().optional(),
});

export default function ProductBatchesPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = Number(params.companyId);

  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<ProductBatchDTO[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [isNewBatchDialogOpen, setIsNewBatchDialogOpen] = useState(false);
  const [isUpdateBatchDialogOpen, setIsUpdateBatchDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<ProductBatchDTO | null>(
    null
  );

  const newBatchForm = useForm<z.infer<typeof newBatchSchema>>({
    resolver: zodResolver(newBatchSchema),
    defaultValues: {
      productId: "",
      warehouseId: "",
      quantity: "",
    },
  });

  const updateBatchForm = useForm<z.infer<typeof updateBatchSchema>>({
    resolver: zodResolver(updateBatchSchema),
    defaultValues: {
      quantity: "",
    },
  });

  const handleWarehouseChange = (value: string) => {
    // setSelectedWarehouse(value);
  };

  const onSubmitNewBatch = async (values: z.infer<typeof newBatchSchema>) => {
    try {
      //   const response = await CreateProductBatch(
      //     companyId,
      //     Number(values.productId),
      //     Number(values.warehouseId),
      //     Number(values.quantity),
      //     values.expiryDate
      //   );
      //   if (response.success) {
      //     // Refresh batches
      //     if (selectedWarehouse === values.warehouseId) {
      //       const updatedResponse = await GetProductBatchesByWarehouseId(Number(values.warehouseId));
      //       if (updatedResponse.success && updatedResponse.data) {
      //         setBatches(updatedResponse.data);
      //       }
      //     } else {
      //       setSelectedWarehouse(values.warehouseId);
      //     }
      //     setIsNewBatchDialogOpen(false);
      //     newBatchForm.reset();
      //   }
    } catch (error) {
      console.error("Error creating product batch:", error);
    }
  };

  const onSubmitUpdateBatch = async (
    values: z.infer<typeof updateBatchSchema>
  ) => {
    // if (!selectedBatch) return;
    // try {
    //   const response = await UpdateProductBatch(
    //     selectedBatch.uuid,
    //     Number(values.quantity),
    //     values.expiryDate
    //   );
    //   if (response.success) {
    //     // Refresh batches
    //     const updatedResponse = await GetProductBatchesByWarehouseId(selectedBatch.warehouseId);
    //     if (updatedResponse.success && updatedResponse.data) {
    //       setBatches(updatedResponse.data);
    //     }
    //     setIsUpdateBatchDialogOpen(false);
    //     setSelectedBatch(null);
    //     updateBatchForm.reset();
    //   }
    // } catch (error) {
    //   console.error("Error updating product batch:", error);
    // }
  };

  const handleDeleteBatch = async (uuid: string) => {
    // if (!confirm("Are you sure you want to delete this batch?")) return;
    // try {
    //   const response = await DeleteProductBatch(uuid);
    //   if (response.success) {
    //     // Refresh batches
    //     const updatedBatches = batches.filter(batch => batch.uuid !== uuid);
    //     setBatches(updatedBatches);
    //   }
    // } catch (error) {
    //   console.error("Error deleting product batch:", error);
    // }
  };

  const handleEditBatch = (batch: ProductBatchDTO) => {
    // setSelectedBatch(batch);
    // updateBatchForm.setValue("quantity", batch.quantity.toString());
    // if (batch.expiryDate) {
    //   updateBatchForm.setValue("expiryDate", new Date(batch.expiryDate));
    // }
    // setIsUpdateBatchDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Batches</h1>
        <Button onClick={() => setIsNewBatchDialogOpen(true)}>
          Add New Batch
        </Button>
      </div>

      <div className="mb-6">
        <Select value={selectedWarehouse} onValueChange={handleWarehouseChange}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select a warehouse" />
          </SelectTrigger>
          <SelectContent>
            {warehouses.map((warehouse) => (
              <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                {warehouse.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <LoadingContainer />
      ) : (
        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        //   {batches.length > 0 ? (
        //     batches.map((batch) => (
        //       <Card key={batch.uuid}>
        //         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        //           <CardTitle className="text-sm font-medium">
        //             {batch.productName}
        //           </CardTitle>
        //           <div className="flex space-x-2">
        //             <Button variant="ghost" size="icon" onClick={() => handleEditBatch(batch)}>
        //               <Pencil className="h-4 w-4" />
        //             </Button>
        //             <Button variant="ghost" size="icon" onClick={() => handleDeleteBatch(batch.uuid)}>
        //               <Trash className="h-4 w-4" />
        //             </Button>
        //           </div>
        //         </CardHeader>
        //         <CardContent>
        //           <div className="text-xs text-muted-foreground">
        //             <p>SKU: {batch.productSku}</p>
        //             <p>Quantity: {batch.quantity}</p>
        //             {batch.expiryDate && (
        //               <p>Expires: {new Date(batch.expiryDate).toLocaleDateString()}</p>
        //             )}
        //             <p>Created: {new Date(batch.createdOn).toLocaleDateString()}</p>
        //           </div>
        //         </CardContent>
        //       </Card>
        //     ))
        //   ) : (
        //     <div className="col-span-full text-center py-10">
        //       <p>No product batches found for the selected warehouse.</p>
        //     </div>
        //   )}
        // </div>
        <></>
      )}

      {/* New Batch Dialog */}
      <Dialog
        open={isNewBatchDialogOpen}
        onOpenChange={setIsNewBatchDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product Batch</DialogTitle>
          </DialogHeader>
          <Form {...newBatchForm}>
            <form
              onSubmit={newBatchForm.handleSubmit(onSubmitNewBatch)}
              className="space-y-4"
            >
              <FormField
                control={newBatchForm.control}
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
                control={newBatchForm.control}
                name="warehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warehouse</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a warehouse" />
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
                control={newBatchForm.control}
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
                control={newBatchForm.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiry Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewBatchDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Batch</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Update Batch Dialog */}
      <Dialog
        open={isUpdateBatchDialogOpen}
        onOpenChange={setIsUpdateBatchDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Product Batch</DialogTitle>
          </DialogHeader>
          <Form {...updateBatchForm}>
            <form
              onSubmit={updateBatchForm.handleSubmit(onSubmitUpdateBatch)}
              className="space-y-4"
            >
              <FormField
                control={updateBatchForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateBatchForm.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiry Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUpdateBatchDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Batch</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

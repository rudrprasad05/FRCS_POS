"use client";
import { LargeText, MutedText } from "@/components/font/HeaderFonts";
import { HeaderWithBackButton } from "@/components/global/HeaderWithBackButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Product, ProductVariant } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, PenBox } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const customExpiryDays = [1, 2, 3, 5, 7, 10];
const customExpiryHours = [6, 12, 24, 48, 72];

const productVariantSchema = z.object({
  uuid: z.uuid(),
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().min(1, "Variant SKU is required"),
  barcode: z.string(),
  price: z.number().min(0, "Price must be >= 0"),
  mediaFile: z.any().optional(),
});

export const productSchema = z
  .object({
    firstWarningInDays: z.number().optional(),
    criticalWarningInHours: z.number().optional(),
    name: z
      .string()
      .min(1, "Product name is required")
      .max(100, "Name must be less than 100 characters"),
    sku: z
      .string()
      .min(1, "SKU is required")
      .max(50, "SKU must be less than 50 characters"),
    taxCategoryId: z.uuid("select a tax"),
    supplierId: z.uuid("select a supplier"),
    isPerishable: z.boolean(),
    variants: z.array(productVariantSchema),
  })
  .refine(
    (data) => {
      if (!data.isPerishable) return true;
      if (
        data.firstWarningInDays == null ||
        data.criticalWarningInHours == null
      )
        return false;
      return (
        Number(data.criticalWarningInHours) <
        Number(data.firstWarningInDays) * 24
      );
    },
    {
      message:
        "Critical warning (hours) must be less than first warning (days x 24)",
      path: ["criticalWarningInHours"],
    }
  );

export type ProductFormData = z.infer<typeof productSchema>;

interface IProductEditorPage {
  product: Product;
}

export default function ViewProductContainer({ product }: IProductEditorPage) {
  const params = useParams();
  const companyName = params.companyName;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      sku: product.sku,
      taxCategoryId: product.taxCategory?.uuid,
      supplierId: product.supplier?.uuid,
      isPerishable: product.isPerishable,
      criticalWarningInHours: 24,
      firstWarningInDays: 3,
      variants: product.variants,
    },
  });

  return (
    <div className="grow">
      <div className="mb-8 flex pr-4 justify-between items-start">
        <HeaderWithBackButton
          title={"View Product"}
          description={`You are veiwing the product "${form.getValues(
            "name"
          )}"`}
          link={`/${companyName}/products`}
        />
        <Button asChild>
          <Link href={`edit`}>
            <PenBox />
            Edit Product
          </Link>
        </Button>
      </div>
      <Form {...form}>
        <form className="space-y-6 grow flex flex-col px-4">
          <Step1 product={product} />
          <Step2 product={product} />
          <Step3 product={product} />
          <Step4 product={product} />

          <Separator className="my-4 mt-auto" />
        </form>
      </Form>
    </div>
  );
}

function Step1({ product }: { product: Product }) {
  const params = useParams();
  const companyName = params.companyName;
  return (
    <div className="flex flex-col gap-2">
      <LargeText>Supplier Information</LargeText>

      <Input
        disabled
        id={`supplier`}
        placeholder="variant name"
        value={product.supplier?.name}
      />
    </div>
  );
}

function Step2({ product }: { product: Product }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <LargeText>Product Information</LargeText>
        <MutedText>Basic product info</MutedText>
      </div>

      <Label htmlFor={`product name`}>Product Name</Label>
      <Input
        disabled
        id={`product name`}
        placeholder="product name"
        value={product.name}
      />
      <Label htmlFor={`product name`}>Product SKU</Label>

      <Input
        disabled
        id={`product name`}
        placeholder="product sku"
        value={product.sku}
      />
      <Label htmlFor={`product name`}>Product Tax</Label>

      <Input
        disabled
        value={product.taxCategory?.name}
        placeholder="Enter tax name"
      />
    </div>
  );
}

function Step3({ product }: { product: Product }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <LargeText>Expiry Information</LargeText>
        <MutedText>set warning times or set it as non-perishable</MutedText>
      </div>

      <Label htmlFor={`product name`}>Is Perishable</Label>
      <Checkbox
        disabled
        id={`product isPerishable`}
        checked={product.isPerishable}
      />

      {product.isPerishable && (
        <div>
          <Label htmlFor={`firstWarningInDays`}>First Warning In Days</Label>
          <Input
            disabled
            id={`firstWarningInDays`}
            value={String(product.firstWarningInDays)}
          />

          <Label htmlFor={`criticalWarningInHours`}>
            Critical Warning In Hours
          </Label>
          <Input
            disabled
            id={`criticalWarningInHours`}
            value={String(product.criticalWarningInHours)}
          />
        </div>
      )}
    </div>
  );
}

function Step4({ product }: { product: Product }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex justify-between">
        <div>
          <LargeText>Variant Information</LargeText>
          <MutedText>Create and manage variants</MutedText>
        </div>
      </div>

      {product.variants.map((field, index) => (
        <VariantCard key={index} variant={field} />
      ))}
    </div>
  );
}

function AddMediaDialoge({ variant }: { variant: ProductVariant }) {
  const existingMedia = variant.media;

  return (
    <div className="w-14 h-14 aspect-square grid grid-cols-1 place-items-center outline outline-border rounded-lg">
      {!existingMedia?.url && <ImageIcon className="h-4 w-4" />}
      {existingMedia?.url && (
        <Image
          className="w-full h-full object-cover rounded-lg"
          alt="image"
          src={existingMedia?.url}
          height={50}
          width={50}
        />
      )}
    </div>
  );
}

type VariantCardProps = {
  variant: ProductVariant;
};

function VariantCard({ variant }: VariantCardProps) {
  return (
    <div className="relative border border-solid rounded-lg p-6 flex gap-4 items-start">
      {/* Example: media dialog still external */}
      <AddMediaDialoge variant={variant} />

      <div className="grid grid-cols-2 grow gap-4">
        <div className="flex flex-col gap-2">
          <Label>Variant Name</Label>

          <Input disabled placeholder="variant name" value={variant.name} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={variant.sku}>Variant SKU</Label>

          <Input disabled placeholder="variant sku" value={variant.sku} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={variant.barcode}>Barcode</Label>

          <Input
            disabled
            id={variant.barcode}
            placeholder="variant sku"
            value={variant.barcode}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={"price"}>Price</Label>

          <Input
            disabled
            id={`price`}
            type="number"
            step="0.01"
            placeholder="Price"
            value={variant.price}
          />
        </div>
      </div>
    </div>
  );
}

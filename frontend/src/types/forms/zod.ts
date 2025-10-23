import z from "zod";

export const SignInForm = z.object({
  email: z.email(),
  password: z
    .string()
    .min(2, { message: "Should have more than 2 characters" })
    .max(50, { message: "Should have less than 50 characters" }),
});
export const EmailReceipt = z.object({
  email: z.email(),
});

export const RegisterForm = z.object({
  username: z
    .string()
    .min(2, { message: "Should have more than 2 characters" })
    .max(50, { message: "Should have less than 50 characters" }),
  email: z
    .string()
    .email()
    .min(2, { message: "Should have more than 2 characters" })
    .max(50, { message: "Should have less than 50 characters" }),
  password: z
    .string()
    .min(2, { message: "Should have more than 2 characters" })
    .max(50, { message: "Should have less than 50 characters" }),
});

export const NewMediaFormSchema = z.object({
  altText: z.string().min(1, "Alt text is required"),
  fileName: z.string().min(1, "File name is required"),
  file: z
    .custom<File>((val) => val instanceof File, "A file is required")
    .refine((file) => file.size > 0, "File cannot be empty"),
});

export const NewSocialLinkForm = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
  url: z.string().url("Url needs to be correct"),
  isActive: z.boolean().default(true).optional(),
});

export const NewBatchDataSchema = z.object({
  companyName: z.string({ error: "no company selected" }),
  supplierId: z.uuid({ error: "no supplier selected" }),
  productId: z.uuid({ error: "no product selected" }),
  warehouseId: z.string({ error: "Warehouse is required" }),
  quantity: z.number({ error: "Quantity is required" }).int().nonnegative(),
  expiryDate: z
    .date({ error: "Expiry date is required" })
    .optional()
    .nullable(),
  receiveDate: z
    .date({ error: "Expiry date is required" })
    .optional()
    .nullable(),
});

export const ResetPasswordSchema = z
  .object({
    code: z.string().min(1),
    userId: z.string().min(1),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be less than 50 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be less than 50 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const productVariantSchema = z.object({
  uuid: z.uuid(),
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().min(1, "Variant SKU is required"),
  barcode: z.string().min(1, "Variant barcode is required"),
  price: z.number().min(1, "Price must be >= 0"),
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

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
export type EmailReceiptSchemaType = z.infer<typeof EmailReceipt>;
export type NewBatchData = z.output<typeof NewBatchDataSchema>;
export type NewMediaFormType = z.infer<typeof NewMediaFormSchema>;
export type SignInFormType = z.infer<typeof SignInForm>;
export type RegisterFormType = z.infer<typeof RegisterForm>;
export type NewSocialLinkType = z.infer<typeof NewSocialLinkForm>;

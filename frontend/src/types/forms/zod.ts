import z from "zod";

export const SignInForm = z.object({
  email: z.email(),
  password: z
    .string()
    .min(2, { message: "Should have more than 2 characters" })
    .max(50, { message: "Should have less than 50 characters" }),
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

export type NewBatchData = z.output<typeof NewBatchDataSchema>;
export type NewMediaFormType = z.infer<typeof NewMediaFormSchema>;
export type SignInFormType = z.infer<typeof SignInForm>;
export type RegisterFormType = z.infer<typeof RegisterForm>;
export type NewSocialLinkType = z.infer<typeof NewSocialLinkForm>;

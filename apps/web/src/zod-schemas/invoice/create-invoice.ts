import { z } from "zod";

export const valueType = z.enum(["percentage", "fixed"], {
  errorMap: () => ({
    message: "Value type must be either 'percentage' or 'fixed'",
  }),
});

export const createInvoiceItemCategorySchema = z.object({
  id: z.string().optional(), // For editing existing categories
  name: z
    .string({ invalid_type_error: "Category name must be a string" })
    .min(1, { message: "Category name cannot be empty" })
    .max(100, { message: "Category name must be less than 100 characters" }),
  description: z.string({
    invalid_type_error: "Category description must be a string",
  }).max(500, { message: "Category description must be less than 500 characters" }).optional(),
});

export const createInvoiceItemSchema = z.object(
  {
    id: z.string().optional(), // For editing existing items
    name: z
      .string({ invalid_type_error: "Item name must be a string" })
      .min(1, { message: "Item name cannot be empty" }),
    description: z.string({
      invalid_type_error: "Item description must be a string",
    }),
    quantity: z.coerce
      .number({ invalid_type_error: "Quantity must be a number" })
      .positive({ message: "Quantity must be positive" }),
    unitPrice: z.coerce
      .number({ invalid_type_error: "Unit price must be a number" })
      .positive({ message: "Unit price must be positive" }),
    categoryId: z.string().optional(), // Reference to category
    isVatExempt: z.boolean({ invalid_type_error: "VAT exempt must be a boolean" }).default(false),
    vatRate: z.coerce
      .number({ invalid_type_error: "VAT rate must be a number" })
      .min(0, { message: "VAT rate cannot be negative" })
      .max(100, { message: "VAT rate cannot exceed 100%" })
      .optional(),
  },
  { invalid_type_error: "Item must be an object" },
);

export const createInvoiceFieldKeyStringValuesSchema = z.object(
  {
    label: z.string({ invalid_type_error: "Label must be a string" }).min(1, {
      message: "Label cannot be empty",
    }),
    value: z.string({ invalid_type_error: "Value must be a string" }).min(1, {
      message: "Value cannot be empty",
    }),
  },
  { invalid_type_error: "Field key string values must be an object" },
);

export const createInvoiceFieldKeyNumberValuesSchema = z.object(
  {
    label: z.string({ invalid_type_error: "Label must be a string" }).min(1, {
      message: "Label cannot be empty",
    }),
    value: z.number({ invalid_type_error: "Value must be a number" }),
    type: valueType,
  },
  { invalid_type_error: "Field key number values must be an object" },
);

export const createInvoiceSchema = z.object({
  companyDetails: z.object(
    {
      logoBase64: z.string({ invalid_type_error: "Logo base64 must be a string" }).optional(),
      logo: z
        .string({ invalid_type_error: "Logo must be a string" })
        .refine(
          (val) =>
            !val ||
            val.startsWith("data:image") ||
            val.startsWith("blob:") ||
            val.startsWith("https://") ||
            val.startsWith("http://"),
          {
            message: "Logo must be a valid image URL, blob URL or data URL",
          },
        )
        .nullable()
        .optional(),
      signatureBase64: z.string({ invalid_type_error: "Signature base64 must be a string" }).optional(),
      signature: z
        .string({ invalid_type_error: "Signature must be a string" })
        .refine(
          (val) =>
            !val ||
            val.startsWith("data:image") ||
            val.startsWith("blob:") ||
            val.startsWith("https://") ||
            val.startsWith("http://"),
          {
            message: "Signature must be a valid image URL, blob URL or data URL",
          },
        )
        .nullable()
        .optional(),
      name: z.string({ invalid_type_error: "Company name must be a string" }).min(1, {
        message: "Company name cannot be empty",
      }),
      address: z.string({ invalid_type_error: "Address must be a string" }),
      legalForm: z.string({ invalid_type_error: "Legal form must be a string" }).optional(),
      siret: z.string({ invalid_type_error: "SIRET must be a string" }).optional(),
      rcs: z.string({ invalid_type_error: "RCS must be a string" }).optional(),
      metadata: z.array(createInvoiceFieldKeyStringValuesSchema),
    },
    { invalid_type_error: "Company details must be an object" },
  ),
  clientDetails: z.object(
    {
      name: z
        .string({ invalid_type_error: "Client name must be a string" })
        .min(1, { message: "Client name cannot be empty" }),
      address: z.string({ invalid_type_error: "Address must be a string" }),
      siret: z.string({ invalid_type_error: "SIRET must be a string" }).optional(),
      tva: z.string({ invalid_type_error: "TVA must be a string" }).optional(),
      metadata: z.array(createInvoiceFieldKeyStringValuesSchema),
    },
    { invalid_type_error: "Client details must be an object" },
  ),
  invoiceDetails: z.object(
    {
      theme: z.object({
        baseColor: z.string({ invalid_type_error: "Base color must be a string" }).min(1, {
          message: "Base color cannot be empty",
        }),
        mode: z.enum(["dark", "light"], { invalid_type_error: "Mode must be either 'dark' or 'light'" }),
        template: z
          .enum(["default", "vercel"], {
            invalid_type_error: "Template must be either 'default' or 'vercel'",
          })
          .default("default")
          .optional(),
      }),
      currency: z
        .string({ invalid_type_error: "Currency must be a string" })
        .min(1, { message: "Currency cannot be empty" }),
      prefix: z.string({ invalid_type_error: "Prefix must be a string" }),
      serialNumber: z
        .string({ invalid_type_error: "Serial number must be a string" })
        .min(1, { message: "Serial number cannot be empty" }),
      date: z.date({ invalid_type_error: "Date must be a valid date" }),
      dueDate: z.date({ invalid_type_error: "Due date must be a valid date" }).optional().nullable(),
      paymentTerms: z.string({
        invalid_type_error: "Payment terms must be a string",
      }),
      vatRate: z.number({ invalid_type_error: "VAT rate must be a number" }).min(0).max(100).default(20),
      isVatExempt: z.boolean({ invalid_type_error: "VAT exempt must be a boolean" }).default(false),
      billingDetails: z.array(createInvoiceFieldKeyNumberValuesSchema),
    },
    { invalid_type_error: "Invoice details must be an object" },
  ),
  itemCategories: z.array(createInvoiceItemCategorySchema),
  items: z.array(createInvoiceItemSchema),
  metadata: z.object(
    {
      notes: z.string({ invalid_type_error: "Notes must be a string" }),
      terms: z.string({ invalid_type_error: "Terms must be a string" }),
      paymentInformation: z.array(createInvoiceFieldKeyStringValuesSchema),
    },
    { invalid_type_error: "Metadata must be an object" },
  ),
});

export type ZodCreateInvoiceSchema = z.infer<typeof createInvoiceSchema>;

export const createInvoiceSchemaDefaultValues: ZodCreateInvoiceSchema = {
  companyDetails: {
    name: "SUZALI CONSEIL",
    address: "10 rue de la Paix, 75002 Paris",
    legalForm: "SASU",
    siret: "992 281 097 00012",
    rcs: "R.C.S Paris",
    metadata: [],
  },
  clientDetails: {
    name: "Client Exemple",
    address: "123 Avenue des Champs-Élysées, 75008 Paris",
    siret: "",
    tva: "",
    metadata: [],
  },
  invoiceDetails: {
    theme: {
      template: "default",
      baseColor: "#005e56",
      mode: "light",
    },
    currency: "EUR",
    prefix: "Facture F-",
    serialNumber: "0001",
    date: new Date(), // now
    paymentTerms: "Paiement à 30 jours fin de mois",
    vatRate: 20,
    isVatExempt: false,
    billingDetails: [],
  },
  itemCategories: [],
  items: [
    {
      name: "Article exemple",
      description: "Description de l'article exemple",
      quantity: 1,
      unitPrice: 100,
      isVatExempt: false,
      vatRate: 20
    }
  ],
  metadata: {
    notes: "",
    terms: "",
    paymentInformation: [

      {
        label: "IBAN",
        value: "FR7616958000017330073781223"
      },
      {
        label: "BIC",
        value: "QNTOFRP1XXX"
      },
      {
        label: "Titulaire",
        value: "Mr. Hichem Issam Hammouche"
      }
    ],
  },
};

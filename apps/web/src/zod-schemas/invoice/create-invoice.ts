import { z } from "zod";

export const valueType = z.enum(["percentage", "fixed"], {
  errorMap: () => ({
    message: "Value type must be either 'percentage' or 'fixed'",
  }),
});

export const createInvoiceItemSchema = z.object(
  {
    name: z
      .string({ invalid_type_error: "Item name must be a string" })
      .min(1, { message: "Item name cannot be empty" }),
    description: z.string({
      invalid_type_error: "Item description must be a string",
    }),
    quantity: z
      .number({ invalid_type_error: "Quantity must be a number" })
      .positive({ message: "Quantity must be positive" }),
    unitPrice: z
      .number({ invalid_type_error: "Unit price must be a number" })
      .positive({ message: "Unit price must be positive" }),
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
      logo: z
        .string({ invalid_type_error: "Logo must be a string" })
        .url({ message: "Logo must be a valid URL" })
        .optional(),
      signature: z
        .string({ invalid_type_error: "Signature must be a string" })
        .url({ message: "Signature must be a valid URL" })
        .optional(),
      name: z.string({ invalid_type_error: "Company name must be a string" }).min(1, {
        message: "Company name cannot be empty",
      }),
      address: z.object(
        {
          label: z
            .string({ invalid_type_error: "Address label must be a string" })
            .min(1, { message: "Address label cannot be empty" }),
          value: z.string({
            invalid_type_error: "Address value must be a string",
          }),
        },
        { invalid_type_error: "Company address must be an object" },
      ),
      metadata: z.array(createInvoiceFieldKeyStringValuesSchema),
    },
    { invalid_type_error: "Company details must be an object" },
  ),
  clientDetails: z.object(
    {
      name: z
        .string({ invalid_type_error: "Client name must be a string" })
        .min(1, { message: "Client name cannot be empty" }),
      address: z.object(
        {
          label: z
            .string({ invalid_type_error: "Address label must be a string" })
            .min(1, { message: "Address label cannot be empty" }),
          value: z.string({
            invalid_type_error: "Address value must be a string",
          }),
        },
        { invalid_type_error: "Client address must be an object" },
      ),
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
      }),
      currency: z
        .string({ invalid_type_error: "Currency must be a string" })
        .min(1, { message: "Currency cannot be empty" }),
      prefix: z.string({ invalid_type_error: "Prefix must be a string" }),
      serialNumber: z
        .string({ invalid_type_error: "Serial number must be a string" })
        .min(1, { message: "Serial number cannot be empty" }),
      shipTo: z.object(
        {
          label: z
            .string({ invalid_type_error: "Ship to label must be a string" })
            .min(1, { message: "Ship to label cannot be empty" }),
          value: z.string({
            invalid_type_error: "Ship to value must be a string",
          }),
        },
        { invalid_type_error: "Ship to must be an object" },
      ),
      date: z.date({ invalid_type_error: "Date must be a valid date" }),
      dueDate: z.date({ invalid_type_error: "Due date must be a valid date" }),
      paymentTerms: z.string({
        invalid_type_error: "Payment terms must be a string",
      }),
      billingDetails: z.array(createInvoiceFieldKeyNumberValuesSchema),
    },
    { invalid_type_error: "Invoice details must be an object" },
  ),
  items: z.array(createInvoiceItemSchema),
  metadata: z.object(
    {
      notes: z.object(
        {
          label: z
            .string({ invalid_type_error: "Notes label must be a string" })
            .min(1, { message: "Notes label cannot be empty" }),
          value: z.string({
            invalid_type_error: "Notes value must be a string",
          }),
        },
        { invalid_type_error: "Notes must be an object" },
      ),
      terms: z.object(
        {
          label: z
            .string({ invalid_type_error: "Terms label must be a string" })
            .min(1, { message: "Terms label cannot be empty" }),
          value: z.string({
            invalid_type_error: "Terms value must be a string",
          }),
        },
        { invalid_type_error: "Terms must be an object" },
      ),
      paymentInformation: z.array(createInvoiceFieldKeyStringValuesSchema),
    },
    { invalid_type_error: "Metadata must be an object" },
  ),
});

export type ZodCreateInvoiceSchema = z.infer<typeof createInvoiceSchema>;

export const createInvoiceSchemaDefaultValues: ZodCreateInvoiceSchema = {
  companyDetails: {
    name: "Invoicely Ltd",
    address: {
      label: "address",
      value: "123 Main St, Anytown, USA",
    },
    metadata: [],
  },
  clientDetails: {
    name: "John Doe",
    address: {
      label: "address",
      value: "456 Second St, Anytown, USA",
    },
    metadata: [],
  },
  invoiceDetails: {
    theme: {
      baseColor: "#635CFF",
    },
    currency: "USD",
    prefix: "INV-",
    serialNumber: "0001",
    shipTo: {
      label: "ship to",
      value: "456 Second St, Anytown, USA",
    },
    date: new Date(), // now
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
    paymentTerms: "",
    billingDetails: [],
  },
  items: [],
  metadata: {
    notes: {
      label: "notes",
      value: "",
    },
    terms: {
      label: "terms",
      value: "",
    },
    paymentInformation: [],
  },
};

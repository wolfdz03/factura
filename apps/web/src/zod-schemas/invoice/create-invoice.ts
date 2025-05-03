import { z } from "zod";

export const valueType = z.enum(["percentage", "fixed"], {
  errorMap: () => ({
    message: "Value type must be either 'percentage' or 'fixed'",
  }),
});

export const createInvoiceSchema = z.object({
  companyDetails: z.object(
    {
      logo: z.string({ invalid_type_error: "Logo must be a string" }).url({ message: "Logo must be a valid URL" }),
      signature: z
        .string({ invalid_type_error: "Signature must be a string" })
        .url({ message: "Signature must be a valid URL" }),
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
    },
    { invalid_type_error: "Client details must be an object" },
  ),
  invoiceDetails: z.object(
    {
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
      discount: z.object(
        {
          label: z
            .string({ invalid_type_error: "Discount label must be a string" })
            .min(1, { message: "Discount label cannot be empty" }),
          value: z
            .number({ invalid_type_error: "Discount value must be a number" })
            .min(0, { message: "Discount value must be positive" }),
          type: valueType,
        },
        { invalid_type_error: "Discount must be an object" },
      ),
      tax: z.object(
        {
          label: z
            .string({ invalid_type_error: "Tax label must be a string" })
            .min(1, { message: "Tax label cannot be empty" }),
          value: z
            .number({ invalid_type_error: "Tax value must be a number" })
            .min(0, { message: "Tax value must be positive" }),
          type: valueType,
        },
        { invalid_type_error: "Tax must be an object" },
      ),
      shipping: z.object(
        {
          label: z
            .string({ invalid_type_error: "Shipping label must be a string" })
            .min(1, { message: "Shipping label cannot be empty" }),
          value: z
            .number({ invalid_type_error: "Shipping value must be a number" })
            .min(0, { message: "Shipping value must be positive" }),
          type: valueType,
        },
        { invalid_type_error: "Shipping must be an object" },
      ),
      amountPaid: z.object(
        {
          label: z
            .string({
              invalid_type_error: "Amount paid label must be a string",
            })
            .min(1, { message: "Amount paid label cannot be empty" }),
          value: z
            .number({
              invalid_type_error: "Amount paid value must be a number",
            })
            .min(0, { message: "Amount paid value must be positive" }),
        },
        { invalid_type_error: "Amount paid must be an object" },
      ),
    },
    { invalid_type_error: "Invoice details must be an object" },
  ),
  items: z
    .array(
      z.object(
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
      ),
    )
    .min(1, { message: "At least one item is required" }),
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
    },
    { invalid_type_error: "Metadata must be an object" },
  ),
});

export type ZodCreateInvoiceSchema = z.infer<typeof createInvoiceSchema>;

export const createInvoiceSchemaDefaultValues: ZodCreateInvoiceSchema = {
  companyDetails: {
    name: "",
    logo: "",
    signature: "",
    address: {
      label: "address",
      value: "",
    },
  },
  clientDetails: {
    name: "",
    address: {
      label: "address",
      value: "",
    },
  },
  invoiceDetails: {
    currency: "USD",
    prefix: "INV-",
    serialNumber: "",
    shipTo: {
      label: "ship to",
      value: "",
    },
    date: new Date(), // now
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
    paymentTerms: "",
    discount: {
      label: "discount",
      value: 0,
      type: "fixed",
    },
    tax: {
      label: "tax",
      value: 0,
      type: "fixed",
    },
    shipping: {
      label: "shipping",
      value: 0,
      type: "fixed",
    },
    amountPaid: {
      label: "amount paid",
      value: 0,
    },
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
  },
};

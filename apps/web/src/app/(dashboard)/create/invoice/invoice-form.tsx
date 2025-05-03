"use client";

import {
  Accordion,
  AccordionContent,
  AccordionContentProps,
  AccordionItem,
  AccordionTrigger,
  AccordionTriggerProps,
} from "@/components/ui/accordion";
import { ZodCreateInvoiceSchema, createInvoiceSchemaDefaultValues } from "@/zod-schemas/invoice/create-invoice";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { FormInput } from "@/components/ui/form/form-input";
import { Form } from "@/components/ui/form/form";
import { Button } from "@/components/ui/button";

import { FormImageInput } from "@/components/ui/form/form-image-input";
import { FormTextarea } from "@/components/ui/form/form-textarea";
import FormRow from "@/components/ui/form/form-row";
import { Trash, Plus } from "lucide-react";
import React from "react";

interface InvoiceFormProps {
  form: UseFormReturn<ZodCreateInvoiceSchema>;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ form }) => {
  const onSubmit = (data: ZodCreateInvoiceSchema) => {
    console.log("SubmittedFormValues", data);
  };

  console.log("FormValues", form.getValues());

  return (
    <div className="scroll-bar-hidden flex h-full flex-col overflow-y-scroll">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, console.error)} className="space-y-8">
          <Accordion type="single" collapsible defaultValue="company-details" className="w-full divide-y border-b">
            {/* Company Details */}
            <AccordionItem value="company-details">
              <InvoiceAccordionTrigger>Company Details</InvoiceAccordionTrigger>
              <InvoiceAccordionContent>
                <div className="flex w-full flex-row gap-4">
                  <FormImageInput label="Company Logo" name="companyDetails.logo" reactform={form} />
                  <FormImageInput label="Company Signature" name="companyDetails.signature" reactform={form} />
                </div>
                <FormInput
                  name="companyDetails.name"
                  label="Company Name"
                  reactform={form}
                  placeholder="John Doe ltd."
                  description="Name of your company"
                />
                <FormTextarea
                  className="h-20"
                  name="companyDetails.address.value"
                  label="Company Address"
                  reactform={form}
                  placeholder="123 Business St, City, Country"
                />
              </InvoiceAccordionContent>
            </AccordionItem>
            {/* Client Details */}
            <AccordionItem value="client-details">
              <InvoiceAccordionTrigger>Client Details</InvoiceAccordionTrigger>
              <InvoiceAccordionContent>
                <FormInput name="clientDetails.name" label="Client Name" reactform={form} placeholder="John Doe" />
                <FormTextarea
                  className="h-20"
                  name="clientDetails.address.value"
                  label="Client Address"
                  reactform={form}
                  placeholder="456 Client St, City, Country"
                />
              </InvoiceAccordionContent>
            </AccordionItem>
            {/* Invoice Details */}
            <AccordionItem value="invoice-details">
              <InvoiceAccordionTrigger>Invoice Details</InvoiceAccordionTrigger>
              <InvoiceAccordionContent>
                <FormInput
                  name="invoiceDetails.currency"
                  label="Currency"
                  reactform={form}
                  placeholder="USD"
                  description="Currency code for the invoice"
                  defaultValue={createInvoiceSchemaDefaultValues.invoiceDetails.currency}
                />
                <FormRow>
                  <FormInput
                    name="invoiceDetails.prefix"
                    label="Invoice Prefix"
                    reactform={form}
                    placeholder="INV-"
                    description="Prefix for invoice number"
                    isOptional={true}
                  />
                  <FormInput
                    name="invoiceDetails.serialNumber"
                    label="Serial Number"
                    reactform={form}
                    placeholder="0001"
                    description="Invoice serial number"
                  />
                </FormRow>
                <FormTextarea
                  name="invoiceDetails.shipTo.value"
                  label={createInvoiceSchemaDefaultValues.invoiceDetails.shipTo.label}
                  reactform={form}
                  placeholder="789 Shipping St, City, Country"
                  description="If invoice includes shipping, add shipping address or email address."
                />
                <FormRow>
                  <FormInput
                    name="invoiceDetails.date"
                    label="Invoice Date"
                    reactform={form}
                    type="date"
                    description="Date when invoice is issued"
                  />
                  <FormInput
                    name="invoiceDetails.dueDate"
                    label="Due Date"
                    reactform={form}
                    type="date"
                    description="Date when payment is due"
                  />
                </FormRow>
                <FormInput
                  name="invoiceDetails.paymentTerms"
                  label="Payment Terms"
                  reactform={form}
                  placeholder="50% of total amount upfront"
                  description="Terms of payment"
                  isOptional={true}
                />
                {/* Discount */}
                <FormRow>
                  <FormInput
                    name="invoiceDetails.discount.type"
                    label={createInvoiceSchemaDefaultValues.invoiceDetails.discount.label}
                    reactform={form}
                    placeholder="fixed"
                    description="Type of discount (fixed or percentage)"
                  />
                  <FormInput
                    name="invoiceDetails.discount.value"
                    label="Discount Value"
                    reactform={form}
                    type="number"
                    placeholder="0"
                    description="Amount of discount"
                  />
                </FormRow>
                {/* Tax */}
                <FormRow>
                  <FormInput
                    name="invoiceDetails.tax.type"
                    label={createInvoiceSchemaDefaultValues.invoiceDetails.tax.label}
                    reactform={form}
                    placeholder="fixed"
                    description="Type of tax (fixed or percentage)"
                  />
                  <FormInput
                    name="invoiceDetails.tax.value"
                    label="Tax Value"
                    reactform={form}
                    type="number"
                    placeholder="0"
                    description="Amount of tax"
                  />
                </FormRow>
                {/* Shipping */}
                <FormRow>
                  <FormInput
                    name="invoiceDetails.shipping.type"
                    label={createInvoiceSchemaDefaultValues.invoiceDetails.shipping.label}
                    reactform={form}
                    placeholder="fixed"
                    description="Type of shipping (fixed or percentage)"
                  />
                  <FormInput
                    name="invoiceDetails.shipping.value"
                    label={createInvoiceSchemaDefaultValues.invoiceDetails.shipping.label}
                    reactform={form}
                    type="number"
                    placeholder="0"
                    description="Amount of shipping"
                  />
                </FormRow>
                {/* Amount Paid */}
                <FormRow>
                  <FormInput
                    name="invoiceDetails.amountPaid.value"
                    label={createInvoiceSchemaDefaultValues.invoiceDetails.amountPaid.label}
                    reactform={form}
                    type="number"
                    placeholder="0"
                    description="Amount already paid by client"
                  />
                </FormRow>
              </InvoiceAccordionContent>
            </AccordionItem>
            {/* Invoice Items */}
            <AccordionItem value="invoice-items">
              <InvoiceAccordionTrigger>Invoice Items</InvoiceAccordionTrigger>
              <InvoiceAccordionContent>
                <InvoiceItemsSection form={form} />
              </InvoiceAccordionContent>
            </AccordionItem>
            {/* Additional Information */}
            <AccordionItem value="additional-info">
              <InvoiceAccordionTrigger>Additional Information</InvoiceAccordionTrigger>
              <InvoiceAccordionContent>
                <FormTextarea
                  name="metadata.notes.value"
                  label={createInvoiceSchemaDefaultValues.metadata.notes.label}
                  reactform={form}
                  placeholder="Notes - any relevant information not already covered"
                  description="Additional notes for the invoice"
                  isOptional={true}
                />
                <FormTextarea
                  name="metadata.terms.value"
                  label={createInvoiceSchemaDefaultValues.metadata.terms.label}
                  reactform={form}
                  placeholder="Terms & Conditions - late fees, payment methods, delivery terms, etc."
                  description="Terms and conditions for the invoice"
                  isOptional={true}
                />
              </InvoiceAccordionContent>
            </AccordionItem>
          </Accordion>
          <Button type="submit" className="w-full">
            Submit Invoice
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default InvoiceForm;

interface InvoiceItemsSectionProps {
  form: UseFormReturn<ZodCreateInvoiceSchema>;
}

const InvoiceItemsSection: React.FC<InvoiceItemsSectionProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const addNewItem = () => {
    append({
      name: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
    });
  };

  // Calculate subtotal from all items
  const items = form.watch("items") || [];
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  // Get current values for calculations
  const discountType = form.watch("invoiceDetails.discount.type");
  const discountValue = form.watch("invoiceDetails.discount.value") || 0;
  const taxType = form.watch("invoiceDetails.tax.type");
  const taxValue = form.watch("invoiceDetails.tax.value") || 0;
  const shippingType = form.watch("invoiceDetails.shipping.type");
  const shippingValue = form.watch("invoiceDetails.shipping.value") || 0;
  const amountPaid = form.watch("invoiceDetails.amountPaid.value") || 0;
  const currency = form.watch("invoiceDetails.currency") || "USD";

  // Calculate discount amount
  const discountAmount = discountType === "percentage" ? (subtotal * discountValue) / 100 : discountValue;

  // Calculate tax amount
  const taxAmount = taxType === "percentage" ? ((subtotal - discountAmount) * taxValue) / 100 : taxValue;

  // Calculate shipping amount
  const shippingAmount = shippingType === "percentage" ? (subtotal * shippingValue) / 100 : shippingValue;

  // Calculate total
  const total = subtotal - discountAmount + taxAmount + shippingAmount;

  // Calculate balance due
  const balanceDue = total - amountPaid;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Add invoice items using the form below</p>

      {fields.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
          <p className="mb-4 text-sm text-gray-500">No items added yet</p>
          <Button type="button" onClick={addNewItem} variant="outline" className="gap-2">
            <Plus className="size-4" />
            Add First Item
          </Button>
        </div>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="rounded-md border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-medium">Item #{index + 1}</h4>
            <Button
              type="button"
              onClick={() => remove(index)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
            >
              <Trash className="size-4" />
              <span className="sr-only">Remove item</span>
            </Button>
          </div>

          <div className="space-y-3">
            <FormInput
              name={`items.${index}.name`}
              label="Item Name"
              reactform={form}
              placeholder="Product or service name"
            />

            <FormTextarea
              name={`items.${index}.description`}
              label="Description"
              reactform={form}
              placeholder="Detailed description of the product or service"
              className="h-20"
            />

            <FormRow>
              <FormInput
                name={`items.${index}.quantity`}
                label="Quantity"
                reactform={form}
                type="number"
                min="1"
                placeholder="1"
              />
              <FormInput
                name={`items.${index}.unitPrice`}
                label="Unit Price"
                reactform={form}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </FormRow>

            {/* Line Total */}
            <div className="flex justify-end">
              <div className="rounded-md bg-gray-50 px-3 py-1.5 text-sm dark:bg-gray-800">
                <span className="mr-2 text-gray-500">Line Total:</span>
                <span className="font-medium">
                  {currency} {((items[index]?.quantity || 0) * (items[index]?.unitPrice || 0)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {fields.length > 0 && (
        <>
          <Button type="button" onClick={addNewItem} variant="outline" className="mt-4 w-full gap-2">
            <Plus className="size-4" />
            Add Another Item
          </Button>

          {/* Invoice Summary */}
          <div className="mt-6 rounded-md border p-4">
            <h4 className="mb-4 text-sm font-medium">Invoice Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal:</span>
                <span>
                  {currency} {subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Discount ({discountType === "percentage" ? `${discountValue}%` : `${currency} ${discountValue}`}):
                </span>
                <span className="text-red-500">
                  -{currency} {discountAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Tax ({taxType === "percentage" ? `${taxValue}%` : `${currency} ${taxValue}`}):
                </span>
                <span>
                  {currency} {taxAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Shipping ({shippingType === "percentage" ? `${shippingValue}%` : `${currency} ${shippingValue}`}):
                </span>
                <span>
                  {currency} {shippingAmount.toFixed(2)}
                </span>
              </div>

              <div className="border-t pt-2">
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>
                    {currency} {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {amountPaid > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount Paid:</span>
                    <span className="text-green-500">
                      -{currency} {amountPaid.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Balance Due:</span>
                      <span>
                        {currency} {balanceDue.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const InvoiceAccordionTrigger = ({ children, ...props }: AccordionTriggerProps) => {
  return (
    <AccordionTrigger
      className="hover:bg-card data-[state=open]:bg-card data-[state=open]:text-primary data-[state=open]:[&>svg]:text-primary px-4"
      {...props}
    >
      {children}
    </AccordionTrigger>
  );
};

const InvoiceAccordionContent = ({ children, ...props }: AccordionContentProps) => {
  return (
    <AccordionContent className="space-y-2 border-t p-4" {...props}>
      {children}
    </AccordionContent>
  );
};

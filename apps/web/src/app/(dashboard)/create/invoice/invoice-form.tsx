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
import { FormInput } from "@/components/ui/form/form-input";
import { Form } from "@/components/ui/form/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";

import { FormImageInput } from "@/components/ui/form/form-image-input";
import { FormTextarea } from "@/components/ui/form/form-textarea";
import FormRow from "@/components/ui/form/form-row";
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
    <div className="flex h-full flex-col overflow-y-scroll">
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
                <p className="text-sm text-gray-500">Add invoice items using the item form below</p>
                {/* Note: Items are typically added dynamically, we'll need a separate component for this */}
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

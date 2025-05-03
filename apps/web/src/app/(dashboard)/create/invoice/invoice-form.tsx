"use client";

import { ZodCreateInvoiceSchema, createInvoiceSchemaDefaultValues } from "@/zod-schemas/invoice/create-invoice";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { FormInput } from "@/components/ui/form/form-input";
import { Form } from "@/components/ui/form/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";

import InvoiceFieldKeyStringValuesSection from "./invoiceHelpers/invoice-field-key-string-value-section";
import InvoiceFieldKeyNumberValuesSection from "./invoiceHelpers/invoice-field-key-number-value-section";
import { InvoiceAccordionContent, InvoiceAccordionTrigger } from "./invoiceHelpers/invoice-accordions";
import InvoiceItemsSection from "./invoiceHelpers/invoice-items-section";
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
    <div className="scroll-bar-hidden flex h-full flex-col overflow-y-scroll">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Accordion type="single" collapsible defaultValue="invoice-items" className="w-full divide-y border-b">
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
                <InvoiceFieldKeyStringValuesSection
                  reactform={form}
                  name="companyDetails.metadata"
                  label="Company Fields"
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
                <InvoiceFieldKeyStringValuesSection
                  reactform={form}
                  name="clientDetails.metadata"
                  label="Client Fields"
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
                    type="number"
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
                <InvoiceFieldKeyNumberValuesSection
                  reactform={form}
                  name="invoiceDetails.billingDetails"
                  label="Billing Details"
                />
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
                <InvoiceFieldKeyStringValuesSection
                  reactform={form}
                  name="metadata.paymentInformation"
                  label="Payment Information"
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

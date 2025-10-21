"use client";

import InvoiceFieldKeyStringValuesSection from "./invoiceHelpers/invoice-field-key-string-value-section";
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { InvoiceTemplateSelector } from "./invoiceHelpers/invoice-templates";
import { FormColorPicker } from "@/components/ui/form/form-color-picker";
import InvoiceItemsSection from "./invoiceHelpers/invoice-items-section";
import { FormDatePicker } from "@/components/ui/form/form-date-picker";
import { FormTextarea } from "@/components/ui/form/form-textarea";
import { FormSelect } from "@/components/ui/form/form-select";
import { currenciesWithSymbols } from "@/constants/currency";
import { FormInput } from "@/components/ui/form/form-input";
import FormRow from "@/components/ui/form/form-row";
import { SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useResizeObserver } from "@mantine/hooks";
import { Form } from "@/components/ui/form/form";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import React from "react";

interface InvoiceFormProps {
  form: UseFormReturn<ZodCreateInvoiceSchema>;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ form }) => {
  const [resizeRef, container] = useResizeObserver();


  return (
    <div className="scroll-bar-hidden flex h-full flex-col overflow-y-scroll">
      <Form {...form}>
        <form>
          <div className="flex h-14 flex-row items-center justify-between border-b px-4">
            <span className="text-sm font-medium">Modèle de facture</span>
            <div className="">
              <InvoiceTemplateSelector form={form} />
            </div>
          </div>
          <Accordion type="single" collapsible defaultValue="company-details" className="w-full divide-y border-b">
            {/* Company Details */}
            <AccordionItem value="company-details">
              <AccordionTrigger>Détails de l&apos;entreprise</AccordionTrigger>
              <AccordionContent ref={resizeRef} className={cn(container.width > 1200 ? "flex-row gap-4" : "flex-col")}>
                <div className={cn(container.width > 1200 ? "w-fit" : "w-full [&>*]:w-full", "flex flex-row gap-4")}>
                </div>
                <div className="flex w-full flex-col gap-2">
                  <FormInput
                    name="companyDetails.name"
                    label="Nom de l'entreprise"
                    reactform={form}
                    placeholder="Entreprise Dupont SARL"
                    description="Nom de votre entreprise"
                  />
                  <FormTextarea
                    className="h-20"
                    name="companyDetails.address"
                    label="Adresse de l'entreprise"
                    reactform={form}
                    placeholder="123 Rue des Affaires, Ville, Pays"
                  />
                  <FormInput
                    name="companyDetails.legalForm"
                    label="Forme juridique"
                    reactform={form}
                    placeholder="SARL, SAS, SASU, etc."
                    description="Forme juridique de l'entreprise"
                    isOptional={true}
                  />
                  <FormInput
                    name="companyDetails.rcs"
                    label="R.C.S"
                    reactform={form}
                    placeholder="R.C.S Paris B 123 456 789"
                    description="Registre du Commerce et des Sociétés"
                    isOptional={true}
                  />
                  <InvoiceFieldKeyStringValuesSection
                    reactform={form}
                    name="companyDetails.metadata"
                    label="Champs de l'entreprise"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            {/* Client Details */}
            <AccordionItem value="client-details">
              <AccordionTrigger>Détails du client</AccordionTrigger>
              <AccordionContent>
                <FormInput name="clientDetails.name" label="Nom du client" reactform={form} placeholder="Jean Dupont" />
                <FormTextarea
                  className="h-20"
                  name="clientDetails.address"
                  label="Adresse du client"
                  reactform={form}
                  placeholder="456 Rue du Client, Ville, Pays"
                />
                <InvoiceFieldKeyStringValuesSection
                  reactform={form}
                  name="clientDetails.metadata"
                  label="Champs du client"
                />
              </AccordionContent>
            </AccordionItem>
            {/* Invoice Details */}
            <AccordionItem value="invoice-details">
              <AccordionTrigger>Détails de la facture</AccordionTrigger>
              <AccordionContent>
                <FormRow>
                  <FormSelect
                    name="invoiceDetails.currency"
                    description="Code de devise pour la facture"
                    defaultValue="USD"
                    label="Devise"
                    reactform={form}
                  >
                    {Object.entries(currenciesWithSymbols).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        <span>{key}</span>
                        <Badge className="bg-primary/15 text-primary rounded" variant="default">
                          {value}
                        </Badge>
                      </SelectItem>
                    ))}
                  </FormSelect>
                  {form.watch("invoiceDetails.theme.template") !== "vercel" && (
                    <>
                      <FormSelect
                        name="invoiceDetails.theme.mode"
                        description="Mode sombre pour la facture"
                        defaultValue="dark"
                        label="Mode sombre"
                        reactform={form}
                      >
                        <SelectItem value="dark">
                          <span>Sombre</span>
                        </SelectItem>
                        <SelectItem value="light">
                          <span>Clair</span>
                        </SelectItem>
                      </FormSelect>
                      <FormColorPicker
                        name="invoiceDetails.theme.baseColor"
                        label="Couleur du thème"
                        reactform={form}
                        description="Fonctionne uniquement en mode clair"
                      />
                    </>
                  )}
                </FormRow>
                <FormRow>
                  <FormInput
                    name="invoiceDetails.prefix"
                    label="Préfixe de facture"
                    reactform={form}
                    placeholder="F-"
                    description="Préfixe pour le numéro de facture"
                    isOptional={true}
                  />
                  <FormInput
                    name="invoiceDetails.serialNumber"
                    label="Numéro de série"
                    reactform={form}
                    placeholder="0001"
                    description="Numéro de série de la facture"
                  />
                </FormRow>
                <FormRow>
                  <FormDatePicker
                    name="invoiceDetails.date"
                    label="Date de facture"
                    reactform={form}
                    description="Date d'émission de la facture"
                  />
                  <FormDatePicker
                    name="invoiceDetails.dueDate"
                    label="Date d'échéance"
                    reactform={form}
                    description="Date d'échéance du paiement"
                  />
                </FormRow>
              </AccordionContent>
            </AccordionItem>
            {/* Invoice Items */}
            <AccordionItem value="invoice-items">
              <AccordionTrigger>Articles de la facture</AccordionTrigger>
              <AccordionContent>
                <InvoiceItemsSection form={form} />
              </AccordionContent>
            </AccordionItem>
            {/* Additional Information */}
            <AccordionItem value="additional-info">
              <AccordionTrigger>Informations supplémentaires</AccordionTrigger>
              <AccordionContent>
                <FormTextarea
                  name="metadata.notes"
                  label="Notes"
                  reactform={form}
                  placeholder="Notes - toute information pertinente non déjà couverte"
                  description="Notes supplémentaires pour la facture"
                  isOptional={true}
                />
                <FormTextarea
                  name="metadata.terms"
                  label="Conditions"
                  reactform={form}
                  placeholder="Conditions générales - frais de retard, méthodes de paiement, conditions de livraison, etc."
                  description="Conditions générales pour la facture"
                  isOptional={true}
                />
              </AccordionContent>
            </AccordionItem>
            {/* Payment Information */}
            <AccordionItem value="payment-info">
              <AccordionTrigger>Informations de paiement</AccordionTrigger>
              <AccordionContent>
                <InvoiceFieldKeyStringValuesSection
                  reactform={form}
                  name="metadata.paymentInformation"
                  label="Informations de paiement"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </form>
      </Form>
    </div>
  );
};

export default InvoiceForm;

"use client";

import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { FormSelect } from "@/components/ui/form/form-select";
import { FormInput } from "@/components/ui/form/form-input";
import { SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TrashIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import React from "react";

interface InvoiceFieldKeyNumberValuesSectionProps {
  reactform: UseFormReturn<ZodCreateInvoiceSchema>;
  name: "invoiceDetails.billingDetails";
  className?: string;
  label?: string | undefined;
  description?: string | undefined;
  isOptional?: boolean;
}

const InvoiceFieldKeyNumberValuesSection: React.FC<InvoiceFieldKeyNumberValuesSectionProps> = ({
  reactform,
  name,
  className,
  label,
}) => {
  const { fields, append, remove } = useFieldArray({
    control: reactform.control,
    name,
  });

  const addNewField = () => {
    append({
      label: "",
      value: 0,
      type: "fixed",
    });
  };

  return (
    <div className={cn(className, "flex flex-col gap-2")}>
      <div className="flex flex-row items-center gap-2">
        <Label>{label ?? "Fields"}</Label>
      </div>
      {fields.map((field, index) => (
        <div className="flex flex-row items-end gap-2" key={field.id}>
          <FormInput
            name={`${name}.${index}.label`}
            reactform={reactform}
            label="Label"
            isOptional={true}
            sublabel="Tax/Discount/Other"
            placeholder="Label"
            description="Enter the label for the field"
          />
          <FormInput
            type="number"
            name={`${name}.${index}.value`}
            reactform={reactform}
            label="Value"
            placeholder="Value"
            description="Enter the value for the field"
          />
          <FormSelect
            description="Select the type of the field"
            name={`${name}.${index}.type`}
            reactform={reactform}
            label="Type"
            placeholder="Type"
          >
            <SelectItem value="fixed">Fixed</SelectItem>
            <SelectItem value="percentage">Percentage</SelectItem>
          </FormSelect>
          <Button className="mb-4.5" variant="destructive" size="icon" onClick={() => remove(index)}>
            <TrashIcon />
          </Button>
        </div>
      ))}
      <Button className="w-full border-dashed" variant="outline" onClick={addNewField}>
        Add New Field
      </Button>
    </div>
  );
};

export default InvoiceFieldKeyNumberValuesSection;

"use client";

import { FieldPath, FieldValues, useFieldArray, UseFormReturn } from "react-hook-form";
import { FormInput } from "@/components/ui/form/form-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TrashIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import React from "react";

interface InvoiceFieldKeyStringValuesSectionProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends React.InputHTMLAttributes<HTMLDivElement> {
  reactform: UseFormReturn<TFieldValues>;
  name: TName;
  className?: string;
  label?: string | undefined;
  description?: string | undefined;
  isOptional?: boolean;
}

const InvoiceFieldKeyStringValuesSection = ({
  reactform,
  name,
  className,
}: InvoiceFieldKeyStringValuesSectionProps) => {
  const { fields, append, remove } = useFieldArray({
    control: reactform.control,
    name: name,
  });

  const addNewField = () => {
    append({
      id: "",
      label: "",
      value: "",
    });
  };

  return (
    <div className={cn(className, "flex flex-col gap-2")}>
      <div className="flex flex-row items-center gap-2">
        <Label>Fields</Label>
      </div>
      {fields.map((field, index) => (
        <div className="flex flex-row items-end gap-2" key={field.id}>
          <FormInput name={`${name}.${index}.label`} reactform={reactform} label="Label" placeholder="Label" />
          <FormInput name={`${name}.${index}.value`} reactform={reactform} label="Value" placeholder="Value" />
          <Button variant="destructive" size="icon" onClick={() => remove(index)}>
            <TrashIcon />
          </Button>
        </div>
      ))}
      <Button className="w-full border-dashed" onClick={addNewField}>
        Add New Field
      </Button>
    </div>
  );
};

export default InvoiceFieldKeyStringValuesSection;

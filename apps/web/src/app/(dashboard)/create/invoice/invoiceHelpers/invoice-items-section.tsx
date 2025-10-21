"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogContentContainer,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeaderContainer,
  DialogIcon,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createInvoiceItemSchema, ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { BoxIcon, BoxPlusIcon, TrashIcon } from "@/assets/icons";
import { FormInput } from "@/components/ui/form/form-input";
import { formatCurrencyText } from "@/constants/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import FormRow from "@/components/ui/form/form-row";
import { Form } from "@/components/ui/form/form";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import React, { useState } from "react";

interface InvoiceItemsSectionProps {
  form: UseFormReturn<ZodCreateInvoiceSchema>;
}
type InvoiceItem = ZodCreateInvoiceSchema["items"][number];

const InvoiceItemsSection: React.FC<InvoiceItemsSectionProps> = ({ form }) => {
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Rendering the items */}
      {fields.length > 0 && (
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <div className="bg-muted/50 flex w-full flex-row justify-between gap-2 rounded-md p-3" key={field.id}>
              <div className="flex w-full flex-row gap-2">
                <div className="bg-muted-foreground/20 grid aspect-square h-full place-items-center rounded-md">
                  <BoxIcon />
                </div>
                <div className="w-full">
                  <div className="line-clamp-1 text-sm font-medium">{field.name}</div>
                  <div className="text-muted-foreground line-clamp-1 text-xs">{field.description}</div>
                  <div className="text-primary text-[10px] font-medium">
                    {formatCurrencyText(form.watch("invoiceDetails.currency"), field.unitPrice)}{" "}
                    <span className="text-muted-foreground">x {field.quantity} Qty</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <div className="flex flex-col items-end justify-between gap-1">
                  <div className="flex flex-row gap-1.5">
                    <HandleItemModal type="edit" append={append} update={update} editingIndex={index} data={field}>
                      <Button
                        type="button"
                        className="text-muted-foreground h-5.5 w-5.5 rounded"
                        variant="ghost"
                        size="icon"
                      >
                        <PencilIcon className="size-3" />
                      </Button>
                    </HandleItemModal>
                    <Button
                      className="h-5.5 w-5.5 rounded"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <TrashIcon className="size-3" />
                    </Button>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <p className="space-x-1 text-[10px] whitespace-nowrap">
                      <span>Total :</span>
                      <span>
                        {formatCurrencyText(form.watch("invoiceDetails.currency"), field.unitPrice * field.quantity)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Dialog for adding a new item */}
      <HandleItemModal type="add" append={append} update={update}>
        <Button type="button" className="w-full border-dashed" variant="outline">
          <BoxPlusIcon />
          Ajouter un article
        </Button>
      </HandleItemModal>
    </div>
  );
};

export default InvoiceItemsSection;

interface AddItemModalProps {
  type: "add" | "edit";
  children: React.ReactNode;
  data?: InvoiceItem;
  editingIndex?: number | null;
  append: (data: InvoiceItem) => void;
  update: (index: number, data: InvoiceItem) => void;
}

const HandleItemModal = ({ type, append, update, editingIndex, data, children }: AddItemModalProps) => {
  const [open, setOpen] = useState(false);

  const invoiceItemForm = useForm<InvoiceItem>({
    resolver: zodResolver(createInvoiceItemSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      quantity: data?.quantity || 1,
      unitPrice: data?.unitPrice || 1,
    },
  });

  const onHandleSubmit = (data: InvoiceItem) => {
    if (type === "edit" && typeof editingIndex === "number") {
      update(editingIndex, data);
    } else {
      append(data);
    }

    // Clean up the form
    invoiceItemForm.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Form {...invoiceItemForm}>
          <form onSubmit={invoiceItemForm.handleSubmit(onHandleSubmit)}>
            <DialogHeaderContainer>
              <DialogIcon>
                <BoxPlusIcon />
              </DialogIcon>
              <DialogHeader>
                <DialogTitle>Ajouter un article</DialogTitle>
                <DialogDescription>Ajouter un article à la facture</DialogDescription>
              </DialogHeader>
            </DialogHeaderContainer>
            <DialogContentContainer>
              <FormInput label="Nom de l'article" name="name" placeholder="Nom de l'article" reactform={invoiceItemForm} />
              <FormInput
                label="Description de l'article"
                name="description"
                placeholder="Description de l'article"
                reactform={invoiceItemForm}
              />
              <FormRow>
                <FormInput
                  type="number"
                  label="Quantité"
                  name="quantity"
                  placeholder="Quantité"
                  reactform={invoiceItemForm}
                />
                <FormInput
                  type="number"
                  label="Prix unitaire"
                  name="unitPrice"
                  placeholder="Prix unitaire"
                  reactform={invoiceItemForm}
                />
              </FormRow>
            </DialogContentContainer>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button type="submit">Ajouter l'article</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

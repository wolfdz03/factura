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
import { BoxIcon, BoxPlusIcon, TrashIcon } from "@/assets/icons";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { toast } from "sonner";

interface InvoiceItemsSectionProps {
  form: UseFormReturn<ZodCreateInvoiceSchema>;
}

type InvoiceItem = ZodCreateInvoiceSchema["items"][number];

const InvoiceItemsSection: React.FC<InvoiceItemsSectionProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [newItem, setNewItem] = useState<InvoiceItem>({
    name: "",
    description: "",
    quantity: 1,
    unitPrice: 1,
  });

  const onAddItem = () => {
    // Verify the data before adding
    const isItemValid = createInvoiceItemSchema.safeParse(newItem);
    if (isItemValid.success) {
      append(newItem);
      setOpenDialog(false);
      // Reset the new item
      setNewItem({
        name: "",
        description: "",
        quantity: 1,
        unitPrice: 1,
      });
    } else {
      toast.error("Invalid Values", {
        description: `${isItemValid.error.errors.map((error) => error.message)}`,
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Rendering the items */}
      {fields.length > 0 && (
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <div className="bg-muted flex w-full flex-row justify-between gap-2 rounded-md p-3" key={field.id}>
              <div className="flex w-full flex-row gap-2">
                <div className="bg-muted-foreground/20 grid aspect-square h-full place-items-center rounded-md">
                  <BoxIcon />
                </div>
                <div className="w-full">
                  <div className="text-sm font-medium">{field.name}</div>
                  <div className="text-muted-foreground text-xs">{field.description}</div>
                  <div className="text-primary text-[10px] font-medium">
                    ${field.unitPrice} <span className="text-muted-foreground">x {field.quantity} Qty</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <div className="flex flex-col items-end justify-between">
                  <Button
                    className="h-5.5 w-5.5 rounded"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <TrashIcon className="size-3" />
                  </Button>
                  <div className="flex flex-row items-center gap-1">
                    <p className="text-muted-foreground text-[10px] whitespace-nowrap">
                      Total : ${field.unitPrice * field.quantity}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Dialog for adding a new item */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button className="w-full border-dashed" variant="outline">
            <BoxPlusIcon />
            Add Item
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeaderContainer>
            <DialogIcon>
              <BoxPlusIcon />
            </DialogIcon>
            <DialogHeader>
              <DialogTitle>Add Item</DialogTitle>
              <DialogDescription>Add an item to the invoice</DialogDescription>
            </DialogHeader>
          </DialogHeaderContainer>
          <DialogContentContainer>
            <div className="flex flex-col gap-1.5">
              <Label>Item Name</Label>
              <Input
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Item Name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Item Description</Label>
              <Input
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Item Description"
              />
            </div>
            <div className="flex flex-row gap-2">
              <div className="flex w-full flex-col gap-1.5">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  placeholder="Quantity"
                />
              </div>
              <div className="flex w-full flex-col gap-1.5">
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  value={newItem.unitPrice}
                  onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                  placeholder="Unit Price"
                />
              </div>
            </div>
          </DialogContentContainer>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={onAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceItemsSection;

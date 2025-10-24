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
import { 
  createInvoiceItemSchema, 
  createInvoiceItemCategorySchema,
  ZodCreateInvoiceSchema 
} from "@/zod-schemas/invoice/create-invoice";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { BoxIcon, BoxPlusIcon, TrashIcon } from "@/assets/icons";
import { FormInput } from "@/components/ui/form/form-input";
import { formatCurrencyText } from "@/constants/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import FormRow from "@/components/ui/form/form-row";
import { Form } from "@/components/ui/form/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PencilIcon, PlusIcon, FolderIcon, FileTextIcon } from "lucide-react";
import React, { useState } from "react";

interface InvoiceItemsSectionProps {
  form: UseFormReturn<ZodCreateInvoiceSchema>;
}
type InvoiceItem = ZodCreateInvoiceSchema["items"][number];
type InvoiceCategory = ZodCreateInvoiceSchema["itemCategories"][number];

const InvoiceItemsSection: React.FC<InvoiceItemsSectionProps> = ({ form }) => {
  const { fields: categories, append: addCategory, remove: removeCategory } = useFieldArray({
    control: form.control,
    name: "itemCategories",
  });

  const { fields: items, append: addItem, remove: removeItem } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const categoryId = item.categoryId || 'uncategorized';
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  return (
    <div className="space-y-4">
      {/* Categories Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Catégories d'articles</h3>
          <Button
            type="button"
            size="sm"
            onClick={() => addCategory({ name: "Nouvelle catégorie", description: "" })}
            className="h-8"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Ajouter une catégorie
          </Button>
        </div>

        {categories.map((category, categoryIndex) => (
          <Card key={category.id} className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderIcon className="h-4 w-4 text-blue-500" />
                  <CardTitle className="text-sm">
                    {category.name || "Nouvelle catégorie"}
                  </CardTitle>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCategory(categoryIndex)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Category form fields */}
              <div className="space-y-2">
                <div>
                  <input
                    type="text"
                    placeholder="Nom de la catégorie (ex: Accompagnement, Maintenance et Coordination Digital)"
                    value={form.watch(`itemCategories.${categoryIndex}.name`) || ""}
                    onChange={(e) => {
                      form.setValue(`itemCategories.${categoryIndex}.name`, e.target.value);
                    }}
                    className={`w-full px-3 py-2 border rounded-md text-sm ${
                      form.formState.errors.itemCategories?.[categoryIndex]?.name 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                    required
                  />
                  {form.formState.errors.itemCategories?.[categoryIndex]?.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.itemCategories[categoryIndex].name.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Description de la catégorie (optionnel)"
                    value={form.watch(`itemCategories.${categoryIndex}.description`) || ""}
                    onChange={(e) => {
                      form.setValue(`itemCategories.${categoryIndex}.description`, e.target.value);
                    }}
                    className={`w-full px-3 py-2 border rounded-md text-sm ${
                      form.formState.errors.itemCategories?.[categoryIndex]?.description 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                  />
                  {form.formState.errors.itemCategories?.[categoryIndex]?.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.itemCategories[categoryIndex].description.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Items in this category */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-medium text-gray-600">Articles dans cette catégorie</h4>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addItem({ 
                      name: "Nouvel article", 
                      description: "", 
                      quantity: 1, 
                      unitPrice: 1,
                      categoryId: category.id,
                      isVatExempt: false
                    })}
                    className="h-6 text-xs"
                  >
                    <PlusIcon className="h-3 w-3 mr-1" />
                    Ajouter un article
                  </Button>
                </div>

                {groupedItems[category.id]?.map((item, itemIndex) => (
                  <div key={item.id} className="bg-gray-50 p-3 rounded-md border">
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Nom de l'article"
                        value={form.watch(`items.${items.findIndex(i => i.id === item.id)}.name`) || ""}
                        onChange={(e) => {
                          const globalItemIndex = items.findIndex(i => i.id === item.id);
                          form.setValue(`items.${globalItemIndex}.name`, e.target.value);
                        }}
                        className="px-2 py-1 border rounded text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={form.watch(`items.${items.findIndex(i => i.id === item.id)}.description`) || ""}
                        onChange={(e) => {
                          const globalItemIndex = items.findIndex(i => i.id === item.id);
                          form.setValue(`items.${globalItemIndex}.description`, e.target.value);
                        }}
                        className="px-2 py-1 border rounded text-xs col-span-2"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        placeholder="Quantité"
                        value={form.watch(`items.${items.findIndex(i => i.id === item.id)}.quantity`) || 1}
                        onChange={(e) => {
                          const globalItemIndex = items.findIndex(i => i.id === item.id);
                          form.setValue(`items.${globalItemIndex}.quantity`, Number(e.target.value));
                        }}
                        className="px-2 py-1 border rounded text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Prix unitaire"
                        value={form.watch(`items.${items.findIndex(i => i.id === item.id)}.unitPrice`) || 1}
                        onChange={(e) => {
                          const globalItemIndex = items.findIndex(i => i.id === item.id);
                          form.setValue(`items.${globalItemIndex}.unitPrice`, Number(e.target.value));
                        }}
                        className="px-2 py-1 border rounded text-xs"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">
                          Total: {formatCurrencyText(form.watch("invoiceDetails.currency"), item.quantity * item.unitPrice)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const globalItemIndex = items.findIndex(i => i.id === item.id);
                            removeItem(globalItemIndex);
                          }}
                          className="h-5 w-5 p-0 text-red-500"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                    {/* VAT Controls */}
                    <div className="mt-2 flex items-center gap-2">
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={form.watch(`items.${items.findIndex(i => i.id === item.id)}.isVatExempt`) || false}
                          onChange={(e) => {
                            const globalItemIndex = items.findIndex(i => i.id === item.id);
                            form.setValue(`items.${globalItemIndex}.isVatExempt`, e.target.checked);
                          }}
                          className="rounded"
                        />
                        TVA exempt
                      </label>
                      {!form.watch(`items.${items.findIndex(i => i.id === item.id)}.isVatExempt`) && (
                        <input
                          type="number"
                          placeholder="Taux TVA %"
                          value={form.watch(`items.${items.findIndex(i => i.id === item.id)}.vatRate`) || ""}
                          onChange={(e) => {
                            const globalItemIndex = items.findIndex(i => i.id === item.id);
                            form.setValue(`items.${globalItemIndex}.vatRate`, Number(e.target.value));
                          }}
                          className="px-2 py-1 border rounded text-xs w-20"
                        />
                      )}
                    </div>
                  </div>
                )) || (
                  <p className="text-xs text-gray-500 italic">Aucun article dans cette catégorie</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Standalone Items Section */}
      {groupedItems['uncategorized'] && groupedItems['uncategorized'].length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Articles sans catégorie</h3>
          {groupedItems['uncategorized'].map((item, itemIndex) => (
            <div key={item.id} className="bg-muted/50 flex w-full flex-row justify-between gap-2 rounded-md p-3">
              <div className="flex w-full flex-row gap-2">
                <div className="bg-muted-foreground/20 grid aspect-square h-full place-items-center rounded-md">
                  <FileTextIcon className="h-4 w-4" />
                </div>
                <div className="w-full">
                  <div className="line-clamp-1 text-sm font-medium">{item.name}</div>
                  <div className="text-muted-foreground line-clamp-1 text-xs">{item.description}</div>
                  <div className="text-primary text-[10px] font-medium">
                    {formatCurrencyText(form.watch("invoiceDetails.currency"), item.unitPrice)}{" "}
                    <span className="text-muted-foreground">x {item.quantity} Qty</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <div className="flex flex-col items-end justify-between gap-1">
                  <div className="flex flex-row gap-1.5">
                    <Button
                      type="button"
                      className="text-muted-foreground h-5.5 w-5.5 rounded"
                      variant="ghost"
                      size="icon"
                    >
                      <PencilIcon className="size-3" />
                    </Button>
                    <Button
                      className="h-5.5 w-5.5 rounded"
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        const globalItemIndex = items.findIndex(i => i.id === item.id);
                        removeItem(globalItemIndex);
                      }}
                    >
                      <TrashIcon className="size-3" />
                    </Button>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <p className="space-x-1 text-[10px] whitespace-nowrap">
                      <span>Total :</span>
                      <span>
                        {formatCurrencyText(form.watch("invoiceDetails.currency"), item.unitPrice * item.quantity)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Standalone Item */}
      <Button 
        type="button" 
        className="w-full border-dashed" 
        variant="outline"
        onClick={() => addItem({ 
          name: "Nouvel article", 
          description: "", 
          quantity: 1, 
          unitPrice: 1,
          isVatExempt: false
        })}
      >
        <BoxPlusIcon />
        Ajouter un article sans catégorie
      </Button>
    </div>
  );
};

export default InvoiceItemsSection;

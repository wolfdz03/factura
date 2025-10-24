import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";

export const getSubTotalValue = (data: ZodCreateInvoiceSchema) => {
  return data.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
};

// Calculate VAT amount for a specific item
export const getItemVatAmount = (item: ZodCreateInvoiceSchema["items"][number], globalVatRate: number) => {
  if (item.isVatExempt) {
    return 0;
  }
  
  const vatRate = item.vatRate || globalVatRate;
  const itemTotal = item.quantity * item.unitPrice;
  return itemTotal * vatRate / 100;
};

// Calculate TTC amount for a specific item
export const getItemTtcAmount = (item: ZodCreateInvoiceSchema["items"][number], globalVatRate: number) => {
  const itemTotal = item.quantity * item.unitPrice;
  const vatAmount = getItemVatAmount(item, globalVatRate);
  return itemTotal + vatAmount;
};

// Get total VAT amount across all items
export const getTotalVatAmount = (data: ZodCreateInvoiceSchema) => {
  const globalVatRate = data.invoiceDetails.vatRate || 20;
  
  return data.items.reduce((acc, item) => {
    return acc + getItemVatAmount(item, globalVatRate);
  }, 0);
};

// Get total TTC amount across all items
export const getTotalTtcAmount = (data: ZodCreateInvoiceSchema) => {
  const globalVatRate = data.invoiceDetails.vatRate || 20;
  
  return data.items.reduce((acc, item) => {
    return acc + getItemTtcAmount(item, globalVatRate);
  }, 0);
};

export const getTotalValue = (data: ZodCreateInvoiceSchema) => {
  const subtotal = getSubTotalValue(data);
  const billingRates = data.invoiceDetails.billingDetails;

  // Calculate the total value based of fixed/percentage billing rates also value can be positive or negative
  let total = subtotal;

  billingRates.forEach((rate) => {
    if (rate.type === "fixed") {
      // Add or subtract the fixed amount directly
      total += rate.value;
    } else if (rate.type === "percentage") {
      // Calculate percentage of subtotal and add/subtract
      const percentageValue = (subtotal * rate.value) / 100;
      total += percentageValue;
    }
  });

  // Add per-item VAT to the total
  const totalVatAmount = getTotalVatAmount(data);
  total += totalVatAmount;

  return total;
};

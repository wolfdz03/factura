"use client";

import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import React from "react";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "white",
  },
  section: {
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  companyLogo: {
    width: 100,
    height: 50,
    objectFit: "contain",
  },
  companyDetails: {
    alignItems: "flex-end",
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  companyAddress: {
    fontSize: 10,
    color: "#555",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 15,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
  },
  col: {
    flexDirection: "column",
  },
  addressBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 5,
    marginBottom: 20,
    minHeight: 80,
  },
  addressTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  addressText: {
    fontSize: 10,
  },
  invoiceInfoContainer: {
    marginBottom: 30,
  },
  invoiceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    width: "40%",
    fontSize: 10,
    color: "#555",
  },
  value: {
    width: "60%",
    fontSize: 10,
  },
  itemsTable: {
    marginTop: 20,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 8,
    fontWeight: "bold",
    fontSize: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 8,
    fontSize: 10,
  },
  itemName: { width: "35%" },
  itemDesc: { width: "25%" },
  itemQty: { width: "10%", textAlign: "center" },
  itemPrice: { width: "15%", textAlign: "right" },
  itemTotal: { width: "15%", textAlign: "right" },
  summaryContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 5,
  },
  summaryLabel: {
    width: "25%",
    textAlign: "right",
    paddingRight: 10,
    fontSize: 10,
  },
  summaryValue: {
    width: "15%",
    textAlign: "right",
    fontSize: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    fontWeight: "bold",
  },
  totalLabel: {
    width: "25%",
    textAlign: "right",
    paddingRight: 10,
    fontSize: 12,
    fontWeight: "bold",
  },
  totalValue: {
    width: "15%",
    textAlign: "right",
    fontSize: 12,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  signatureContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 50,
    marginBottom: 20,
  },
  signature: {
    width: 150,
    height: 50,
    objectFit: "contain",
  },
  notes: {
    marginTop: 20,
    fontSize: 10,
    color: "#555",
  },
  terms: {
    marginTop: 20,
    fontSize: 10,
    color: "#555",
  },
});

// Invoice PDF Document component
const InvoicePDF: React.FC<{ data: ZodCreateInvoiceSchema }> = ({ data }) => {
  // Calculate totals
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const discountAmount =
    data.invoiceDetails.discount.type === "percentage"
      ? (subtotal * data.invoiceDetails.discount.value) / 100
      : data.invoiceDetails.discount.value;

  const taxAmount =
    data.invoiceDetails.tax.type === "percentage"
      ? ((subtotal - discountAmount) * data.invoiceDetails.tax.value) / 100
      : data.invoiceDetails.tax.value;

  const shippingAmount =
    data.invoiceDetails.shipping.type === "percentage"
      ? (subtotal * data.invoiceDetails.shipping.value) / 100
      : data.invoiceDetails.shipping.value;

  const total = subtotal - discountAmount + taxAmount + shippingAmount;
  const balanceDue = total - data.invoiceDetails.amountPaid.value;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `${data.invoiceDetails.currency} ${amount.toFixed(2)}`;
  };

  return (
    <Document
      title={`Invoice ${data.invoiceDetails.prefix}${data.invoiceDetails.serialNumber}`}
      author={data.companyDetails.name}
      creator={data.companyDetails.name}
      producer="Invoicely"
    >
      <Page size="A4" style={styles.page}>
        {/* Header with Company Info and Logo */}
        <View style={styles.header}>
          <View>{data.companyDetails.logo && <Image src={data.companyDetails.logo} style={styles.companyLogo} />}</View>
          <View style={styles.companyDetails}>
            <Text style={styles.companyName}>{data.companyDetails.name}</Text>
            <Text style={styles.companyAddress}>{data.companyDetails.address.value}</Text>
          </View>
        </View>

        {/* Invoice Title */}
        <Text style={styles.title}>
          INVOICE {data.invoiceDetails.prefix}
          {data.invoiceDetails.serialNumber}
        </Text>

        {/* Client and Shipping Info */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={[styles.addressBox, { width: "48%" }]}>
            <Text style={styles.addressTitle}>Bill To:</Text>
            <Text style={styles.addressText}>{data.clientDetails.name}</Text>
            <Text style={styles.addressText}>{data.clientDetails.address.value}</Text>
          </View>
          {data.invoiceDetails.shipTo.value && (
            <View style={[styles.addressBox, { width: "48%" }]}>
              <Text style={styles.addressTitle}>{data.invoiceDetails.shipTo.label}:</Text>
              <Text style={styles.addressText}>{data.invoiceDetails.shipTo.value}</Text>
            </View>
          )}
        </View>

        {/* Invoice Details */}
        <View style={styles.invoiceInfoContainer}>
          <View style={styles.invoiceInfo}>
            <Text style={styles.label}>Invoice Date:</Text>
            <Text style={styles.value}>{formatDate(data.invoiceDetails.date)}</Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.label}>Due Date:</Text>
            <Text style={styles.value}>{formatDate(data.invoiceDetails.dueDate)}</Text>
          </View>
          {data.invoiceDetails.paymentTerms && (
            <View style={styles.invoiceInfo}>
              <Text style={styles.label}>Payment Terms:</Text>
              <Text style={styles.value}>{data.invoiceDetails.paymentTerms}</Text>
            </View>
          )}
        </View>

        {/* Items Table */}
        <View style={styles.itemsTable}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.itemName}>Item</Text>
            <Text style={styles.itemDesc}>Description</Text>
            <Text style={styles.itemQty}>Qty</Text>
            <Text style={styles.itemPrice}>Price</Text>
            <Text style={styles.itemTotal}>Total</Text>
          </View>

          {/* Table Rows */}
          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
              <Text style={styles.itemQty}>{item.quantity}</Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={styles.itemTotal}>{formatCurrency(item.quantity * item.unitPrice)}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
          </View>

          {data.invoiceDetails.discount.value > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Discount (
                {data.invoiceDetails.discount.type === "percentage"
                  ? `${data.invoiceDetails.discount.value}%`
                  : formatCurrency(data.invoiceDetails.discount.value)}
                ):
              </Text>
              <Text style={styles.summaryValue}>-{formatCurrency(discountAmount)}</Text>
            </View>
          )}

          {data.invoiceDetails.tax.value > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {data.invoiceDetails.tax.label} (
                {data.invoiceDetails.tax.type === "percentage"
                  ? `${data.invoiceDetails.tax.value}%`
                  : formatCurrency(data.invoiceDetails.tax.value)}
                ):
              </Text>
              <Text style={styles.summaryValue}>{formatCurrency(taxAmount)}</Text>
            </View>
          )}

          {data.invoiceDetails.shipping.value > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {data.invoiceDetails.shipping.label} (
                {data.invoiceDetails.shipping.type === "percentage"
                  ? `${data.invoiceDetails.shipping.value}%`
                  : formatCurrency(data.invoiceDetails.shipping.value)}
                ):
              </Text>
              <Text style={styles.summaryValue}>{formatCurrency(shippingAmount)}</Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          </View>

          {data.invoiceDetails.amountPaid.value > 0 && (
            <>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{data.invoiceDetails.amountPaid.label}:</Text>
                <Text style={styles.summaryValue}>-{formatCurrency(data.invoiceDetails.amountPaid.value)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Balance Due:</Text>
                <Text style={styles.totalValue}>{formatCurrency(balanceDue)}</Text>
              </View>
            </>
          )}
        </View>

        {/* Notes & Terms */}
        {data.metadata.notes.value && (
          <View style={styles.notes}>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>{data.metadata.notes.label}:</Text>
            <Text>{data.metadata.notes.value}</Text>
          </View>
        )}

        {data.metadata.terms.value && (
          <View style={styles.terms}>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>{data.metadata.terms.label}:</Text>
            <Text>{data.metadata.terms.value}</Text>
          </View>
        )}

        {/* Signature */}
        {data.companyDetails.signature && (
          <View style={styles.signatureContainer}>
            <Image src={data.companyDetails.signature} style={styles.signature} />
          </View>
        )}
      </Page>
    </Document>
  );
};
export default InvoicePDF;

/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { format } from "date-fns";
import React from "react";

Font.register({
  family: "Roboto",
  src: "http://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf",
});

// Invoice PDF Document component
const InvoicePDF: React.FC<{ data: ZodCreateInvoiceSchema }> = ({ data }) => {
  // Calculate totals
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const total = subtotal;

  const formatCurrency = (amount: number) => {
    return `${data.invoiceDetails.currency} ${amount.toFixed(2)}`;
  };

  const themeColor = { color: data.invoiceDetails.theme.baseColor, fontWeight: "semibold" };

  return (
    <Document
      title={`Invoice-${data.invoiceDetails.prefix}${data.invoiceDetails.serialNumber}`}
      author={data.companyDetails.name}
      creator={data.companyDetails.name}
      producer="Invoicely"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.invoiceTitle}>
            <Text style={themeColor}>
              Invoice {data.invoiceDetails.prefix}
              {data.invoiceDetails.serialNumber}
            </Text>
          </View>
        </View>
        <View style={styles.flexRowSpaceBetween}>
          {/* Invoice Details */}
          <View style={styles.flexColumnGap}>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsTitleWithWidth}>Invoice Number</Text>
              <Text style={styles.detailsValue}>{data.invoiceDetails.serialNumber}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsTitleWithWidth}>Invoice Date</Text>
              <Text style={styles.detailsValue}>{format(data.invoiceDetails.date, "dd/MM/yyyy")}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsTitleWithWidth}>Invoice Due Date</Text>
              <Text style={styles.detailsValue}>{format(data.invoiceDetails.dueDate, "dd/MM/yyyy")}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsTitleWithWidth}>Payment Terms</Text>
              <Text style={styles.detailsValue}>{data.invoiceDetails.paymentTerms}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsTitleWithWidth}>Currency</Text>
              <Text style={styles.detailsValue}>{data.invoiceDetails.currency}</Text>
            </View>
          </View>
          {/* Invoice Logo */}
          <View style={styles.flexCenter}>
            <Image style={styles.logo} src={"/official/logo-icon.png"} />
          </View>
        </View>
        {/* Invoice billing details */}
        <View style={styles.billingDetailsContainer}>
          <View style={styles.billingBox}>
            <Text style={themeColor}>Billed By</Text>
            <Text style={styles.billingName}>{data.companyDetails.name}</Text>
            <Text style={styles.detailsValue}>{data.companyDetails.address.value}</Text>
            {data.companyDetails.metadata.map((metadata) => (
              <View key={metadata.label} style={styles.detailsRow}>
                <Text style={styles.detailsTitle}>{metadata.label}</Text>
                <Text style={styles.detailsValue}>{metadata.value}</Text>
              </View>
            ))}
          </View>
          <View style={styles.billingBox}>
            <Text style={themeColor}>Billed To</Text>
            <Text style={styles.billingName}>{data.companyDetails.name}</Text>
            <Text style={styles.detailsValue}>{data.companyDetails.address.value}</Text>
            {data.clientDetails.metadata.map((metadata) => (
              <View key={metadata.label} style={styles.detailsRow}>
                <Text style={styles.detailsTitle}>{metadata.label}</Text>
                <Text style={styles.detailsValue}>{metadata.value}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Items Table */}
        <View style={styles.itemsTable}>
          <View style={{ ...styles.tableHeader, backgroundColor: data.invoiceDetails.theme.baseColor, color: "#fff" }}>
            <Text style={styles.itemName}>Item</Text>
            <Text style={styles.itemQty}>Qty</Text>
            <Text style={styles.itemPrice}>Price</Text>
            <Text style={styles.itemTotal}>Total</Text>
          </View>
          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.itemNameContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.detailsValue}>{item.description}</Text>
              </View>
              <Text style={styles.itemQty}>{item.quantity}</Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={styles.itemTotal}>{formatCurrency(item.quantity * item.unitPrice)}</Text>
            </View>
          ))}
        </View>
        {/* Invoice meta data and pricing */}
        <View style={styles.metadataPricingContainer}>
          <View style={styles.metadataContainer}>
            {/* Payment Information */}
            <View style={data.metadata.paymentInformation.length ? styles.sectionContainer : styles.displayNone}>
              <Text style={themeColor}>Payment Information</Text>
              <View style={styles.flexColumnGapSm}>
                {data.metadata.paymentInformation.map((paymentInformation, index) => {
                  if (!paymentInformation.label || !paymentInformation.value) return null;

                  return (
                    <View key={index} style={styles.detailsRow}>
                      <Text style={styles.detailsTitleWithWidth}>{paymentInformation.label}</Text>
                      <Text style={styles.detailsValue}>{paymentInformation.value}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
            {/* Terms and conditions */}
            <View style={data.metadata.terms.value ? styles.sectionContainer : styles.displayNone}>
              <Text style={themeColor}>Terms</Text>
              <Text style={styles.metadataDescription}>{data.metadata.terms.value}</Text>
            </View>
            {/* Notes */}
            <View style={data.metadata.notes.value ? styles.sectionContainer : styles.displayNone}>
              <Text style={themeColor}>Notes</Text>
              <Text style={styles.metadataDescription}>{data.metadata.notes.value}</Text>
            </View>
          </View>
          {/* Pricing  */}
          <View style={styles.pricingContainer}>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Subtotal</Text>
              <Text style={styles.pricingValue}>{formatCurrency(subtotal)}</Text>
            </View>
            {data.invoiceDetails.billingDetails.map((billingDetail, index) => {
              if (!billingDetail.label || !billingDetail.value) return null;

              return (
                <View key={index} style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>{billingDetail.label}</Text>
                  <Text style={styles.pricingValue}>{formatCurrency(billingDetail.value)}</Text>
                </View>
              );
            })}
            <View style={styles.hr}></View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingTotal}>Total</Text>
              <Text style={styles.pricingTotalValue}>{formatCurrency(total)}</Text>
            </View>
            <View style={styles.totalWordsContainer}>
              <Text style={styles.totalWordsLabel}>Invoice Total (in words)</Text>
              <Text style={styles.totalWordsValue}>Fourty-five thousand, four hundred and fifty-four</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;

// Define styles for the PDF
const styles = StyleSheet.create({
  // Common styles
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Roboto",
    backgroundColor: "white",
  },
  flexRowSpaceBetween: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  flexColumnGap: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  flexColumnGapSm: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginTop: 4,
  },
  flexCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailsTitle: {
    fontSize: 10,
    fontWeight: 600,
  },
  detailsTitleWithWidth: {
    fontSize: 10,
    fontWeight: 600,
    minWidth: 100,
  },
  detailsValue: {
    fontSize: 10,
    fontWeight: "normal",
    color: "#71717B",
  },
  sectionContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    paddingRight: 10,
  },
  displayNone: {
    display: "none",
    height: 0,
    margin: 0,
    overflow: "hidden",
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 5,
    marginBottom: 5,
  },

  // Header styles
  header: {
    display: "flex",
    flexDirection: "row",
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "semibold",
  },
  logo: {
    width: 80,
    height: 80,
    aspectRatio: 1,
  },

  // Billing styles
  billingDetailsContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 18,
    width: "100%",
    gap: 10,
  },
  billingBox: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 10,
    backgroundColor: "#f0f0f0",
    width: "50%",
    borderRadius: 4,
  },
  billingName: {
    fontSize: 10,
    fontWeight: "semibold",
  },

  // Items table styles
  itemsTable: {
    marginTop: 20,
    marginBottom: 30,
    flexGrow: 1,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 8,
    fontWeight: "bold",
    fontSize: 10,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 8,
    fontSize: 10,
  },
  itemNameContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    width: "60%",
  },
  itemName: { width: "60%" },
  itemQty: { width: "10%", textAlign: "center" },
  itemPrice: { width: "15%", textAlign: "right" },
  itemTotal: { width: "15%", textAlign: "right" },

  // Metadata and pricing styles
  metadataPricingContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 50,
  },
  metadataContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    justifyContent: "flex-end",
    width: "50%",
  },
  metadataDescription: {
    fontSize: 10,
    fontWeight: "normal",
    color: "#71717B",
    marginTop: 4,
  },
  pricingContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 10,
    width: "50%",
    minWidth: "50%",
    justifyContent: "flex-end",
  },
  pricingRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pricingLabel: {
    fontSize: 10,
    fontWeight: "semibold",
  },
  pricingValue: {
    fontSize: 10,
  },
  pricingTotal: {
    fontSize: 12,
    fontWeight: "semibold",
  },
  pricingTotalValue: {
    fontSize: 18,
    fontWeight: "semibold",
  },
  totalWordsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginTop: 4,
  },
  totalWordsLabel: {
    fontSize: 8,
    fontWeight: "normal",
    color: "#71717B",
  },
  totalWordsValue: {
    fontSize: 10,
    fontWeight: "normal",
  },
});

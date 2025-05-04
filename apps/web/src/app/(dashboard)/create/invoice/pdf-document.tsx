/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { getSubTotalValue, getTotalValue } from "@/constants/pdf-helpers";
import { formatCurrencyText } from "@/constants/currency";
import { toWords } from "number-to-words";
import { format } from "date-fns";
import React from "react";

// Register fonts
Font.register({
  family: "GeistMono",
  fonts: [
    {
      src: "/fonts/geistmono/GeistMono-Light.ttf",
      fontWeight: "light",
    },
    {
      src: "/fonts/geistmono/GeistMono-Regular.ttf",
      fontWeight: "normal",
    },
  ],
});

Font.register({
  family: "Quicksand",
  fonts: [
    {
      src: "/fonts/quicksand/Quicksand-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "/fonts/quicksand/Quicksand-Bold.ttf",
      fontWeight: "bold",
    },
    {
      src: "/fonts/quicksand/Quicksand-Medium.ttf",
      fontWeight: "medium",
    },
    {
      src: "/fonts/quicksand/Quicksand-SemiBold.ttf",
      fontWeight: "semibold",
    },
    {
      src: "/fonts/quicksand/Quicksand-Light.ttf",
      fontWeight: "light",
    },
  ],
});

// Invoice PDF Document component
const InvoicePDF: React.FC<{ data: ZodCreateInvoiceSchema }> = ({ data }) => {
  // Calculate totals
  const subtotal = getSubTotalValue(data);
  const total = getTotalValue(data);

  const themeColor = { color: data.invoiceDetails.theme.baseColor, fontWeight: 500 };

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
              <Text style={styles.detailsTitleWithWidth}>Serial Number</Text>
              <Text style={styles.detailsValue}>{data.invoiceDetails.serialNumber}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsTitleWithWidth}>Date</Text>
              <Text style={styles.detailsValue}>{format(data.invoiceDetails.date, "dd/MM/yyyy")}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsTitleWithWidth}>Due Date</Text>
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
          {data.companyDetails.logo && (
            <View style={styles.flexCenter}>
              <Image style={styles.logo} src={data.companyDetails.logo} />
            </View>
          )}
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
            <Text style={styles.billingName}>{data.clientDetails.name}</Text>
            <Text style={styles.detailsValue}>{data.clientDetails.address.value}</Text>
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
            <Text style={styles.tableHeaderItemName}>Item</Text>
            <Text style={styles.tableHeaderItemQty}>Qty</Text>
            <Text style={styles.tableHeaderItemPrice}>Price</Text>
            <Text style={styles.tableHeaderItemTotal}>Total</Text>
          </View>
          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.itemNameContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.detailsValue}>{item.description}</Text>
              </View>
              <Text style={styles.itemQty}>{item.quantity}</Text>
              <Text style={styles.itemPrice}>{formatCurrencyText(data.invoiceDetails.currency, item.unitPrice)}</Text>
              <Text style={styles.itemTotal}>
                {formatCurrencyText(data.invoiceDetails.currency, item.quantity * item.unitPrice)}
              </Text>
            </View>
          ))}
        </View>
        {/* Invoice meta data and pricing */}
        <View style={styles.metadataPricingContainer}>
          <View style={styles.metadataContainer}>
            {/* Payment Information */}
            {data.metadata.paymentInformation.length && (
              <View style={styles.sectionContainer}>
                <Text style={themeColor}>Payment Information</Text>
                <View style={styles.flexColumnGapSm}>
                  {data.metadata.paymentInformation.map((paymentInformation, index) => {
                    return (
                      <View key={index} style={styles.detailsRow}>
                        <Text style={styles.detailsTitleWithWidth}>{paymentInformation.label}</Text>
                        <Text style={styles.detailsValue}>{paymentInformation.value}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
            {/* Terms and conditions */}
            {data.metadata.terms.value && (
              <View style={styles.sectionContainer}>
                <Text style={themeColor}>Terms</Text>
                <Text style={styles.metadataDescription}>{data.metadata.terms.value}</Text>
              </View>
            )}
            {/* Notes */}
            {data.metadata.notes.value && (
              <View style={styles.sectionContainer}>
                <Text style={themeColor}>Notes</Text>
                <Text style={styles.metadataDescription}>{data.metadata.notes.value}</Text>
              </View>
            )}
          </View>
          {/* Pricing  */}
          <View style={styles.pricingContainer}>
            {/* Signature */}
            {data.companyDetails.signature && (
              <View style={styles.signatureContainer}>
                <Text style={styles.signatureName}>Verified by {data.companyDetails.name}</Text>
                <Image style={styles.signatureImage} src={data.companyDetails.signature} />
              </View>
            )}
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Subtotal</Text>
              <Text style={styles.pricingValue}>{formatCurrencyText(data.invoiceDetails.currency, subtotal)}</Text>
            </View>
            {data.invoiceDetails.billingDetails.map((billingDetail, index) => {
              return (
                <View key={index} style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>{billingDetail.label}</Text>
                  <Text style={styles.pricingValue}>
                    {formatCurrencyText(data.invoiceDetails.currency, billingDetail.value)}
                  </Text>
                </View>
              );
            })}
            <View style={styles.hr}></View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingTotal}>Total</Text>
              <Text style={styles.pricingTotalValue}>{formatCurrencyText(data.invoiceDetails.currency, total)}</Text>
            </View>
            <View style={styles.totalWordsContainer}>
              <Text style={styles.totalWordsLabel}>Invoice Total (in words)</Text>
              <Text style={styles.totalWordsValue}>{toWords(total)}</Text>
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
    fontFamily: "Quicksand",
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
    fontFamily: "GeistMono",
    letterSpacing: -1,
  },
  logo: {
    width: 80,
    height: 80,
    aspectRatio: 1,
    borderRadius: 8,
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
  tableHeaderItemName: { width: "60%" },
  tableHeaderItemQty: { width: "10%", textAlign: "center" },
  tableHeaderItemPrice: { width: "15%", textAlign: "right" },
  tableHeaderItemTotal: { width: "15%", textAlign: "right" },
  itemName: { width: "60%" },
  itemQty: { width: "10%", textAlign: "center", fontFamily: "GeistMono", letterSpacing: -1, fontWeight: "light" },
  itemPrice: { width: "15%", textAlign: "right", fontFamily: "GeistMono", letterSpacing: -1, fontWeight: "light" },
  itemTotal: { width: "15%", textAlign: "right", fontFamily: "GeistMono", letterSpacing: -1, fontWeight: "light" },

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
  signatureContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    width: "100%",
  },
  signatureName: {
    fontSize: 8,
    fontWeight: "normal",
    color: "#71717B",
  },
  signatureImage: {
    height: 80,
    width: 80,
    aspectRatio: 1,
    borderRadius: 8,
    objectFit: "cover",
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
    fontFamily: "GeistMono",
    letterSpacing: -1,
    color: "#71717B",
  },
  pricingTotal: {
    fontSize: 12,
    fontWeight: "semibold",
  },
  pricingTotalValue: {
    fontSize: 18,
    fontWeight: "semibold",
    fontFamily: "GeistMono",
    letterSpacing: -1,
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

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
            <Text style={{ color: data.invoiceDetails.theme.baseColor, fontWeight: "semibold" }}>
              Invoice {data.invoiceDetails.prefix}
              {data.invoiceDetails.serialNumber}
            </Text>
          </View>
        </View>
        <View style={styles.invoiceDetailsAndLogoContainer}>
          {/* Invoice Details */}
          <View style={styles.invoiceDetailsContainer}>
            <View style={styles.invoiceDetailsRow}>
              <Text style={{ minWidth: 100, ...styles.invoiceDetailsTitle }}>Invoice Number</Text>
              <Text style={styles.invoiceDetailsValue}>{data.invoiceDetails.serialNumber}</Text>
            </View>
            <View style={styles.invoiceDetailsRow}>
              <Text style={{ minWidth: 100, ...styles.invoiceDetailsTitle }}>Invoice Date</Text>
              <Text style={styles.invoiceDetailsValue}>{format(data.invoiceDetails.date, "dd/MM/yyyy")}</Text>
            </View>
            <View style={styles.invoiceDetailsRow}>
              <Text style={{ minWidth: 100, ...styles.invoiceDetailsTitle }}>Invoice Due Date</Text>
              <Text style={styles.invoiceDetailsValue}>{format(data.invoiceDetails.dueDate, "dd/MM/yyyy")}</Text>
            </View>
            <View style={styles.invoiceDetailsRow}>
              <Text style={{ minWidth: 100, ...styles.invoiceDetailsTitle }}>Payment Terms</Text>
              <Text style={styles.invoiceDetailsValue}>{data.invoiceDetails.paymentTerms}</Text>
            </View>
            <View style={styles.invoiceDetailsRow}>
              <Text style={{ minWidth: 100, ...styles.invoiceDetailsTitle }}>Currency</Text>
              <Text style={styles.invoiceDetailsValue}>{data.invoiceDetails.currency}</Text>
            </View>
          </View>
          {/* Invoice Logo */}
          <View style={styles.invoiceLogoContainer}>
            <Image style={styles.invoiceLogo} src={"/official/logo-icon.png"} />
          </View>
        </View>
        {/* Invoice billing details */}
        <View style={styles.invoiceBillingDetailsContainer}>
          <View style={styles.invoiceBillingContainer}>
            <Text style={{ color: data.invoiceDetails.theme.baseColor, fontWeight: "semibold" }}>Billed By</Text>
            <Text style={styles.invoiceBillingName}>{data.companyDetails.name}</Text>
            <Text style={styles.invoiceBillingAddress}>{data.companyDetails.address.value}</Text>
            {data.companyDetails.metadata.map((metadata) => (
              <View key={metadata.label} style={styles.invoiceDetailsRow}>
                <Text style={styles.invoiceDetailsTitle}>{metadata.label}</Text>
                <Text style={styles.invoiceDetailsValue}>{metadata.value}</Text>
              </View>
            ))}
          </View>
          <View style={styles.invoiceBillingContainer}>
            <Text style={{ color: data.invoiceDetails.theme.baseColor, fontWeight: "semibold" }}>Billed To</Text>
            <Text style={styles.invoiceBillingName}>{data.companyDetails.name}</Text>
            <Text style={styles.invoiceBillingAddress}>{data.companyDetails.address.value}</Text>
            {data.clientDetails.metadata.map((metadata) => (
              <View key={metadata.label} style={styles.invoiceDetailsRow}>
                <Text style={styles.invoiceDetailsTitle}>{metadata.label}</Text>
                <Text style={styles.invoiceDetailsValue}>{metadata.value}</Text>
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
                <Text style={styles.invoiceDetailsValue}>{item.description}</Text>
              </View>
              <Text style={styles.itemQty}>{item.quantity}</Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={styles.itemTotal}>{formatCurrency(item.quantity * item.unitPrice)}</Text>
            </View>
          ))}
        </View>
        {/* Invoice meta data and pricing */}
        <View style={styles.invoiceMetaDataAndPricingContainer}>
          <View style={styles.invoiceMetaDataContainer}>
            {/* Payment Information */}
            {data.metadata.paymentInformation.length > 0 && (
              <View style={styles.invoicePaymentInformationContainer}>
                <Text style={{ color: data.invoiceDetails.theme.baseColor, fontWeight: "semibold" }}>
                  Payment Information
                </Text>
                <View style={styles.invoicePaymentInformationColumnContainer}>
                  {data.metadata.paymentInformation.map((paymentInformation) => (
                    <View key={paymentInformation.label} style={styles.invoiceDetailsRow}>
                      <Text style={{ minWidth: 100, ...styles.invoiceDetailsTitle }}>{paymentInformation.label}</Text>
                      <Text style={styles.invoiceDetailsValue}>{paymentInformation.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            {/* Terms and conditions */}
            {data.metadata.terms.value ? (
              <View style={styles.invoiceTermsAndConditionsContainer}>
                <Text style={{ color: data.invoiceDetails.theme.baseColor, fontWeight: "semibold" }}>Terms</Text>
                <Text style={styles.invoiceMetaDataDescription}>{data.metadata.terms.value}</Text>
              </View>
            ) : null}

            {/* Notes */}
            {data.metadata.notes.value ? (
              <View style={styles.invoiceNotesContainer}>
                <Text style={{ color: data.invoiceDetails.theme.baseColor, fontWeight: "semibold" }}>Notes</Text>
                <Text style={styles.invoiceMetaDataDescription}>{data.metadata.notes.value}</Text>
              </View>
            ) : null}
          </View>
          {/* Pricing  */}
          <View style={styles.invoicePricingContainer}>
            <View style={styles.invoicePricingRow}>
              <Text style={styles.invoicePricingRowTitle}>Subtotal</Text>
              <Text style={styles.invoicePricingRowValue}>{formatCurrency(subtotal)}</Text>
            </View>
            {data.invoiceDetails.billingDetails.map((billingDetail) => (
              <View key={billingDetail.label} style={styles.invoicePricingRow}>
                <Text style={styles.invoicePricingRowTitle}>{billingDetail.label}</Text>
                <Text style={styles.invoicePricingRowValue}>{formatCurrency(billingDetail.value)}</Text>
              </View>
            ))}
            <View style={styles.hr}></View>
            <View style={styles.invoicePricingRow}>
              <Text style={styles.invoicePricingTotal}>Total</Text>
              <Text style={styles.invoicePricingTotalValue}>{formatCurrency(total)}</Text>
            </View>
            <View style={styles.invoicePricingTotalWordsContainer}>
              <Text style={styles.invoicePricingTotalWords}>Invoice Total (in words)</Text>
              <Text style={styles.invoicePricingTotalWordsValue}>
                Fourty-five thousand, four hundred and fifty-four
              </Text>
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
  invoicePaymentInformationColumnContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginTop: 4,
  },
  invoicePaymentInformationContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    paddingRight: 10,
  },
  invoicePaymentInformationTitle: {
    fontSize: 10,
    fontWeight: "semibold",
  },
  invoiceMetaDataContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    justifyContent: "flex-end",
    width: "50%",
  },
  invoiceMetaDataDescription: {
    fontSize: 10,
    fontWeight: "normal",
    color: "#71717B",
    marginTop: 4,
  },
  invoiceTermsAndConditionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    width: "50%",
    paddingRight: 10,
  },
  invoiceNotesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    width: "50%",
    paddingRight: 10,
  },
  invoiceMetaDataAndPricingContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 50,
  },
  invoicePricingTotalWordsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginTop: 4,
  },
  invoicePricingTotalWords: {
    fontSize: 8,
    fontWeight: "normal",
    color: "#71717B",
  },
  invoicePricingTotalWordsValue: {
    fontSize: 10,
    fontWeight: "normal",
  },
  invoicePricingTotal: {
    fontSize: 12,
    fontWeight: "semibold",
  },
  invoicePricingTotalValue: {
    fontSize: 18,
    fontWeight: "semibold",
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 5,
    marginBottom: 5,
  },
  invoicePricingContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 10,
    width: "50%",
    minWidth: "50%",
    justifyContent: "flex-end",
  },
  invoicePricingRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  invoicePricingRowTitle: {
    fontSize: 10,
    fontWeight: "semibold",
  },
  invoicePricingRowValue: {
    fontSize: 10,
  },
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Roboto",
    backgroundColor: "white",
  },
  section: {
    marginBottom: 10,
  },
  header: {
    display: "flex",
    flexDirection: "row",
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "semibold",
  },
  invoiceDetailsAndLogoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  invoiceDetailsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  invoiceDetailsRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  invoiceDetailsTitle: {
    fontSize: 10,
    fontWeight: 600,
  },
  invoiceDetailsValue: {
    fontSize: 10,
    fontWeight: "normal",
    color: "#71717B",
  },
  invoiceLogoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  invoiceLogo: {
    width: 80,
    height: 80,
    aspectRatio: 1,
  },
  invoiceBillingDetailsContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 18,
    width: "100%",
    gap: 10,
  },
  invoiceBillingContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 10,
    backgroundColor: "#f0f0f0",
    width: "50%",
    borderRadius: 4,
  },
  invoiceBillingName: {
    fontSize: 10,
    fontWeight: "semibold",
  },
  invoiceBillingAddress: {
    fontSize: 10,
    fontWeight: "normal",
    color: "#71717B",
  },
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
});

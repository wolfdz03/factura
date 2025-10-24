/* eslint-disable jsx-a11y/alt-text */
"use client";

import { GEIST_MONO_FONT, JETBRAINS_MONO_FONT, QUICKSAND_FONT } from "@/constants/pdf-fonts";
import { DM_SANS_FONT } from "@/constants/dm-sans-font";
import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { Document, Page, Text, View, Image, Font } from "@react-pdf/renderer";
import { getSubTotalValue, getTotalValue, getItemTtcAmount, getTotalVatAmount } from "@/constants/pdf-helpers";
import { formatCurrencyText } from "@/constants/currency";
import { createTw } from "react-pdf-tailwind";
import { currencyToFrenchWords } from "@/lib/french-number-to-words";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import React from "react";

// Register fonts
Font.register({
  family: "GeistMono",
  fonts: GEIST_MONO_FONT,
});

Font.register({
  family: "Quicksand",
  fonts: QUICKSAND_FONT,
});

Font.register({
  family: "JetBrainsMono",
  fonts: JETBRAINS_MONO_FONT,
});

Font.register({
  family: "DMSans",
  fonts: DM_SANS_FONT,
});

Font.register({
  family: "Instrument",
  src: "/fonts/instrument-serif/InstrumentSerif-Regular.ttf",
});

const tw = createTw({
  theme: {
    fontFamily: {
      default: ["DMSans"],
      geistmono: ["GeistMono"],
      jetbrainsmono: ["JetBrainsMono"],
      dmsans: ["DMSans"],
      instrument: ["Instrument"],
    },
    extend: {
      colors: {
        darkmode: "#181818",
      },
      fontSize: {
        "2xs": "0.625rem",
        "3xs": "0.5rem",
      },
    },
  },
});

// Invoice PDF Document component
const DefaultPDF: React.FC<{ data: ZodCreateInvoiceSchema }> = ({ data }) => {
  const darkMode = data.invoiceDetails.theme.mode === "dark";
  // Calculate totals
  const subtotal = getSubTotalValue(data);
  const total = getTotalValue(data);

  return (
    <Document
      title={`Facture-${data.invoiceDetails.prefix}${data.invoiceDetails.serialNumber}`}
      author={data.companyDetails.name}
      creator={data.companyDetails.name}
      producer="Invoicely"
    >
      <Page
        size="A4"
        style={tw(cn("font-default text-sm", darkMode ? "text-white bg-darkmode" : "text-black bg-white"))}
      >
        {/* Header Image - Full width, no padding */}
        <View style={tw("w-full h-[140px]")}>
          <Image
            style={{
              width: "100%",
              height: "140px",
              objectFit: "cover",
            }}
            src="https://res.cloudinary.com/doi3l0cvh/image/upload/f_png/v1760919592/header_dfwmls.png"
          />
        </View>
        {/* Content with padding */}
        <View style={tw("p-6 pb-20")}>
        <View style={tw("flex flex-row justify-center mb-2")}>
          <View style={tw("text-3xl font-bold font-dmsans")}>
            <Text style={tw("text-black font-dmsans font-bold")}>
              FACTURE
            </Text>
          </View>
        </View>
        <View style={tw("flex flex-row justify-between mb-1")}>
          {/* Invoice Details */}
          <View style={tw("flex flex-col gap-1")}>
            <View style={tw("flex flex-row items-center gap-1")}>
              <Text style={tw("text-2xs font-semibold min-w-[100px]")}>Numéro de facture</Text>
              <Text style={tw("text-2xs font-normal text-neutral-500")}>
                {data.invoiceDetails.prefix}
                {data.invoiceDetails.serialNumber}
              </Text>
            </View>
            <View style={tw("flex flex-row items-center gap-1")}>
              <Text style={tw("text-2xs font-semibold min-w-[100px]")}>Date</Text>
              <Text style={tw("text-2xs font-normal text-neutral-500")}>
                {format(data.invoiceDetails.date, "dd/MM/yyyy")}
              </Text>
            </View>
            {data.invoiceDetails.dueDate && (
              <View style={tw("flex flex-row items-center gap-1")}>
                <Text style={tw("text-2xs font-semibold min-w-[100px]")}>Date d&apos;échéance</Text>
                <Text style={tw("text-2xs font-normal text-neutral-500")}>
                  {format(data.invoiceDetails.dueDate, "dd/MM/yyyy")}
                </Text>
              </View>
            )}
          </View>
        </View>
        {/* Invoice billing details */}
        <View style={tw("flex flex-row mt-1 w-full gap-2.5")}>
          <View
            style={tw(cn("flex flex-col gap-1.5 p-2.5 w-1/2 rounded", darkMode ? "bg-neutral-800" : "bg-neutral-100"))}
          >
            <Text
              style={tw(cn("font-semibold", darkMode ? "text-white" : `text-[${data.invoiceDetails.theme.baseColor}]`))}
            >
              Facturé par
            </Text>
            <Text style={tw("text-2xs font-semibold")}>{data.companyDetails.name}</Text>
            <Text style={tw("text-2xs font-normal text-neutral-500")}>{data.companyDetails.address}</Text>
            {data.companyDetails.legalForm && (
              <Text style={tw("text-2xs font-normal text-neutral-500")}>{data.companyDetails.legalForm}</Text>
            )}
            {data.companyDetails.rcs && (
              <Text style={tw("text-2xs font-normal text-neutral-500")}>{data.companyDetails.rcs}</Text>
            )}
            {data.companyDetails.metadata.map((metadata) => (
              <View key={metadata.label} style={tw("flex flex-row items-center gap-1")}>
                <Text style={tw("text-2xs font-semibold")}>{metadata.label}</Text>
                <Text style={tw("text-2xs font-normal text-neutral-500")}>{metadata.value}</Text>
              </View>
            ))}
          </View>
          <View
            style={tw(cn("flex flex-col gap-1.5 p-2.5 w-1/2 rounded", darkMode ? "bg-neutral-800" : "bg-neutral-100"))}
          >
            <Text
              style={tw(cn("font-semibold", darkMode ? "text-white" : `text-[${data.invoiceDetails.theme.baseColor}]`))}
            >
              Facturé à
            </Text>
            <Text style={tw("text-2xs font-semibold")}>{data.clientDetails.name}</Text>
            <Text style={tw("text-2xs font-normal text-neutral-500")}>{data.clientDetails.address}</Text>
            {data.clientDetails.siret && (
              <Text style={tw("text-2xs font-normal text-neutral-500")}>SIRET: {data.clientDetails.siret}</Text>
            )}
            {data.clientDetails.tva && (
              <Text style={tw("text-2xs font-normal text-neutral-500")}>TVA: {data.clientDetails.tva}</Text>
            )}
            {data.clientDetails.metadata.map((metadata) => (
              <View key={metadata.label} style={tw("flex flex-row items-center gap-1")}>
                <Text style={tw("text-2xs font-semibold")}>{metadata.label}</Text>
                <Text style={tw("text-2xs font-normal text-neutral-500")}>{metadata.value}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Items Table */}
        <View style={tw("mt-8 grow")}>
          <View
            style={[
              tw(
                cn(
                  "flex-row flex items-center px-2.5 pt-2.5 pb-1.5 font-bold text-2xs rounded text-white",
                  darkMode ? "bg-neutral-700" : `bg-[${data.invoiceDetails.theme.baseColor}]`,
                ),
              ),
            ]}
          >
            <Text style={tw("w-[30%]")}>Description</Text>
            <Text style={tw("w-[8%] text-center")}>Qté</Text>
            <Text style={tw("w-[12%] text-right")}>Prix unitaire HT</Text>
            <Text style={tw("w-[8%] text-center")}>Taux TVA</Text>
            <Text style={tw("w-[12%] text-right")}>Montant HT</Text>
            <Text style={tw("w-[17%] text-right")}>Montant TTC</Text>
          </View>
          <View style={tw("flex flex-col mt-1")}>
            {/* Render categorized items */}
            {data.itemCategories.map((category, categoryIndex) => (
              <View key={category.id || `category-${categoryIndex}`} style={tw("mb-4")}>
                {/* Category Header */}
                <View style={tw("bg-gray-100 p-3 rounded-t")}>
                  <Text style={tw("text-sm font-bold text-gray-800")} wrap={true}>
                    {category.name}
                  </Text>
                  {category.description && (
                    <Text style={tw("text-xs text-gray-600 mt-1")} wrap={true}>
                      {category.description}
                    </Text>
                  )}
                </View>
                
                {/* Items in this category */}
                <View style={tw("border border-gray-200 rounded-b")}>
                  {data.items
                    .filter(item => {
                      // Try multiple matching strategies
                      const matchesById = item.categoryId === category.id;
                      const matchesByName = item.categoryId === category.name;
                      
                      // If category has no ID but items have categoryId, match by position
                      const categoryIndex = data.itemCategories.indexOf(category);
                      const hasItemsWithCategoryId = data.items.some(item => item.categoryId);
                      
                      // If this is the first category and it has no ID, but items have categoryId, match them
                      const isFirstCategoryWithoutId = !category.id && categoryIndex === 0 && hasItemsWithCategoryId;
                      
                      // Also check if any category has the same ID as the item's categoryId
                      const categoryExistsWithItemId = data.itemCategories.some(cat => cat.id === item.categoryId);
                      const matchesByExistingCategory = !category.id && !categoryExistsWithItemId && categoryIndex === 0;
                      
                      // Return true if any match is found
                      return matchesById || matchesByName || isFirstCategoryWithoutId || matchesByExistingCategory;
                    })
                    .map((item, itemIndex) => (
                      <View
                        key={item.id || `category-${category.id}-item-${itemIndex}`}
                        style={tw(
                          cn(
                            "flex-row p-2 text-2xs",
                            itemIndex % 2 === 0
                              ? darkMode
                                ? "bg-darkmode"
                                : "bg-white"
                              : darkMode
                                ? "bg-neutral-800"
                                : "bg-neutral-100",
                          ),
                        )}
                      >
                        <View style={tw("flex flex-col w-[30%]")}>
                          <Text style={tw("w-full text-sm font-semibold")} wrap={true}>{item.name}</Text>
                          <Text style={tw("text-xs font-normal text-neutral-600")} wrap={true}>{item.description}</Text>
                        </View>
                        <Text style={tw("w-[8%] text-sm text-center font-geistmono tracking-tighter")}>
                          {item.quantity}
                        </Text>
                        <Text style={tw("w-[12%] text-sm text-right font-geistmono tracking-tighter")}>
                          {formatCurrencyText(data.invoiceDetails.currency, item.unitPrice)}
                        </Text>
                        <Text style={tw("w-[8%] text-sm text-center font-geistmono tracking-tighter")}>
                          {item.isVatExempt ? "N/A" : `${item.vatRate || data.invoiceDetails.vatRate || 20}%`}
                        </Text>
                        <Text style={tw("w-[12%] text-sm text-right font-geistmono tracking-tighter")}>
                          {formatCurrencyText(data.invoiceDetails.currency, item.quantity * item.unitPrice)}
                        </Text>
                        <Text style={tw("w-[17%] text-sm text-right font-geistmono tracking-tighter")}>
                          {formatCurrencyText(data.invoiceDetails.currency, 
                            getItemTtcAmount(item, data.invoiceDetails.vatRate || 20)
                          )}
                        </Text>
                      </View>
                    ))}
                  {data.items.filter(item => {
                      const matchesById = item.categoryId === category.id;
                      const matchesByName = item.categoryId === category.name;
                      const matchesByIndex = data.itemCategories.indexOf(category) === data.itemCategories.findIndex(cat => cat.id === item.categoryId);
                      return matchesById || matchesByName || matchesByIndex;
                    }).length === 0 && (
                    <View style={tw("p-4 text-center")}>
                      <Text style={tw("text-xs text-gray-500")}>Aucun article dans cette catégorie</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}

            {/* Render standalone items */}
            {data.items
              .filter(item => !item.categoryId)
              .map((item, index) => (
                <View
                  key={item.id || `standalone-item-${index}`}
                  style={tw(
                    cn(
                      "flex-row p-2 text-2xs rounded",
                      index % 2 === 0
                        ? darkMode
                          ? "bg-darkmode"
                          : "bg-white"
                        : darkMode
                          ? "bg-neutral-800"
                          : "bg-neutral-100",
                    ),
                  )}
                >
                  <View style={tw("flex flex-col w-[35%]")}>
                    <Text style={tw("w-full text-sm font-semibold")} wrap={true}>{item.name}</Text>
                    <Text style={tw("text-xs font-normal text-neutral-600")} wrap={true}>{item.description}</Text>
                  </View>
                  <Text style={tw("w-[8%] text-sm text-center font-geistmono tracking-tighter")}>{item.quantity}</Text>
                  <Text style={tw("w-[12%] text-sm text-right font-geistmono tracking-tighter")}>
                    {formatCurrencyText(data.invoiceDetails.currency, item.unitPrice)}
                  </Text>
                  <Text style={tw("w-[8%] text-sm text-center font-geistmono tracking-tighter")}>
                    {item.isVatExempt ? "N/A" : `${item.vatRate || data.invoiceDetails.vatRate || 20}%`}
                  </Text>
                  <Text style={tw("w-[12%] text-sm text-right font-geistmono tracking-tighter")}>
                    {formatCurrencyText(data.invoiceDetails.currency, item.quantity * item.unitPrice)}
                  </Text>
                  <Text style={tw("w-[12%] text-sm text-right font-geistmono tracking-tighter")}>
                    {formatCurrencyText(data.invoiceDetails.currency, 
                      getItemTtcAmount(item, data.invoiceDetails.vatRate || 20)
                    )}
                  </Text>
                </View>
              ))}
          </View>
        </View>
        
        {/* Spacing between articles and totals */}
        <View style={tw("h-8")}></View>
        
        {/* Invoice meta data and pricing */}
        <View style={tw("flex flex-row gap-[50px]")}>
          <View style={tw("flex flex-col gap-[15px] justify-end w-1/2")}>
            {/* Terms and conditions */}
            {data.metadata.terms && (
              <View style={tw("flex flex-col gap-0.5 pr-2.5")}>
                <Text
                  style={tw(
                    cn("font-semibold", darkMode ? "text-white" : `text-[${data.invoiceDetails.theme.baseColor}]`),
                  )}
                >
                  Terms
                </Text>
                <Text style={tw("text-2xs font-normal text-neutral-500 mt-1")}>{data.metadata.terms}</Text>
              </View>
            )}
            {/* Notes */}
            {data.metadata.notes && (
              <View style={tw("flex flex-col gap-0.5 pr-2.5")}>
                <Text
                  style={tw(
                    cn("font-semibold", darkMode ? "text-white" : `text-[${data.invoiceDetails.theme.baseColor}]`),
                  )}
                >
                  Notes
                </Text>
                <Text style={tw("text-2xs font-normal text-neutral-500 mt-1")}>{data.metadata.notes}</Text>
              </View>
            )}
          </View>
          {/* Pricing  */}
          <View style={tw("flex flex-col gap-1 p-2.5 w-1/2 min-w-[50%] justify-end")}>
            <View style={tw("flex flex-row items-center justify-between")}>
              <Text style={tw("text-2xs font-semibold")}>Sous-total HT</Text>
              <Text style={tw("text-2xs font-geistmono tracking-tight text-neutral-500")}>
                {formatCurrencyText(data.invoiceDetails.currency, subtotal)}
              </Text>
            </View>
            {!data.invoiceDetails.isVatExempt && (
              <View style={tw("flex flex-row items-center justify-between")}>
                <Text style={tw("text-2xs font-semibold")}>TVA ({data.invoiceDetails.vatRate || 20}%)</Text>
                <Text style={tw("text-2xs font-geistmono tracking-tight text-neutral-500")}>
                  {formatCurrencyText(data.invoiceDetails.currency, subtotal * (data.invoiceDetails.vatRate || 20) / 100)}
                </Text>
              </View>
            )}
            {data.invoiceDetails.isVatExempt && (
              <View style={tw("flex flex-row items-center justify-between")}>
                <Text style={tw("text-2xs font-semibold")}>TVA</Text>
                <Text style={tw("text-2xs font-geistmono tracking-tight text-neutral-500")}>
                  TVA non applicable, art. 293 B du CGI
                </Text>
              </View>
            )}
            {/* Billing Details */}
            {data.invoiceDetails.billingDetails.map((billingDetail, index) => {
              if (billingDetail.type === "percentage") {
                return (
                  <View key={`billing-${billingDetail.label}-${index}`} style={tw("flex flex-row items-center justify-between")}>
                    <Text style={tw("text-2xs font-semibold")}>{billingDetail.label}</Text>
                    <Text style={tw("text-2xs font-geistmono tracking-tight text-neutral-500")}>
                      {billingDetail.value} %
                    </Text>
                  </View>
                );
              }

              return (
                <View key={`billing-${billingDetail.label}-${index}`} style={tw("flex flex-row items-center justify-between")}>
                  <Text style={tw("text-2xs font-semibold")}>{billingDetail.label}</Text>
                  <Text style={tw("text-2xs font-geistmono tracking-tight text-neutral-500")}>
                    {formatCurrencyText(data.invoiceDetails.currency, billingDetail.value)}
                  </Text>
                </View>
              );
            })}
            <View
              style={tw(cn("border-b mt-1.5 mb-1.5", darkMode ? "border-neutral-800" : "border-neutral-200"))}
            ></View>
            <View style={tw("flex flex-row items-center justify-between")}>
              <Text style={tw("text-xs font-semibold")}>Total TTC</Text>
              <Text style={tw("text-lg font-geistmono tracking-tight")}>
                {formatCurrencyText(data.invoiceDetails.currency, total)}
              </Text>
            </View>
            <View style={tw("flex flex-col gap-0.5 mt-1")}>
              <Text style={tw("text-3xs font-normal text-neutral-500")}>Total de la facture (en toutes lettres)</Text>
              <Text style={tw("text-2xs font-normal")}>{currencyToFrenchWords(total, data.invoiceDetails.currency)}</Text>
            </View>
          </View>
        </View>
        </View>
        
        {/* Payment Information - Positioned very close to footer */}
        {data.metadata.paymentInformation.length > 0 && (
          <View style={tw("absolute bottom-16 left-0 right-0 flex flex-col gap-2 px-6")}>
            <Text
              style={tw(
                cn("text-sm font-semibold", darkMode ? "text-white" : `text-[${data.invoiceDetails.theme.baseColor}]`),
              )}
            >
              Informations de paiement
            </Text>
            <View style={tw("flex flex-col gap-1")}>
              {data.metadata.paymentInformation.map((paymentInformation, index) => {
                return (
                  <View key={`payment-${paymentInformation.label}-${index}`} style={tw("flex flex-row items-center gap-2")}>
                    <Text style={tw("text-xs font-semibold min-w-[100px]")}>{paymentInformation.label}:</Text>
                    <Text style={tw("text-xs font-normal text-neutral-500")}>
                      {paymentInformation.value}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
        
        {/* Green Footer Strip - Positioned at bottom of page */}
        <View style={tw("absolute bottom-0 left-0 right-0 w-full h-12 bg-[#005e56] flex flex-row items-center justify-center px-6")}>
          <View style={tw("flex flex-row items-center gap-8")}>
            {/* Phone */}
            <View style={tw("flex flex-row items-center gap-2")}>
              <View style={tw("w-1 h-1 bg-white rounded-full")} />
              <Text style={tw("text-white text-xs font-medium")}>+33 4 51 42 22 03</Text>
            </View>
            
            {/* Website */}
            <View style={tw("flex flex-row items-center gap-2")}>
              <View style={tw("w-1 h-1 bg-white rounded-full")} />
              <Text style={tw("text-white text-xs font-medium underline")}>www.suzaliconseil.com</Text>
            </View>
            
            {/* SIRET */}
            <View style={tw("flex flex-row items-center gap-2")}>
              <View style={tw("w-1 h-1 bg-white rounded-full")} />
              <Text style={tw("text-white text-xs font-medium")}>SIRET: 992 281 097 00012</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default DefaultPDF;

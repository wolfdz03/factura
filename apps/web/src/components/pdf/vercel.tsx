/* eslint-disable jsx-a11y/alt-text */
"use client";

import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { Document, Page, Text, View, Image, Font } from "@react-pdf/renderer";
import { getSubTotalValue, getTotalValue, getItemTtcAmount, getTotalVatAmount } from "@/constants/pdf-helpers";
import { GEIST_FONT, GEIST_MONO_FONT } from "@/constants/pdf-fonts";
import { DM_SANS_FONT } from "@/constants/dm-sans-font";
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
  family: "Geist",
  fonts: GEIST_FONT,
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
      dmsans: ["DMSans"],
    },
    extend: {
      colors: {
        background: "#0A0A0A",
        borderColor: "#1c1c1c",
      },
      fontSize: {
        "2xs": "0.625rem",
        "3xs": "0.5rem",
      },
    },
  },
});

// Invoice PDF Document component
const VercelPdf: React.FC<{ data: ZodCreateInvoiceSchema }> = ({ data }) => {
  const subtotal = getSubTotalValue(data);
  const total = getTotalValue(data);

  return (
    <Document
      title={`Facture-${data.invoiceDetails.prefix}${data.invoiceDetails.serialNumber}`}
      author={data.companyDetails.name}
      creator={data.companyDetails.name}
      producer="Invoicely"
    >
      <Page size="A4" style={tw(cn("font-default text-sm text-black bg-background border border-borderColor"))}>
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
        <View style={tw("p-4 pb-20")}>
        <View style={tw("flex flex-row justify-center border-b border-borderColor p-4 mb-2")}>
          <View style={tw("text-3xl font-bold font-dmsans")}>
            <Text style={tw("text-black font-dmsans font-bold")}>
              FACTURE
            </Text>
          </View>
        </View>
        <View style={tw("flex flex-row justify-between border-b border-borderColor mb-2")}>
          {/* Invoice Details */}
          <View style={tw("flex flex-col gap-1 p-4 pr-8 border-r border-borderColor")}>
            <View style={tw("flex flex-row items-center gap-1")}>
              <Text style={tw("text-2xs min-w-[100px] text-neutral-700")}>Numéro de facture</Text>
              <Text style={tw("text-2xs font-normal text-neutral-300")}>
                {data.invoiceDetails.prefix}
                {data.invoiceDetails.serialNumber}
              </Text>
            </View>
            <View style={tw("flex flex-row items-center gap-1")}>
              <Text style={tw("text-2xs min-w-[100px] text-neutral-700")}>Date</Text>
              <Text style={tw("text-2xs font-normal text-neutral-300")}>
                {format(data.invoiceDetails.date, "dd/MM/yyyy")}
              </Text>
            </View>
            {data.invoiceDetails.dueDate && (
              <View style={tw("flex flex-row items-center gap-1")}>
                <Text style={tw("text-2xs min-w-[100px] text-neutral-700")}>Date d&apos;échéance</Text>
                <Text style={tw("text-2xs font-normal text-neutral-300")}>
                  {format(data.invoiceDetails.dueDate, "dd/MM/yyyy")}
                </Text>
              </View>
            )}
          </View>
        </View>
        {/* Invoice billing details */}
        <View style={tw("flex flex-row w-full gap-2.5 border-b border-borderColor mt-1")}>
          <View style={tw(cn("flex flex-col gap-1.5 p-4 w-1/2"))}>
            <Text style={tw(cn("text-neutral-600"))}>Facturé par</Text>
            <Text style={tw("text-sm text-neutral-100")}>{data.companyDetails.name}</Text>
            <Text style={tw("text-2xs font-normal text-neutral-400")}>{data.companyDetails.address}</Text>
            {data.companyDetails.legalForm && (
              <Text style={tw("text-2xs font-normal text-neutral-400")}>{data.companyDetails.legalForm}</Text>
            )}
            {data.companyDetails.rcs && (
              <Text style={tw("text-2xs font-normal text-neutral-400")}>{data.companyDetails.rcs}</Text>
            )}
            {data.companyDetails.metadata.map((metadata) => (
              <View key={metadata.label} style={tw("flex flex-row items-center gap-1")}>
                <Text style={tw("text-2xs text-neutral-600")}>{metadata.label}</Text>
                <Text style={tw("text-2xs font-normal text-neutral-400")}>{metadata.value}</Text>
              </View>
            ))}
          </View>
          <View style={tw(cn("flex flex-col gap-1.5 p-4 w-1/2 border-l border-borderColor"))}>
            <Text style={tw(cn("text-neutral-600"))}>Facturé à</Text>
            <Text style={tw("text-sm text-neutral-100")}>{data.clientDetails.name}</Text>
            <Text style={tw("text-2xs font-normal text-neutral-400")}>{data.clientDetails.address}</Text>
            {data.clientDetails.metadata.map((metadata) => (
              <View key={metadata.label} style={tw("flex flex-row items-center gap-1")}>
                <Text style={tw("text-2xs leading-[10px] text-neutral-600")}>{metadata.label}</Text>
                <Text style={tw("text-2xs leading-[10px] font-normal text-neutral-400")}>{metadata.value}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Items Table */}
        <View style={tw("mt-8 grow")}>
          <View
            style={[
              tw(cn("flex-row flex items-center px-4 py-2.5 text-sm text-neutral-100 border-b border-borderColor")),
            ]}
          >
            <Text style={tw("w-[30%]")}>Description</Text>
            <Text style={tw("w-[8%] text-center")}>Qté</Text>
            <Text style={tw("w-[12%] text-right")}>Prix unitaire HT</Text>
            <Text style={tw("w-[8%] text-center")}>Taux TVA</Text>
            <Text style={tw("w-[12%] text-right")}>Montant HT</Text>
            <Text style={tw("w-[17%] text-right")}>Montant TTC</Text>
          </View>
          <View style={tw("flex flex-col")}>
            {/* Render categorized items */}
            {data.itemCategories.map((category, categoryIndex) => (
              <View key={category.id} style={tw("mb-4")}>
                {/* Category Header */}
                <View style={tw("bg-[#1a1a1a] px-4 py-3 border-b border-borderColor")}>
                  <Text style={tw("text-sm font-bold text-neutral-100")}>
                    {category.name}
                  </Text>
                  {category.description && (
                    <Text style={tw("text-xs text-neutral-400 mt-1")}>
                      {category.description}
                    </Text>
                  )}
                </View>
                
                {/* Items in this category */}
                {data.items
                  .filter(item => item.categoryId === category.id)
                  .map((item, itemIndex) => (
                    <View
                      key={item.id}
                      style={tw(
                        cn(
                          "flex-row px-4 py-3 text-2xs border-b border-borderColor",
                          itemIndex % 2 === 0 ? "bg-[#111111]" : "bg-background",
                        ),
                      )}
                    >
                      <View style={tw("flex flex-col w-[35%]")}>
                        <Text style={tw("w-full text-xs leading-[12px] text-neutral-100")}>{item.name}</Text>
                        <Text style={tw("text-2xs leading-[10px] mt-1 font-normal text-neutral-700")}>
                          {item.description}
                        </Text>
                      </View>
                      <Text style={tw("w-[8%] text-center font-geistmono tracking-tighter text-neutral-100")}>
                        {item.quantity}
                      </Text>
                      <Text style={tw("w-[12%] text-right font-geistmono tracking-tighter text-neutral-100")}>
                        {formatCurrencyText(data.invoiceDetails.currency, item.unitPrice)}
                      </Text>
                      <Text style={tw("w-[8%] text-center font-geistmono tracking-tighter text-neutral-100")}>
                        {item.isVatExempt ? "N/A" : `${item.vatRate || data.invoiceDetails.vatRate || 20}%`}
                      </Text>
                      <Text style={tw("w-[12%] text-right font-geistmono tracking-tighter text-neutral-100")}>
                        {formatCurrencyText(data.invoiceDetails.currency, item.quantity * item.unitPrice)}
                      </Text>
                      <Text style={tw("w-[12%] text-right font-geistmono tracking-tighter text-neutral-100")}>
                        {formatCurrencyText(data.invoiceDetails.currency, 
                          getItemTtcAmount(item, data.invoiceDetails.vatRate || 20)
                        )}
                      </Text>
                    </View>
                  ))}
              </View>
            ))}

            {/* Render standalone items */}
            {data.items
              .filter(item => !item.categoryId)
              .map((item, index) => (
                <View
                  key={item.id}
                  style={tw(
                    cn(
                      "flex-row px-4 py-3 text-2xs border-b border-borderColor",
                      index % 2 === 0 ? "bg-[#111111]" : "bg-background",
                    ),
                  )}
                >
                  <View style={tw("flex flex-col w-[30%]")}>
                    <Text style={tw("w-full text-xs leading-[12px] text-neutral-100")}>{item.name}</Text>
                    <Text style={tw("text-2xs leading-[10px] mt-1 font-normal text-neutral-700")}>
                      {item.description}
                    </Text>
                  </View>
                  <Text style={tw("w-[8%] text-center font-geistmono tracking-tighter text-neutral-100")}>
                    {item.quantity}
                  </Text>
                  <Text style={tw("w-[12%] text-right font-geistmono tracking-tighter text-neutral-100")}>
                    {formatCurrencyText(data.invoiceDetails.currency, item.unitPrice)}
                  </Text>
                  <Text style={tw("w-[8%] text-center font-geistmono tracking-tighter text-neutral-100")}>
                    {item.isVatExempt ? "N/A" : `${item.vatRate || data.invoiceDetails.vatRate || 20}%`}
                  </Text>
                  <Text style={tw("w-[12%] text-right font-geistmono tracking-tighter text-neutral-100")}>
                    {formatCurrencyText(data.invoiceDetails.currency, item.quantity * item.unitPrice)}
                  </Text>
                  <Text style={tw("w-[17%] text-right font-geistmono tracking-tighter text-neutral-100")}>
                    {formatCurrencyText(data.invoiceDetails.currency, 
                      getItemTtcAmount(item, data.invoiceDetails.vatRate || 20)
                    )}
                  </Text>
                </View>
              ))}
          </View>
        </View>
        {/* Invoice meta data and pricing */}
        <View style={tw("flex flex-row border-t border-borderColor")}>
          <View style={tw("flex flex-col w-1/2 border-r border-borderColor")}>
            {/* Terms and conditions */}
            {data.metadata.terms && (
              <View style={tw("flex flex-col gap-0.5 p-4 border-t border-borderColor")}>
                <Text style={tw(cn("text-white text-sm"))}>Terms</Text>
                <Text style={tw("text-2xs font-normal text-neutral-500 mt-1")}>{data.metadata.terms}</Text>
              </View>
            )}
            {/* Notes */}
            {data.metadata.notes && (
              <View style={tw("flex flex-col gap-0.5 p-4 border-t border-borderColor")}>
                <Text style={tw(cn("text-white text-sm"))}>Notes</Text>
                <Text style={tw("text-2xs font-normal text-neutral-500 mt-1")}>{data.metadata.notes}</Text>
              </View>
            )}
          </View>
          {/* Pricing  */}
          <View style={tw("flex flex-col w-1/2")}>
            <View style={tw("flex flex-col gap-1 p-4")}>
              <View style={tw("flex flex-row items-center justify-between")}>
                <Text style={tw("text-2xs text-neutral-500")}>Sous-total HT</Text>
                <Text style={tw("text-2xs font-geistmono tracking-tight text-neutral-400 leading-[10px]")}>
                  {formatCurrencyText(data.invoiceDetails.currency, subtotal)}
                </Text>
              </View>
              {!data.invoiceDetails.isVatExempt && (
                <View style={tw("flex flex-row items-center justify-between")}>
                  <Text style={tw("text-2xs text-neutral-500")}>TVA ({data.invoiceDetails.vatRate || 20}%)</Text>
                  <Text style={tw("text-2xs font-geistmono tracking-tight text-neutral-400 leading-[10px]")}>
                    {formatCurrencyText(data.invoiceDetails.currency, subtotal * (data.invoiceDetails.vatRate || 20) / 100)}
                  </Text>
                </View>
              )}
              {data.invoiceDetails.isVatExempt && (
                <View style={tw("flex flex-row items-center justify-between")}>
                  <Text style={tw("text-2xs text-neutral-500")}>TVA</Text>
                  <Text style={tw("text-2xs font-geistmono tracking-tight text-neutral-400 leading-[10px]")}>
                    TVA non applicable, art. 293 B du CGI
                  </Text>
                </View>
              )}
              {/* Billing Details */}
              {data.invoiceDetails.billingDetails.map((billingDetail, index) => {
                if (billingDetail.type === "percentage") {
                  return (
                    <View key={index} style={tw("flex flex-row items-center justify-between")}>
                      <Text style={tw("text-2xs text-neutral-500")}>{billingDetail.label}</Text>
                      <Text style={tw("text-2xs font-geistmono tracking-tight text-neutral-400 leading-[10px]")}>
                        {billingDetail.value} %
                      </Text>
                    </View>
                  );
                }

                return (
                  <View key={index} style={tw("flex flex-row items-center justify-between")}>
                    <Text style={tw("text-2xs text-neutral-500")}>{billingDetail.label}</Text>
                    <Text style={tw("text-2xs font-geistmono tracking-tight text-neutral-400 leading-[10px]")}>
                      {formatCurrencyText(data.invoiceDetails.currency, billingDetail.value)}
                    </Text>
                  </View>
                );
              })}
            </View>
            <View style={tw("flex flex-row items-center justify-between border-t border-borderColor p-4")}>
              <Text style={tw("text-xs text-neutral-500")}>Total TTC</Text>
              <Text style={tw("text-lg leading-[16px] font-geistmono tracking-tight text-white")}>
                {formatCurrencyText(data.invoiceDetails.currency, total)}
              </Text>
            </View>
            <View style={tw("flex flex-col gap-0.5 p-4 border-t border-borderColor")}>
              <Text style={tw("text-3xs font-normal text-neutral-500")}>Total de la facture (en toutes lettres)</Text>
              <Text style={tw("text-2xs font-normal text-neutral-300")}>{currencyToFrenchWords(total, data.invoiceDetails.currency)}</Text>
            </View>
          </View>
        </View>
        </View>
        
        {/* Payment Information - Positioned very close to footer */}
        {data.metadata.paymentInformation.length > 0 && (
          <View style={tw("absolute bottom-20 left-0 right-0 flex flex-col gap-2 px-6")}>
            <Text style={tw("text-sm font-semibold text-white")}>
              Informations de paiement
            </Text>
            <View style={tw("flex flex-col gap-1")}>
              {data.metadata.paymentInformation.map((paymentInformation, index) => {
                return (
                  <View key={index} style={tw("flex flex-row items-center gap-2")}>
                    <Text style={tw("text-xs font-semibold text-neutral-300 min-w-[100px]")}>{paymentInformation.label}:</Text>
                    <Text style={tw("text-xs font-normal text-neutral-400")}>
                      {paymentInformation.value}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
        
        {/* Green Footer Strip - Positioned at bottom of page */}
        <View style={tw("absolute bottom-0 left-0 right-0 w-full h-16 bg-[#005e56] flex flex-row items-center justify-center px-6")}>
          <View style={tw("flex flex-row items-center gap-8")}>
            {/* Phone */}
            <View style={tw("flex flex-row items-center gap-2")}>
              <View style={tw("w-1 h-1 bg-white rounded-full")} />
              <Text style={tw("text-white text-xs font-medium")}>+33 1 23 45 67 89</Text>
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

export default VercelPdf;

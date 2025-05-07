import { Metadata, Viewport } from "next";

export const defaultWebsiteViewport: Viewport = {
  themeColor: "#5C57E8",
  maximumScale: 1,
  initialScale: 1,
  width: "device-width",
  userScalable: false,
};

export const defaultWebsiteMetadata: Metadata = {
  title: "Invoicely - Create Beautiful & Professional Invoices",
  description:
    "Invoicely is a simple and easy to use invoice generator where you can create beautiful and professional invoices in minutes. ~ Proudly OSS",
  icons: {
    icon: "/official/invoicely-logo.png",
  },
  openGraph: {
    images: "/official/banner.png",
  },
  keywords: [
    "generate invoice",
    "invoice generator",
    "invoice",
    "invoicely",
    "invoicely.gg",
    "generate beautifull invoices",
    "create invoice",
    "create beautiful invoices",
    "create professional invoices",
    "create invoices",
    "create invoice online",
    "create invoice online free",
    "create invoice online for free",
  ],
};

export interface IGenerateWebsiteMetadata {
  title: string;
  description?: string;
  image?: string;
  keywords?: string[];
}

export const generateWebsiteMetadata = ({
  title,
  description,
  image,
  keywords,
}: IGenerateWebsiteMetadata): Metadata => {
  return {
    ...defaultWebsiteMetadata,
    keywords: [...(defaultWebsiteMetadata.keywords || []), ...(keywords || [])],
    title: title || defaultWebsiteMetadata.title,
    description: description || defaultWebsiteMetadata.description,
    openGraph: {
      images: image || defaultWebsiteMetadata.openGraph?.images,
    },
  };
};

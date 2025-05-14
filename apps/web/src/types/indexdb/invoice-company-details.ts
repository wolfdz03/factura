export interface InvoiceCompanyDetails {
  id: string;
  name: string;
  address?: string;
  image?: string;
  signature?: string;
  metadata?: {
    value: string;
    label: string;
  }[];
}

import { EyeScannerIcon, InboxArrowDownIcon } from "@/assets/icons";
import InvoiceErrorsModal from "./invoice-errors-modal";
import { Button } from "@/components/ui/button";
import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { UseFormReturn } from "react-hook-form";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "../pdf-document";
import { pdfjs } from "react-pdf";
import { useEffect, useState } from "react";

const InvoiceOptions = ({ form }: { form: UseFormReturn<ZodCreateInvoiceSchema> }) => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState<ZodCreateInvoiceSchema>(form.getValues());
  
  // Update form data when dropdown is opened
  useEffect(() => {
    if (isDropdownOpen) {
      setFormData(form.getValues());
    }
  }, [isDropdownOpen, form]);
  
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url,
        ).toString();
      }
    } catch (error) {
      console.error("[ERROR]: Error setting up PDF worker:", error);
    }
  }, []);

  const handlePreview = () => {
    const data = form.getValues();
    
    const previewPdf = async () => {
      const blob = await generatePdfBlob(data);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    };
    
    previewPdf().catch(error => {
      console.error("Error previewing PDF:", error);
    });
  };

  const generatePdfBlob = (data: ZodCreateInvoiceSchema) => {
    return new Promise<Blob>((resolve, reject) => {
      try {
        const pdfDocument = <InvoicePDF data={data} />;
        pdf(pdfDocument)
          .toBlob()
          .then(blob => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to generate PDF"));
            }
          })
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  };

  const convertPdfPageToImage = async (pdfBlob: Blob, scale: number = 2): Promise<Blob> => {
    return new Promise(async (resolve, reject) => {
      try {
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        
        const page = await pdf.getPage(1);
        
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };
        
        await page.render(renderContext).promise;
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }
          URL.revokeObjectURL(pdfUrl);
        }, 'image/png');
      } catch (error) {
        console.error("Error converting PDF to PNG:", error);
        reject(error);
      }
    });
  };

  const downloadFile = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePdfDownload = (data: ZodCreateInvoiceSchema) => async () => {
    try {
      const blob = await generatePdfBlob(data);
      const url = URL.createObjectURL(blob);
      const fileName = `Invoice-${data.invoiceDetails.prefix}${data.invoiceDetails.serialNumber}.pdf`;
      downloadFile(url, fileName);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handlePngDownload = (data: ZodCreateInvoiceSchema) => async () => {
    try {
      const pdfBlob = await generatePdfBlob(data);
      
      const pngBlob = await convertPdfPageToImage(pdfBlob);
      const pngUrl = URL.createObjectURL(pngBlob);
      
      const fileName = `Invoice-${data.invoiceDetails.prefix}${data.invoiceDetails.serialNumber}.png`;
      downloadFile(pngUrl, fileName);
      
      URL.revokeObjectURL(pngUrl);
    } catch (error) {
      console.error("Error downloading PNG:", error);
    }
  };

  return (
    <div className="flex h-12 flex-row items-center justify-end gap-2 border-b px-2">
      <Button variant="secondary" onClick={handlePreview}>
        <EyeScannerIcon className="light:text-muted-foreground mr-2" />
        Preview
      </Button>
      
      <DropdownMenu onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="default">
            <InboxArrowDownIcon className="mr-2" />
            Download
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem 
            onClick={handlePdfDownload(formData)}
          >
            Download as PDF
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handlePngDownload(formData)}
          >
            Download as PNG
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <InvoiceErrorsModal />
    </div>
  );
};

export default InvoiceOptions;

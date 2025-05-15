// Image Component by OriginUI.com
/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogContentContainer,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeaderContainer,
  DialogIcon,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreatePngFromBase64 } from "@/lib/invoice/create-png-from-base64";
import { createBlobUrl } from "@/lib/invoice/create-blob-url";
import SignatureCanvas from "react-signature-canvas";
import { SignatureIcon } from "@/assets/icons";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { XIcon } from "lucide-react";
import { Button } from "../button";
import { toast } from "sonner";

interface SignatureInputModalProps {
  title?: string;
  className?: string;
  onSignatureChange?: (signature: string) => void;
  defaultUrl?: string;
  onBase64Change?: (base64: string) => void;
  onFileRemove?: () => void;
}

export default function SignatureInputModal({
  title = "Click here to draw your signature",
  //   className,
  onSignatureChange,
  defaultUrl,
  onBase64Change,
  onFileRemove,
}: SignatureInputModalProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const signaturePadRef = useRef<SignatureCanvas>(null);
  const [isSignatureEmpty, setIsSignatureEmpty] = useState<boolean>(true);
  const previewUrl = defaultUrl || "";

  // Handle Clear signature
  const handleClear = () => {
    signaturePadRef.current?.clear();
  };

  // Handle and Save signature
  const handleSave = () => {
    //   get the signature canvas
    const signatureCanvasUri = signaturePadRef.current?.getTrimmedCanvas().toDataURL("image/png");

    if (!signatureCanvasUri) {
      toast.error("No signature found", {
        description: "Please draw your signature and try again",
      });
      return;
    }

    // set it to onBase64Change
    if (onBase64Change && signatureCanvasUri) {
      onBase64Change(signatureCanvasUri);
    }

    // Convert to blob
    const signatureBlob = CreatePngFromBase64(signatureCanvasUri);

    if (!signatureBlob) {
      toast.error("No signature found", {
        description: "Please draw your signature and try again",
      });
      return;
    }

    const signatureBlobUrl = createBlobUrl({ blob: signatureBlob });

    // set it to onSignatureChange
    if (onSignatureChange && signatureBlob) {
      onSignatureChange(signatureBlobUrl);
    }

    // set modal to close
    setIsModalOpen(false);
    // reset signature
    signaturePadRef.current?.clear();
    setIsSignatureEmpty(true);
  };

  // Handle and Reset states when modal is closed
  const handleModalChange = (open: boolean) => {
    setIsModalOpen(open);

    if (!open) {
      //   reset signature
      signaturePadRef.current?.clear();
      setIsSignatureEmpty(true);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalChange}>
      <DialogTrigger asChild>
        <div className="relative">
          {/* Drop area */}
          <div
            role="button"
            className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 s relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-md border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px] sm:min-h-52"
          >
            {previewUrl ? (
              <div className="absolute inset-0">
                <img src={previewUrl} alt="user signature" className="size-full object-cover" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                <div
                  className="bg-muted mb-2 flex size-11 shrink-0 items-center justify-center rounded-full"
                  aria-hidden="true"
                >
                  <SignatureIcon className="size-4 rotate-12" />
                </div>
                <p className="mb-1.5 text-xs font-medium">{title}</p>
                <p className="text-muted-foreground text-[10px]">You can draw by hand or use the mouse</p>
              </div>
            )}
          </div>
          {previewUrl && (
            <div className="absolute top-4 right-4">
              <button
                type="button"
                className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-5 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                onClick={(e) => {
                  e.preventDefault();

                  if (onFileRemove) {
                    onFileRemove();
                  }
                }}
                aria-label="Remove image"
              >
                <XIcon className="size-3" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="w-fit">
        <DialogHeaderContainer>
          <DialogIcon>
            <SignatureIcon className="size-4 rotate-12" />
          </DialogIcon>
          <DialogHeader>
            <DialogTitle>Company Signature</DialogTitle>
            <DialogDescription>Draw your signature here</DialogDescription>
          </DialogHeader>
        </DialogHeaderContainer>
        <DialogContentContainer>
          <div className="relative overflow-hidden rounded-md border">
            {!isSignatureEmpty && (
              <motion.div
                key="signature-clear-btn"
                initial={{ filter: "blur(1px)", top: -24 }}
                animate={{ filter: "blur(0px)", top: 6 }}
                exit={{ filter: "blur(1px)", top: -24 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute right-1.5 z-10 flex items-center justify-center"
              >
                <Button variant="destructive" size="xs" onClick={handleClear}>
                  Clear
                </Button>
              </motion.div>
            )}
            <SignatureCanvas
              key="signature-canvas"
              ref={signaturePadRef}
              onBegin={() => setIsSignatureEmpty(false)}
              penColor="black"
              backgroundColor="#ffffff"
              canvasProps={{ width: 330, height: 330, className: "signature-canvas" }}
            />
          </div>
        </DialogContentContainer>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

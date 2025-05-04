import { EyeScannerIcon, InboxArrowDownIcon } from "@/assets/icons";
import InvoiceErrorsModal from "./invoice-errors-modal";
import { Button } from "@/components/ui/button";
const InvoiceOptions = () => {
  return (
    <div className="flex h-12 flex-row items-center justify-end gap-2 border-b px-2">
      <Button variant="secondary">
        <EyeScannerIcon className="light:text-muted-foreground" />
        Preview
      </Button>
      <Button variant="default">
        <InboxArrowDownIcon />
        Download
      </Button>
      <InvoiceErrorsModal />
    </div>
  );
};

export default InvoiceOptions;

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContentContainer,
  DialogHeaderContainer,
  DialogIcon,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { deleteInvoiceFromIDB } from "@/lib/indexdb-queries/deleteInvoice"; // New import
import type { InvoiceTypeType } from "@invoicely/db/schema/invoice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseCatchError } from "@/lib/neverthrow/parseCatchError";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FormButton } from "@/components/ui/form/form-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TrashIcon } from "@/assets/icons";
import { useForm } from "react-hook-form";
import { useTRPC } from "@/trpc/client";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

interface DeleteInvoiceModalProps {
  type: InvoiceTypeType;
  invoiceId: string;
}

const deleteInvoiceSchema = z.object({
  id: z.string(),
});

type DeleteInvoiceSchema = z.infer<typeof deleteInvoiceSchema>;

const DeleteInvoiceModal = ({ invoiceId, type }: DeleteInvoiceModalProps) => {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Postgres Mutation
  const deleteServerInvoiceMutation = useMutation(
    trpc.invoice.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Facture supprimée avec succès !", {
          description: "La facture a été supprimée de la base de données.",
        });
        queryClient.invalidateQueries({ queryKey: trpc.invoice.list.queryKey() });
      },
      onError: (error) => {
        toast.error("Échec de la suppression de la facture !", {
          description: parseCatchError(error),
        });
      },
    }),
  );

  // IDB Mutation
  const deleteIDBInvoiceMutation = useMutation({
    mutationFn: async (data: DeleteInvoiceSchema) => {
      await deleteInvoiceFromIDB(data.id);
    },
    onSuccess: () => {
      toast.success("Facture supprimée avec succès !", {
        description: "La facture a été supprimée du stockage local.",
      });
      queryClient.invalidateQueries({ queryKey: ["idb-invoices"] });
    },
    onError: (error) => {
      toast.error("Échec de la suppression de la facture !", {
        description: parseCatchError(error),
      });
    },
  });

  const form = useForm<DeleteInvoiceSchema>({
    resolver: zodResolver(deleteInvoiceSchema),
    defaultValues: {
      id: invoiceId,
    },
  });

  const onSubmit = async () => {
    if (type === "server") {
      await deleteServerInvoiceMutation.mutateAsync({
        id: invoiceId,
      });
    } else {
      await deleteIDBInvoiceMutation.mutateAsync({
        id: invoiceId,
      });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <TrashIcon />
          <span>Supprimer la facture</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeaderContainer>
              <DialogIcon>
                <TrashIcon />
              </DialogIcon>
              <DialogHeader>
                <DialogTitle>Supprimer la facture</DialogTitle>
                <DialogDescription>Cette action ne peut pas être annulée.</DialogDescription>
              </DialogHeader>
            </DialogHeaderContainer>
            <DialogContentContainer>
              <Alert variant="destructive">
                <AlertTitle>Procédez avec prudence !</AlertTitle>
                <AlertDescription>
                  Cette action ne peut pas être annulée. Elle supprimera définitivement la facture de la base de données. Vous ne pourrez pas la récupérer.
                </AlertDescription>
              </Alert>
              <div className="flex flex-col gap-1.5">
                <Label>ID de la facture</Label>
                <Input disabled value={invoiceId} />
              </div>
            </DialogContentContainer>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <FormButton variant="destructive" type="submit">
                Supprimer
              </FormButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInvoiceModal;

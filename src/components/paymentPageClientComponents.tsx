'use client';

import React, { useState } from 'react';
import { CellContext } from '@tanstack/table-core';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DataTable } from '@/components/ui/data-table';
import { z } from 'zod';
import { ActionResponse } from '@/lib/types/actionResponse';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { sonnerContent } from '@/components/ui/sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { paymentFormSchema } from '@/lib/form-schemas/paymentFormSchema';
import { Category, Entity, Payment } from '@prisma/client';
import PaymentForm from '@/components/form/paymentForm';
import { columns } from '@/app/payments/columns';

export default function PaymentPageClientContent({
    payments,
    entities,
    categories,
    onSubmit,
    onDelete,
    className,
}: {
    payments: Payment[],
    entities: Entity[],
    categories: Category[],
    onSubmit: (data: z.infer<typeof paymentFormSchema>) => Promise<ActionResponse>,
    onDelete: (id: number) => Promise<ActionResponse>,
    className: string,
}) {

    const router = useRouter();

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>(undefined);

    async function handleSubmit(data: z.infer<typeof paymentFormSchema>) {
        const response = await onSubmit(data);
        router.refresh();
        setIsEditDialogOpen(false);
        return response;
    }

    async function handleDelete(id: number | undefined) {

        if (!id) {
            return;
        }

        const response = await onDelete(id);
        toast(sonnerContent(response));
        if (response.redirect) {
            router.push(response.redirect);
        }
        router.refresh();
        setIsDeleteDialogOpen(false);
        return response;
    }

    const actionCell = ({row}: CellContext<Payment, unknown>) => {
        const payment = row.original as Payment;

        return (
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                        setSelectedPayment(payment);
                        setIsEditDialogOpen(true);
                    }}>
                    <span className="sr-only">Edit payment</span>
                    <Edit className="h-4 w-4"/>
                </Button>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                        setSelectedPayment(payment);
                        setIsDeleteDialogOpen(true);
                    }}
                >
                    <span className="sr-only">Delete payment</span>
                    <Trash className="h-4 w-4"/>
                </Button>
            </div>
        );
    };

    return (
        <div className={className}>
            <div className="flex items-center justify-between w-full">
                <p className="text-3xl font-semibold">Payments</p>

                {/* Edit dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => {
                                setSelectedPayment(undefined);
                                setIsEditDialogOpen(true);
                            }}>
                            Create Payment
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedPayment?.id ? 'Update Payment' : 'Create Payment'}</DialogTitle>
                        </DialogHeader>
                        <PaymentForm
                            value={selectedPayment}
                            entities={entities}
                            categories={categories}
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4"/>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Data Table */}
            <DataTable
                className="w-full"
                columns={columns(actionCell, entities, categories)}
                data={payments}
                pagination/>

            {/* Delete confirmation dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>Delete Payment?</AlertDialogHeader>
                    <p>Are your sure you want to delete the payment?</p>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(selectedPayment?.id)}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

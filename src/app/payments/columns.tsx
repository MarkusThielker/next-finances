'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Category, Entity, Payment } from '@prisma/client';
import { CellContext, ColumnDefTemplate } from '@tanstack/table-core';
import { format } from 'date-fns';

export const columns = (
    actionCell: ColumnDefTemplate<CellContext<Payment, unknown>>,
    entities: Entity[],
    categories: Category[],
) => {

    return [
        {
            accessorKey: 'date',
            header: 'Date',
            cell: ({row}) => {
                return format(row.original.date, 'PPP');
            },
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({row}) => {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'EUR',
                }).format(row.getValue('amount') as number / 100);
            },
        },
        {
            accessorKey: 'payorId',
            header: 'Payor',
            cell: ({row}) => {
                const entity = entities.find((entity) => entity.id === row.original.payorId);
                return entity?.name ?? '-';
            },
        },
        {
            accessorKey: 'payeeId',
            header: 'Payee',
            cell: ({row}) => {
                const entity = entities.find((entity) => entity.id === row.original.payeeId);
                return entity?.name ?? '-';
            },
        },
        {
            accessorKey: 'categoryId',
            header: 'Category',
            cell: ({row}) => {
                const category = categories.find((category) => category.id === row.original.categoryId);
                return (
                    <div className="flex items-center space-x-4">
                        <svg className="h-5" fill={category?.color} viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="10"/>
                        </svg>
                        <p>{category?.name ?? '-'}</p>
                    </div>
                );
            },
        },
        {
            accessorKey: 'note',
            header: 'Note',
        },
        {
            id: 'actions',
            cell: actionCell,
        },
    ] as ColumnDef<Payment>[];
};

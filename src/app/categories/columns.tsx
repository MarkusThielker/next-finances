'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Category } from '@prisma/client';
import { CellContext, ColumnDefTemplate } from '@tanstack/table-core';
import { format } from 'date-fns';

export const columns = (
    actionCell: ColumnDefTemplate<CellContext<Category, unknown>>,
) => {

    return [
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'color',
            header: 'Color',
            cell: ({row}) => {
                return (
                    <svg className="h-5" fill={row.original.color} viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="10"/>
                    </svg>
                );
            },
            size: 65,
        },
        {
            accessorKey: 'createdAt',
            header: 'Created at',
            cell: ({row}) => {
                return format(row.original.createdAt, 'PPP');
            },
        },
        {
            accessorKey: 'updatedAt',
            header: 'Updated at',
            cell: ({row}) => {
                return format(row.original.updatedAt, 'PPP');
            },
        },
        {
            id: 'actions',
            cell: actionCell,
        },
    ] as ColumnDef<Category>[];
};

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Category } from '@prisma/client';
import { CellContext, ColumnDefTemplate } from '@tanstack/table-core';

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
        },
        {
            accessorKey: 'createdAt',
            header: 'Created at',
            cell: ({row}) => {
                const date = row.getValue('createdAt') as Date;
                return date.toDateString();
            },
        },
        {
            accessorKey: 'updatedAt',
            header: 'Updated at',
            cell: ({row}) => {
                const date = row.getValue('updatedAt') as Date;
                return date.toDateString();
            },
        },
        {
            id: 'actions',
            cell: actionCell,
        },
    ] as ColumnDef<Category>[];
};

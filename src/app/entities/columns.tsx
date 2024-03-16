'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Entity } from '@prisma/client';
import { CellContext, ColumnDefTemplate } from '@tanstack/table-core';
import { format } from 'date-fns';

export const columns = (
    actionCell: ColumnDefTemplate<CellContext<Entity, unknown>>,
) => {

    return [
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'type',
            header: 'Type',
            size: 100,
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
    ] as ColumnDef<Entity>[];
};

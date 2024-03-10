'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Entity } from '@prisma/client';
import { CellContext, ColumnDefTemplate } from '@tanstack/table-core';

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
    ] as ColumnDef<Entity>[];
};

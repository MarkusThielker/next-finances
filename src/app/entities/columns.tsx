'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Category, Entity } from '@prisma/client';
import { CellContext, ColumnDefTemplate } from '@tanstack/table-core';
import { format } from 'date-fns';

export const columns = (
    actionCell: ColumnDefTemplate<CellContext<Entity, unknown>>,
    categories: Category[],
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
            accessorKey: 'defaultCategoryId',
            header: 'Default Category',
            cell: ({row}) => {
                const category = categories.find((category) => category.id === row.original.defaultCategoryId);
                return (
                    <>
                        {
                            category && (
                                <div className="flex items-center space-x-4">
                                    <svg className="h-5" fill={category?.color} viewBox="0 0 20 20"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10"/>
                                    </svg>
                                    <p>{category?.name ?? '-'}</p>
                                </div>
                            )
                        }

                    </>
                );
            },
            size: 200,
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

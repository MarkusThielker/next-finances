'use client';

import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination?: boolean;
    className?: string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pagination,
    className,
}: DataTableProps<TData, TValue>) {

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    });

    const [pageSize, setPageSize] = useState(50);
    useEffect(() => {
        if (pagination) {
            table.setPageSize(pageSize);
        }
    }, [table, pagination, pageSize]);

    return (
        <div className={className}>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}
                                                   style={{minWidth: `${header.column.getSize()}px`}}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}
                                                   className={cell.id.endsWith('actions') ? 'w-[120px]' : ''}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {
                pagination && (
                    <div className="flex items-center justify-between py-4">
                        <Select
                            onValueChange={(value) => {
                                setPageSize(parseInt(value));
                            }}
                            value={pageSize.toString()}
                        >
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Select a scope"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={'25'} key={'25'}>25</SelectItem>
                                <SelectItem value={'50'} key={'50'}>50</SelectItem>
                                <SelectItem value={'75'} key={'75'}>75</SelectItem>
                                <SelectItem value={'100'} key={'100'}>100</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex flex-row items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => table.firstPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">First page</span>
                                <ChevronsLeft/>
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Previous page</span>
                                <ChevronLeft/>
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Next page</span>
                                <ChevronRight/>
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => table.lastPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Last page</span>
                                <ChevronsRight/>
                            </Button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

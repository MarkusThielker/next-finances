'use client';

import { Entity } from '@prisma/client';
import React, { useState } from 'react';
import { CellContext } from '@tanstack/table-core';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import EntityForm from '@/components/form/entityForm';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/app/entities/columns';
import { z } from 'zod';
import { entityFormSchema } from '@/lib/form-schemas/entityFormSchema';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { Input } from '@/components/ui/input';
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

export default function EntityPageClientContent({entities, onSubmit, onDelete, className}: {
    entities: Entity[],
    onSubmit: (data: z.infer<typeof entityFormSchema>) => Promise<ActionResponse>,
    onDelete: (id: number) => Promise<ActionResponse>,
    className: string,
}) {

    const router = useRouter();

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [selectedEntity, setSelectedEntity] = useState<Entity | undefined>(undefined);

    async function handleSubmit(data: z.infer<typeof entityFormSchema>) {
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

    function filterEntities(entities: Entity[], filter: string) {
        const filterChars = filter.toLowerCase().split('');
        const filterCharCounts: Record<string, number> = {};

        // Count character occurrences in the filter
        filterChars.forEach(char => {
            filterCharCounts[char] = (filterCharCounts[char] || 0) + 1;
        });

        return entities.filter(entity => {
            const entityChars = entity.name.toLowerCase().split('');
            const entityCharCounts: Record<string, number> = {};

            // Check if entity has enough of each character
            for (const char of entityChars) {
                entityCharCounts[char] = (entityCharCounts[char] || 0) + 1;
            }

            // Ensure all filter characters were found
            return Object.keys(filterCharCounts).every(char => {
                return entityCharCounts[char] >= filterCharCounts[char];
            });
        });
    }

    const actionCell = ({row}: CellContext<Entity, unknown>) => {
        const entity = row.original as Entity;

        return (
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                        setSelectedEntity(entity);
                        setIsEditDialogOpen(true);
                    }}>
                    <span className="sr-only">Edit entity</span>
                    <Edit className="h-4 w-4"/>
                </Button>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                        setSelectedEntity(entity);
                        setIsDeleteDialogOpen(true);
                    }}
                >
                    <span className="sr-only">Delete entity</span>
                    <Trash className="h-4 w-4"/>
                </Button>
            </div>
        );
    };

    const [filter, setFilter] = useState<string>('');

    return (
        <div className={className}>
            <div className="flex items-center justify-between w-full">
                <p className="text-3xl font-semibold">Entities</p>

                {/* Edit dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => {
                                setSelectedEntity(undefined);
                                setIsEditDialogOpen(true);
                            }}>
                            Create Entity
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedEntity?.id ? 'Update Entity' : 'Create Entity'}</DialogTitle>
                        </DialogHeader>
                        <EntityForm
                            value={selectedEntity}
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4"/>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filter input */}
            <Input
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Filter entities"/>

            {/* Data Table */}
            <DataTable
                className="w-full"
                columns={columns(actionCell)}
                data={filterEntities(entities, filter)}
                pagination/>

            {/* Delete confirmation dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>Delete Entity?</AlertDialogHeader>
                    <p>Are your sure you want to delete the entity {selectedEntity?.name}?</p>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(selectedEntity?.id)}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

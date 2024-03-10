'use client';

import { Category } from '@prisma/client';
import React, { useState } from 'react';
import { CellContext } from '@tanstack/table-core';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/app/categories/columns';
import { z } from 'zod';
import { ActionResponse } from '@/lib/types/ActionResponse';
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
import { categoryFormSchema } from '@/lib/form-schemas/categoryFormSchema';
import CategoryForm from '@/components/form/categoryForm';

export default function CategoryPageClientContent({categories, onSubmit, onDelete, className}: {
    categories: Category[],
    onSubmit: (data: z.infer<typeof categoryFormSchema>) => Promise<ActionResponse>,
    onDelete: (id: number) => Promise<ActionResponse>,
    className: string,
}) {

    const router = useRouter();

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);

    async function handleSubmit(data: z.infer<typeof categoryFormSchema>) {
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

    const actionCell = ({row}: CellContext<Category, unknown>) => {
        const category = row.original as Category;

        return (
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                        setSelectedCategory(category);
                        setIsEditDialogOpen(true);
                    }}>
                    <span className="sr-only">Edit category</span>
                    <Edit className="h-4 w-4"/>
                </Button>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                        setSelectedCategory(category);
                        setIsDeleteDialogOpen(true);
                    }}
                >
                    <span className="sr-only">Delete category</span>
                    <Trash className="h-4 w-4"/>
                </Button>
            </div>
        );
    };

    return (
        <div className={className}>
            <div className="flex items-center justify-between w-full">
                <p className="text-3xl font-semibold">Categories</p>

                {/* Edit dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => {
                                setSelectedCategory(undefined);
                                setIsEditDialogOpen(true);
                            }}>
                            Create Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedCategory?.id ? 'Update Category' : 'Create Category'}</DialogTitle>
                        </DialogHeader>
                        <CategoryForm
                            value={selectedCategory}
                            onSubmit={handleSubmit}
                            className="flex flex-row space-x-4 py-4"/>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Data Table */}
            <DataTable
                className="w-full"
                columns={columns(actionCell)}
                data={categories}
                pagination/>

            {/* Delete confirmation dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>Delete Category?</AlertDialogHeader>
                    <p>Are your sure you want to delete the category {selectedCategory?.name}?</p>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(selectedCategory?.id)}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

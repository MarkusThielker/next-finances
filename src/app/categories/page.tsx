import { getUser } from '@/auth';
import prisma from '@/prisma';
import React from 'react';
import CategoryPageClientContent from '@/components/categoryPageClientComponents';
import categoryCreateUpdate from '@/lib/actions/categoryCreateUpdate';
import categoryDelete from '@/lib/actions/categoryDelete';

export default async function CategoriesPage() {

    const user = await getUser();

    const categories = await prisma.category.findMany({
        where: {
            userId: user?.id,
        },
        orderBy: [
            {
                name: 'asc',
            },
        ],
    });

    return (
        <CategoryPageClientContent
            categories={categories}
            onSubmit={categoryCreateUpdate}
            onDelete={categoryDelete}
            className="flex flex-col justify-center space-y-4"/>
    );
}

import prisma from '@/prisma';
import React from 'react';
import CategoryPageClientContent from '@/components/categoryPageClientComponents';
import categoryCreateUpdate from '@/lib/actions/categoryCreateUpdate';
import categoryDelete from '@/lib/actions/categoryDelete';
import { auth0 } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function CategoriesPage() {

    const session = await auth0.getSession();
    if (!session) {
        return redirect('/auth/login');
    }
    const user = session.user;

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

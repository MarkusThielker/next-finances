import prisma from '@/prisma';
import React from 'react';
import EntityPageClientContent from '@/components/entityPageClientComponents';
import entityCreateUpdate from '@/lib/actions/entityCreateUpdate';
import entityDelete from '@/lib/actions/entityDelete';
import { auth0 } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function EntitiesPage() {

    const session = await auth0.getSession();
    if (!session) {
        return redirect('/auth/login');
    }
    const user = session.user;

    const entities = await prisma.entity.findMany({
        where: {
            userId: user?.id,
        },
        orderBy: [
            {
                type: 'desc',
            },
            {
                id: 'asc',
            },
        ],
    });

    const categories = await prisma.category.findMany({
        where: {
            userId: user?.id,
        },
        orderBy: [
            {
                name: 'asc',
            },
            {
                id: 'asc',
            },
        ],
    });

    return (
        <EntityPageClientContent
            entities={entities}
            categories={categories}
            onSubmit={entityCreateUpdate}
            onDelete={entityDelete}
            className="flex flex-col justify-center space-y-4"/>
    );
}

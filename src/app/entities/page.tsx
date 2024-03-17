import { prismaClient } from '@/prisma';
import { getUser } from '@/auth';
import React from 'react';
import EntityPageClientContent from '@/components/entityPageClientComponents';
import entityCreateUpdate from '@/lib/actions/entityCreateUpdate';
import entityDelete from '@/lib/actions/entityDelete';

export default async function EntitiesPage() {

    const user = await getUser();

    const entities = await prismaClient.entity.findMany({
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

    const categories = await prismaClient.category.findMany({
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

import { getUser } from '@/auth';
import prisma from '@/prisma';
import React from 'react';
import PaymentPageClientContent from '@/components/paymentPageClientComponents';
import paymentCreateUpdate from '@/lib/actions/paymentCreateUpdate';
import paymentDelete from '@/lib/actions/paymentDelete';

export default async function PaymentsPage() {

    const user = await getUser();

    const payments = await prisma.payment.findMany({
        where: {
            userId: user?.id,
        },
        orderBy: [
            {
                date: 'desc',
            },
            {
                id: 'desc',
            },
        ],
    });

    const entities = await prisma.entity.findMany({
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
        <PaymentPageClientContent
            payments={payments}
            entities={entities}
            categories={categories}
            onSubmit={paymentCreateUpdate}
            onDelete={paymentDelete}
            className="flex flex-col justify-center space-y-4"/>
    );
}

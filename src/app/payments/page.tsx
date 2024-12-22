import prisma from '@/prisma';
import React from 'react';
import PaymentPageClientContent from '@/components/paymentPageClientComponents';
import paymentCreateUpdate from '@/lib/actions/paymentCreateUpdate';
import paymentDelete from '@/lib/actions/paymentDelete';
import { getSession, Session } from '@auth0/nextjs-auth0';

export default async function PaymentsPage() {

    const {user} = await getSession() as Session;

    const payments = await prisma.payment.findMany({
        where: {
            userId: user.sub,
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
            userId: user.sub,
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
            userId: user.sub,
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

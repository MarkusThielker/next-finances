import prisma from '@/prisma';
import React from 'react';
import PaymentPageClientContent from '@/components/paymentPageClientComponents';
import paymentCreateUpdate from '@/lib/actions/paymentCreateUpdate';
import paymentDelete from '@/lib/actions/paymentDelete';
import { auth0 } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function PaymentsPage() {

    const session = await auth0.getSession();
    if (!session) {
        return redirect('/auth/login');
    }
    const user = session.user;

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

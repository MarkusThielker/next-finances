import { ActionResponse } from '@/lib/types/actionResponse';
import prisma from '@/prisma';
import { URL_SIGN_IN } from '@/lib/constants';
import { getSession } from '@auth0/nextjs-auth0';

export default async function paymentDelete(id: number): Promise<ActionResponse> {
    'use server';

    // check that id is a number
    if (!id || isNaN(id)) {
        return {
            type: 'error',
            message: 'Invalid payment ID',
        };
    }

    const session = await getSession();
    if (!session) {
        return {
            type: 'error',
            message: 'You aren\'t signed in.',
            redirect: URL_SIGN_IN,
        };
    }
    const user = session.user;

    // check that payment is associated with user
    const payment = await prisma.payment.findFirst({
        where: {
            id: id,
            userId: user.sub,
        },
    });
    if (!payment) {
        return {
            type: 'error',
            message: 'Payment not found',
        };
    }

    // delete payment
    try {
        await prisma.payment.delete({
                where: {
                    id: payment.id,
                    userId: user.sub,
                },
            },
        );
    } catch (e) {
        return {
            type: 'error',
            message: 'Failed deleting payment',
        };
    }

    // return success
    return {
        type: 'success',
        message: `Payment deleted`,
    };
}

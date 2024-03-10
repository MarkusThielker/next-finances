import { ActionResponse } from '@/lib/types/ActionResponse';
import { prismaClient } from '@/prisma';
import { getUser } from '@/auth';
import { URL_SIGN_IN } from '@/lib/constants';

export default async function paymentDelete(id: number): Promise<ActionResponse> {
    'use server';

    // check that id is a number
    if (!id || isNaN(id)) {
        return {
            type: 'error',
            message: 'Invalid payment ID',
        };
    }

    // check that user is logged in
    const user = await getUser();
    if (!user) {
        return {
            type: 'error',
            message: 'You must be logged in to delete a payment.',
            redirect: URL_SIGN_IN,
        };
    }

    // check that payment is associated with user
    const payment = await prismaClient.payment.findFirst({
        where: {
            id: id,
            userId: user.id,
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
        await prismaClient.payment.delete({
                where: {
                    id: payment.id,
                    userId: user.id,
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

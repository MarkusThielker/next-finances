import { ActionResponse } from '@/lib/types/actionResponse';
import { URL_SIGN_IN } from '@/lib/constants';
import prisma from '@/prisma';
import { getSession } from '@auth0/nextjs-auth0';

export default async function clearAccountData(): Promise<ActionResponse> {
    'use server';

    const session = await getSession();
    if (!session) {
        return {
            type: 'error',
            message: 'You aren\'t signed in.',
            redirect: URL_SIGN_IN,
        };
    }

    await prisma.payment.deleteMany({
        where: {
            userId: session.user.sub,
        },
    });

    await prisma.entity.deleteMany({
        where: {
            userId: session.user.sub,
        },
    });

    await prisma.category.deleteMany({
        where: {
            userId: session.user.sub,
        },
    });

    return {
        type: 'success',
        message: 'Your account data was cleared.',
    };
}

import { ActionResponse } from '@/lib/types/actionResponse';
import { URL_SIGN_IN } from '@/lib/constants';
import { getUser, lucia } from '@/auth';
import { prismaClient } from '@/prisma';
import { cookies } from 'next/headers';

export default async function accountDelete(): Promise<ActionResponse> {
    'use server';

    const user = await getUser();

    if (!user) {
        return {
            type: 'error',
            message: 'You aren\'t signed in.',
            redirect: URL_SIGN_IN,
        };
    }

    await prismaClient.payment.deleteMany({
        where: {
            userId: user.id,
        },
    });

    await prismaClient.entity.deleteMany({
        where: {
            userId: user.id,
        },
    });

    await prismaClient.category.deleteMany({
        where: {
            userId: user.id,
        },
    });

    await prismaClient.session.deleteMany({
        where: {
            userId: user.id,
        },
    });

    await prismaClient.user.delete({
        where: {
            id: user.id,
        },
    });

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return {
        type: 'success',
        message: 'Your account was removed.',
        redirect: URL_SIGN_IN,
    };
}

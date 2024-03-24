import { ActionResponse } from '@/lib/types/actionResponse';
import { URL_SIGN_IN } from '@/lib/constants';
import { getUser, lucia } from '@/auth';
import prisma from '@/prisma';
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

    await prisma.payment.deleteMany({
        where: {
            userId: user.id,
        },
    });

    await prisma.entity.deleteMany({
        where: {
            userId: user.id,
        },
    });

    await prisma.category.deleteMany({
        where: {
            userId: user.id,
        },
    });

    await prisma.session.deleteMany({
        where: {
            userId: user.id,
        },
    });

    await prisma.user.delete({
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

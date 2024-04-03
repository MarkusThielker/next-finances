import { ActionResponse } from '@/lib/types/actionResponse';
import { URL_SIGN_IN, URL_SIGN_OUT } from '@/lib/constants';
import prisma from '@/prisma';
import { getSession } from '@auth0/nextjs-auth0';

export default async function accountDelete(): Promise<ActionResponse> {
    'use server';

    const session = await getSession();
    if (!session) {
        return {
            type: 'error',
            message: 'You aren\'t signed in.',
            redirect: URL_SIGN_IN,
        };
    }
    const user = session.user;

    await prisma.payment.deleteMany({
        where: {
            userId: user.sub,
        },
    });

    await prisma.entity.deleteMany({
        where: {
            userId: user.sub,
        },
    });

    await prisma.category.deleteMany({
        where: {
            userId: user.sub,
        },
    });

    let requestOptions = {
        method: 'DELETE',
        redirect: 'follow',
    } as RequestInit;

    fetch(`https://login.auth0.com/api/v2/users/${user.sub}`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

    return {
        type: 'success',
        message: 'Your account was removed.',
        redirect: URL_SIGN_OUT,
    };
}

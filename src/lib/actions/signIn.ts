import { z } from 'zod';
import { Argon2id } from 'oslo/password';
import { lucia } from '@/auth';
import { cookies } from 'next/headers';
import { signInFormSchema } from '@/lib/form-schemas/signInFormSchema';
import { ActionResponse } from '@/lib/types/actionResponse';
import { URL_HOME } from '@/lib/constants';
import prisma from '@/prisma';

export default async function signIn({username, password}: z.infer<typeof signInFormSchema>): Promise<ActionResponse> {
    'use server';

    const existingUser = await prisma.user.findFirst({
        where: {
            username: username.toLowerCase(),
        },
    });
    if (!existingUser) {
        return {
            type: 'error',
            message: 'Incorrect username or password',
        };
    }

    const validPassword = await new Argon2id().verify(existingUser.password, password);
    if (!validPassword) {
        return {
            type: 'error',
            message: 'Incorrect username or password',
        };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return {
        type: 'success',
        message: 'Signed in successfully',
        redirect: URL_HOME,
    };
}

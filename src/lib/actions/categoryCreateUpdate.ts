import { z } from 'zod';
import { ActionResponse } from '@/lib/types/actionResponse';
import prisma from '@/prisma';
import { URL_SIGN_IN } from '@/lib/constants';
import { categoryFormSchema } from '@/lib/form-schemas/categoryFormSchema';
import { auth0 } from '@/lib/auth';

export default async function categoryCreateUpdate({
    id,
    name,
    color,
}: z.infer<typeof categoryFormSchema>): Promise<ActionResponse> {
    'use server';

    const session = await auth0.getSession();
    if (!session) {
        return {
            type: 'error',
            message: 'You aren\'t signed in.',
            redirect: URL_SIGN_IN,
        };
    }
    const user = session.user;

    // create/update category
    try {
        if (id) {
            await prisma.category.update({
                    where: {
                        id: id,
                    },
                    data: {
                        name: name,
                        color: color,
                    },
                },
            );

            // return success
            return {
                type: 'success',
                message: `'${name}' updated`,
            };
        } else {
            await prisma.category.create({
                data: {
                    userId: user.sub,
                    name: name,
                    color: color,
                },
            });

            // return success
            return {
                type: 'success',
                message: `'${name}' created`,
            };
        }
    } catch (e) {
        return {
            type: 'error',
            message: 'Failed creating/updating category',
        };
    }
}

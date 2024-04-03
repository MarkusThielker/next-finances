import { z } from 'zod';
import { ActionResponse } from '@/lib/types/actionResponse';
import { entityFormSchema } from '@/lib/form-schemas/entityFormSchema';
import prisma from '@/prisma';
import { URL_SIGN_IN } from '@/lib/constants';
import { getSession } from '@auth0/nextjs-auth0';

export default async function entityCreateUpdate({
    id,
    name,
    type,
    defaultCategoryId,
}: z.infer<typeof entityFormSchema>): Promise<ActionResponse> {
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

    // create/update entity
    try {
        if (id) {
            await prisma.entity.update({
                    where: {
                        id: id,
                    },
                    data: {
                        name: name,
                        type: type,
                        defaultCategoryId: defaultCategoryId ?? null,
                    },
                },
            );

            // return success
            return {
                type: 'success',
                message: `${type} '${name}' updated`,
            };
        } else {
            await prisma.entity.create({
                data: {
                    userId: user.sub,
                    name: name,
                    type: type,
                    defaultCategoryId: defaultCategoryId ?? null,
                },
            });

            // return success
            return {
                type: 'success',
                message: `${type} '${name}' created`,
            };
        }
    } catch (e) {
        return {
            type: 'error',
            message: 'Failed creating/updating entity',
        };
    }
}

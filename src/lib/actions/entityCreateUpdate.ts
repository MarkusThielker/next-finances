import { z } from 'zod';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { entityFormSchema } from '@/lib/form-schemas/entityFormSchema';
import { prismaClient } from '@/prisma';
import { getUser } from '@/auth';
import { URL_SIGN_IN } from '@/lib/constants';

export default async function entityCreateUpdate({
    id,
    name,
    type,
}: z.infer<typeof entityFormSchema>): Promise<ActionResponse> {
    'use server';

    // check that user is logged in
    const user = await getUser();
    if (!user) {
        return {
            type: 'error',
            message: 'You must be logged in to create/update an entity.',
            redirect: URL_SIGN_IN,
        };
    }

    // create/update entity
    try {
        if (id) {
            await prismaClient.entity.update({
                    where: {
                        id: id,
                    },
                    data: {
                        name: name,
                        type: type,
                    },
                },
            );

            // return success
            return {
                type: 'success',
                message: `${type} '${name}' updated`,
            };
        } else {
            await prismaClient.entity.create({
                data: {
                    userId: user.id,
                    name: name,
                    type: type,
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

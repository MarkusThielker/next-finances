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

    const user = await getUser();
    if (!user) {
        return {
            type: 'error',
            message: 'You must be logged in to create an entity.',
            redirect: URL_SIGN_IN,
        };
    }

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
        } else {
            await prismaClient.entity.create({
                data: {
                    userId: user.id,
                    name: name,
                    type: type,
                },
            });
        }
    } catch (e) {
        return {
            type: 'error',
            message: 'Invalid entity data',
        };
    }

    return {
        type: 'success',
        message: `Created an entity with name: ${name} and type: ${type}`,
    };
}

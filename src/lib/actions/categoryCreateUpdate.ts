import { z } from 'zod';
import { ActionResponse } from '@/lib/types/actionResponse';
import prisma from '@/prisma';
import { getUser } from '@/auth';
import { URL_SIGN_IN } from '@/lib/constants';
import { categoryFormSchema } from '@/lib/form-schemas/categoryFormSchema';

export default async function categoryCreateUpdate({
    id,
    name,
    color,
}: z.infer<typeof categoryFormSchema>): Promise<ActionResponse> {
    'use server';

    // check that user is logged in
    const user = await getUser();
    if (!user) {
        return {
            type: 'error',
            message: 'You must be logged in to create/update an category.',
            redirect: URL_SIGN_IN,
        };
    }

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
                    userId: user.id,
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

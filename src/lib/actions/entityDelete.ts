import { ActionResponse } from '@/lib/types/actionResponse';
import { prismaClient } from '@/prisma';
import { getUser } from '@/auth';
import { URL_SIGN_IN } from '@/lib/constants';

export default async function entityDelete(id: number): Promise<ActionResponse> {
    'use server';

    // check that id is a number
    if (!id || isNaN(id)) {
        return {
            type: 'error',
            message: 'Invalid entity ID',
        };
    }

    // check that user is logged in
    const user = await getUser();
    if (!user) {
        return {
            type: 'error',
            message: 'You must be logged in to delete an entity.',
            redirect: URL_SIGN_IN,
        };
    }

    // check that entity is associated with user
    const entity = await prismaClient.entity.findFirst({
        where: {
            id: id,
            userId: user.id,
        },
    });
    if (!entity) {
        return {
            type: 'error',
            message: 'Entity not found',
        };
    }

    // delete entity
    try {
        await prismaClient.entity.delete({
                where: {
                    id: entity.id,
                    userId: user.id,
                },
            },
        );
    } catch (e) {
        return {
            type: 'error',
            message: 'Failed deleting entity',
        };
    }

    // return success
    return {
        type: 'success',
        message: `${entity.type} '${entity.name}' deleted`,
    };
}

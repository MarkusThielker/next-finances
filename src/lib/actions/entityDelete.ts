import { ActionResponse } from '@/lib/types/actionResponse';
import prisma from '@/prisma';
import { URL_SIGN_IN } from '@/lib/constants';
import { auth0 } from '@/lib/auth';

export default async function entityDelete(id: number): Promise<ActionResponse> {
    'use server';

    // check that id is a number
    if (!id || isNaN(id)) {
        return {
            type: 'error',
            message: 'Invalid entity ID',
        };
    }

    const session = await auth0.getSession();
    if (!session) {
        return {
            type: 'error',
            message: 'You aren\'t signed in.',
            redirect: URL_SIGN_IN,
        };
    }
    const user = session.user;

    // check that entity is associated with user
    const entity = await prisma.entity.findFirst({
        where: {
            id: id,
            userId: user.sub,
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
        await prisma.entity.delete({
                where: {
                    id: entity.id,
                    userId: user.sub,
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

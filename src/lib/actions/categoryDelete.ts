import { ActionResponse } from '@/lib/types/actionResponse';
import prisma from '@/prisma';
import { URL_SIGN_IN } from '@/lib/constants';
import { getSession } from '@auth0/nextjs-auth0';

export default async function categoryDelete(id: number): Promise<ActionResponse> {
    'use server';

    // check that id is a number
    if (!id || isNaN(id)) {
        return {
            type: 'error',
            message: 'Invalid category ID',
        };
    }

    const session = await getSession();
    if (!session) {
        return {
            type: 'error',
            message: 'You aren\'t signed in.',
            redirect: URL_SIGN_IN,
        };
    }
    const user = session.user;

    // check that category is associated with user
    const category = await prisma.category.findFirst({
        where: {
            id: id,
            userId: user.sub,
        },
    });
    if (!category) {
        return {
            type: 'error',
            message: 'Category not found',
        };
    }

    // delete category
    try {
        await prisma.category.delete({
                where: {
                    id: category.id,
                    userId: user.sub,
                },
            },
        );
    } catch (e) {
        return {
            type: 'error',
            message: 'Failed deleting category',
        };
    }

    // return success
    return {
        type: 'success',
        message: `'${category.name}' deleted`,
    };
}

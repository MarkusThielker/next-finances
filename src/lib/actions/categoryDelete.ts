import { ActionResponse } from '@/lib/types/actionResponse';
import { prismaClient } from '@/prisma';
import { getUser } from '@/auth';
import { URL_SIGN_IN } from '@/lib/constants';

export default async function categoryDelete(id: number): Promise<ActionResponse> {
    'use server';

    // check that id is a number
    if (!id || isNaN(id)) {
        return {
            type: 'error',
            message: 'Invalid category ID',
        };
    }

    // check that user is logged in
    const user = await getUser();
    if (!user) {
        return {
            type: 'error',
            message: 'You must be logged in to delete an category.',
            redirect: URL_SIGN_IN,
        };
    }

    // check that category is associated with user
    const category = await prismaClient.category.findFirst({
        where: {
            id: id,
            userId: user.id,
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
        await prismaClient.category.delete({
                where: {
                    id: category.id,
                    userId: user.id,
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

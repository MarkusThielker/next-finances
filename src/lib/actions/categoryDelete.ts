import { ActionResponse } from '@/lib/types/actionResponse';
import prisma from '@/prisma';
import { URL_SIGN_IN } from '@/lib/constants';
import { auth0 } from '@/lib/auth';

export default async function categoryDelete(id: number): Promise<ActionResponse> {
    'use server';

    // check that id is a number
    if (!id || isNaN(id)) {
        return {
            type: 'error',
            message: 'Invalid category ID',
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

    try {

        await prisma.$transaction(async (tx) => {

            // update related payments
            await tx.payment.updateMany({
                where: {categoryId: category.id},
                data: {categoryId: null},
            });

            // delete the category
            await tx.category.delete({
                where: {
                    id: category.id,
                    userId: user.sub,
                },
            });
        });

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

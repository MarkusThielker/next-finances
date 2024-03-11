import { z } from 'zod';
import { ActionResponse } from '@/lib/types/actionResponse';
import { prismaClient } from '@/prisma';
import { getUser } from '@/auth';
import { URL_SIGN_IN } from '@/lib/constants';
import { paymentFormSchema } from '@/lib/form-schemas/paymentFormSchema';

export default async function paymentCreateUpdate({
    id,
    amount,
    date,
    payorId,
    payeeId,
    categoryId,
    note,
}: z.infer<typeof paymentFormSchema>): Promise<ActionResponse> {
    'use server';

    // check that user is logged in
    const user = await getUser();
    if (!user) {
        return {
            type: 'error',
            message: 'You must be logged in to create/update a payment.',
            redirect: URL_SIGN_IN,
        };
    }

    // create/update payment
    try {
        if (id) {
            await prismaClient.payment.update({
                    where: {
                        id: id,
                    },
                    data: {
                        amount: amount,
                        date: date,
                        payorId: payorId,
                        payeeId: payeeId,
                        categoryId: categoryId,
                        note: note,
                    },
                },
            );

            // return success
            return {
                type: 'success',
                message: `Payment updated`,
            };
        } else {
            await prismaClient.payment.create({
                data: {
                    userId: user.id,
                    amount: amount,
                    date: date,
                    payorId: payorId,
                    payeeId: payeeId,
                    categoryId: categoryId,
                    note: note,
                },
            });

            // return success
            return {
                type: 'success',
                message: `Payment created`,
            };
        }
    } catch (e) {
        return {
            type: 'error',
            message: 'Failed creating/updating payment',
        };
    }
}

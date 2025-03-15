import { z } from 'zod';
import { ActionResponse } from '@/lib/types/actionResponse';
import prisma from '@/prisma';
import { URL_SIGN_IN } from '@/lib/constants';
import { paymentFormSchema } from '@/lib/form-schemas/paymentFormSchema';
import { auth0 } from '@/lib/auth';

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

    const session = await auth0.getSession();
    if (!session) {
        return {
            type: 'error',
            message: 'You aren\'t signed in.',
            redirect: URL_SIGN_IN,
        };
    }
    const user = session.user;

    // create/update payment
    try {
        if (id) {
            await prisma.payment.update({
                    where: {
                        id: id,
                    },
                    data: {
                        amount: amount,
                        date: date,
                        payorId: payorId,
                        payeeId: payeeId,
                        categoryId: categoryId ?? null,
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
            await prisma.payment.create({
                data: {
                    userId: user.sub,
                    amount: amount,
                    date: date,
                    payorId: payorId,
                    payeeId: payeeId,
                    categoryId: categoryId ?? null,
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

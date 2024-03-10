import { z } from 'zod';

export const paymentFormSchema = z.object({
    id: z.number().positive().optional(),
    amount: z.number().positive(),
    date: z.date(),
    payorId: z.number().positive(),
    payeeId: z.number().positive(),
    categoryId: z.number().positive().optional(),
    note: z.string().max(255).optional(),
});

import { z } from 'zod';

export const categoryFormSchema = z.object({
    id: z.number().positive().optional(),
    name: z.string().min(1).max(32),
    color: z.string()
        .min(7)
        .max(7)
        .startsWith('#')
        .refine(value => value.split('#')[1].match(/^[0-9a-fA-F]{6}$/)),
});

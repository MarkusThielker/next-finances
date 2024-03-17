import { z } from 'zod';
import { EntityType } from '@prisma/client';

export const entityFormSchema = z.object({
    id: z.number().positive().optional(),
    name: z.string().min(1).max(32),
    type: z.nativeEnum(EntityType),
    defaultCategoryId: z.number().positive().optional(),
});

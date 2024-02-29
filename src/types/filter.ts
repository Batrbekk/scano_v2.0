import { z, ZodArray, ZodString, ZodObject } from 'zod';

export const FormSchema = z.object({
    tone: z.array(z.string()),
    material_type: z.array(z.string()),
    language: z.array(z.string()),
    source_type: z.array(z.string())
});

export type FormValues = z.infer<typeof FormSchema>;

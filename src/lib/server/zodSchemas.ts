import z from 'zod';

export const userSchema = z.object({
    name: z.string().nonempty(),
    password: z.string().nullable().default(null),
    group: z.number()
})

export const itemSchema = z.object({
    user: z.number(),
    name: z.string().nonempty(),
    start: z.string().nonempty(),
    end: z.string().nonempty(),
    sunday: z.boolean(),
    monday: z.boolean(),
    tuesday: z.boolean(),
    wednesday: z.boolean(),
    thursday: z.boolean(),
    friday: z.boolean(),
    saturday: z.boolean(),
})

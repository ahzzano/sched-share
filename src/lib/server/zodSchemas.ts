import z from 'zod';

export const userSchema = z.object({
    name: z.string().nonempty(),
    password: z.string().nullable().default(null),
    group: z.number()
})

export const itemSchema = z.object({
    name: z.string().nonempty(),
    startTime: z.string().nonempty(),
    endTime: z.string().nonempty(),

    sunday: z.boolean(),
    monday: z.boolean(),
    tuesday: z.boolean(),
    wednesday: z.boolean(),
    thursday: z.boolean(),
    friday: z.boolean(),
    saturday: z.boolean(),
})

import z from 'zod';

export const userSchema = z.object({
    name: z.string().nonempty(),
    password: z.string().nullable().default(null),
    group: z.number()
})

import { db } from "$lib/server/db";
import { groups } from "$lib/server/db/schema";
import { sessionSchema } from "$lib/server/zodSchemas";
import { fail, redirect, type Actions } from "@sveltejs/kit";

export const actions = {
    createSession: async({request}) => {
        const form = await request.formData()

        const result = sessionSchema.safeParse({name: form.get('groupName')})
        if (result.error) {
            return fail(404)
        }

        const newGroup = await db.insert(groups).values(result.data).returning()
        return redirect(303, `/${newGroup[0].id}`)
    }
} satisfies Actions

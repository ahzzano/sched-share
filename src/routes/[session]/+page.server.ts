import { db } from "$lib/server/db"
import { groups, users, type NewUser } from "$lib/server/db/schema"
import { eq } from "drizzle-orm"
import type { PageLoad } from "./$types"
import { error, fail, type Actions } from "@sveltejs/kit"
import { userSchema } from "$lib/server/zodSchemas"

export const actions = {
    addUser: async ({ request, params }) => {
        const form = await request.formData()
        const username = form.get('username')
        const password = form.get('password')
        const groupId = params.session

        if (groupId === undefined) {
            return fail(404)
        }

        const result = userSchema.safeParse({
            name: username,
            password: password,
            group: parseInt(groupId),
        })

        if (result.error) {
            return fail(404)
        }

        const data: NewUser = result.data
        type newUserResult = typeof users.$inferSelect
        const newUser: newUserResult[] = await db.insert(users).values(data).returning()
        return { success: true, newUser  }
    }

} satisfies Actions

export const load: PageLoad = async ({ params }) => {
    const sessId = parseInt(params.session)

    const group = await db.select()
        .from(groups)
        .where(eq(groups.id, sessId))

    const groupUsers = await db
        .select()
        .from(users)
        .where(eq(users.group, sessId))

    if (group.length == 0) {
        return error(404, {
            message: 'Group not found'
        })
    }
    return {
        session: params.session,
        users: groupUsers
    }
}


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
        return { success: true, newUser }
    },
    addItemToSchedule: async ({ request }) => {
        const form = await request.formData()
        const name = form.get('itemName')
        const startTime = form.get('startTime')
        const endTime = form.get('endTime')
    }
} satisfies Actions

export const load: PageLoad = async ({ params }) => {
    const sessId = parseInt(params.session)

    const group = await db.select()
        .from(groups)
        .where(eq(groups.id, sessId))

    const groupUsers = await db.query.users.findMany({
        with: {
            items: true
        }
    })

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


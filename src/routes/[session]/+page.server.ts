import { db } from "$lib/server/db"
import { groups, items, users, type NewUser } from "$lib/server/db/schema"
import { eq } from "drizzle-orm"
import type { PageLoad } from "./$types"
import { error, fail, type Actions } from "@sveltejs/kit"
import { itemSchema, userSchema } from "$lib/server/zodSchemas"
import { request } from "http"

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
        const id = form.get('userId')
        if (!id) {
            return fail(404)
        }
        const startTime = form.get('startTime')
        const endTime = form.get('endTime')
        console.log(startTime, endTime)

        const result = itemSchema.safeParse({
            user: parseInt(id.toString()),
            name: name,
            start: startTime,
            end: endTime,
            sunday: form.get('sunday') === 'on',
            monday: form.get('monday') === 'on',
            tuesday: form.get('tuesday') === 'on',
            wednesday: form.get('wednesday') === 'on',
            thursday: form.get('thursday') === 'on',
            friday: form.get('friday') === 'on',
            saturday: form.get('saturday') === 'on',
        })

        if (result.error) {
            return fail(404)
        }

        console.log(result.data)
        await db.insert(items).values(result.data)

        return { success: true }
    },
    deleteSchedule: async ({ request }) => {
        const form = await request.formData()
        const id = form.get('id')
        if (!id) {
            return fail(404)
        }

        await db.delete(items).where(eq(items.id, parseInt(id.toString())))
    },
    deleteUser: async({request}) => {
        const form = await request.formData()
        const id = form.get('id')
        if (!id) {
            return fail(404)
        }

        await db.delete(users).where(eq(users.id, parseInt(id.toString())))
    }

} satisfies Actions

export const load: PageLoad = async ({ params }) => {
    const sessId = parseInt(params.session)

    const group = await db.select()
        .from(groups)
        .where(eq(groups.id, sessId))

    if (group.length == 0) {
        return error(404, {
            message: 'Group not found'
        })
    }

    const groupUsers = await db.query.users.findMany({
        with: {
            items: true
        },
        where: eq(users.group, sessId)
    })

    return {
        session: params.session,
        users: groupUsers
    }
}


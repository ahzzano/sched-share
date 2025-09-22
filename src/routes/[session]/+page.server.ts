import { db } from "$lib/server/db"
import { groups, items, users, type NewUser } from "$lib/server/db/schema"
import { eq } from "drizzle-orm"
import type { PageLoad } from "./$types"
import { error, fail, type Actions } from "@sveltejs/kit"
import { itemSchema, userSchema } from "$lib/server/zodSchemas"
import { request } from "http"
import { parse } from "path"

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
            sunday: form.get('Sun') === 'on',
            monday: form.get('Mon') === 'on',
            tuesday: form.get('Tues') === 'on',
            wednesday: form.get('Wed') === 'on',
            thursday: form.get('Thurs') === 'on',
            friday: form.get('Fri') === 'on',
            saturday: form.get('Sat') === 'on',
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
    deleteUser: async ({ request }) => {
        const form = await request.formData()
        const id = form.get('id')
        if (!id) {
            return fail(404)
        }

        await db.delete(items).where(eq(items.user, parseInt(id.toString())))
        await db.delete(users).where(eq(users.id, parseInt(id.toString())))
    },
    updateSchedule: async ({ request }) => {
        const form = await request.formData()
        const newData = {
            name: form.get('name'),
            id: form.get('id')
        }
        if (!newData.id) {
            return fail(404)
        }
    }

} satisfies Actions

function convertToPM(timeString: string | null) {
    if (timeString === null) {
        return null
    }

    let [hour, minutes] = timeString.split(":")
    let hourNumber = parseInt(hour)
    let minNumber = parseInt(minutes)
    let AM = 'AM'

    if (hourNumber == 0) {
        AM = 'AM'
        hourNumber = 12
    } else if (hourNumber == 12) {
        AM = 'PM'
    } else if (hourNumber > 12) {
        AM = 'PM'
        hourNumber = hourNumber - 12
    }

    const hours = hourNumber.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
    const minute = minNumber.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })

    return `${hours}:${minute} ${AM}`
}

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

    const mappedUsers = groupUsers.map(row => ({
        ...row,
        items: row.items.map((item) => ({
            ...item,
            start: new Date(item.start),
            end: new Date(item.end),
        }))
    }))

    return {
        session: params.session,
        group: group[0],
        users: mappedUsers
    }
}


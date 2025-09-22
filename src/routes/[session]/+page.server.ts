import { db } from "$lib/server/db"
import { groups, items, users, type NewUser } from "$lib/server/db/schema"
import { eq } from "drizzle-orm"
import type { PageLoad } from "./$types"
import { error, fail, type Actions } from "@sveltejs/kit"
import { itemSchema, userSchema } from "$lib/server/zodSchemas"
import type { ParseInput } from "zod/v3"

type ParsedItem = Omit<typeof items.$inferSelect, "start" | "end"> & { days: boolean[]; start: Date; end: Date; }

enum Day {
    SUNDAY = 0, MONDAY = 1, TUESDAY = 2, WEDNESDAY = 3, THURSDAY = 4, FRIDAY = 5, SATURDAY = 6
}

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

function convertToDate(timeString: string) {
    let [hours, minutes] = timeString.split(":").map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)
    return date
}

function isInSlot(item: ParsedItem, slotStart: Date): boolean {
    const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);
    return item.start < slotEnd && item.end > slotStart
}

function generateSlots(items: ParsedItem[]): Date[] {
    const slots = []
    const base = new Date()
    base.setHours(5, 0, 0, 0)
    for (let i = 0; i < 15 * 2 + 1; i++) {
        const time = new Date(base.getTime() + i * 30 * 60 * 1000);
        slots.push(time)
    }
    return slots;
}

function assignSlots(items: ParsedItem[], slots: Date[], day: Day) {
    const toRet = []
    for (const [index, slot] of slots.entries()) {
        const relevantItems = items.filter((item) => isInSlot(item, slot) && item.days[day])
        const ends = relevantItems.map((item) => (item.end));
        ends.sort()
        const maxEnd = ends.at(-1) ?? null

        toRet.push({
            start: slot,
            items: relevantItems,
            nItems: relevantItems.length,
            maxEnd: maxEnd
        })
    }
    return toRet
}

// We want to join as much adjacent slots as possible
function generateSubsets(slots: Date[], assignedSlots: ReturnType<typeof assignSlots>) {
    const toRet = []
    let left = 0

    let items: ParsedItem[] = []
    for (let right = 0; right < assignedSlots.length; right++) {
        items = items.concat(assignedSlots[right].items)

        if (assignedSlots[right].nItems == 0) {
            const ids = new Set();
            const uniqueItems = items.filter(({ id }) => !ids.has(id) && ids.add(id));

            if (items.length != 0) {
                toRet.push({ start: left, end: right, items: uniqueItems })
                console.log(items)
                items = []
            }
            left = right
        }
    }
    console.log(toRet)

    return toRet
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
            start: convertToDate(item.start),
            end: convertToDate(item.end),
            days: [
                item.sunday,
                item.monday,
                item.tuesday,
                item.wednesday,
                item.thursday,
                item.friday,
                item.saturday
            ]
        })),
    }))

    const items = mappedUsers.map((user) => user.items).flat()
    const slots = generateSlots(items)

    return {
        session: params.session,
        group: group[0],
        users: mappedUsers,
        items: items,
        slots: slots,
        groups: [
            generateSubsets(slots, assignSlots(items, slots, Day.SUNDAY)),
            generateSubsets(slots, assignSlots(items, slots, Day.MONDAY)),
            generateSubsets(slots, assignSlots(items, slots, Day.TUESDAY)),
            generateSubsets(slots, assignSlots(items, slots, Day.WEDNESDAY)),
            generateSubsets(slots, assignSlots(items, slots, Day.THURSDAY)),
            generateSubsets(slots, assignSlots(items, slots, Day.FRIDAY)),
            generateSubsets(slots, assignSlots(items, slots, Day.SATURDAY)),
        ]
    }
}


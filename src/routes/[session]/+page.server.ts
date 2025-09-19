import { db } from "$lib/server/db"
import { groups } from "$lib/server/db/schema"
import { eq } from "drizzle-orm"
import type {PageLoad} from "./$types"
import { error } from "@sveltejs/kit"

export const load: PageLoad = async ({params}) => {
    const group = await db.select().from(groups).where(eq(groups.id, parseInt(params.session)))
    if (group.length == 0) {
        return error(404, {
            message: 'Group not found'
        })
    }
    return {
        session: params.session
    }
}


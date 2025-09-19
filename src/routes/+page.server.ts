import { db } from "$lib/server/db";
import { groups } from "$lib/server/db/schema";
import { redirect, type Actions } from "@sveltejs/kit";

export const actions = {
    createSession: async() => {
        console.log("ASDHA")
        const newGroup = await db.insert(groups).values({name: "New Group"}).returning()
        return redirect(303, `/${newGroup[0].id}`)
    }
} satisfies Actions


import { groups, items, users, type NewUser } from "$lib/server/db/schema"

export type ParsedItem = Omit<typeof items.$inferSelect, "start" | "end"> & { days: boolean[]; start: Date; end: Date; }

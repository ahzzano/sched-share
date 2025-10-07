
import { groups, items, users, type NewUser } from "$lib/server/db/schema"

export type ParsedItem = Omit<typeof items.$inferSelect, "start" | "end"> & { days: boolean[]; start: Date; end: Date; }

export type UserWithItems = {
    items: {
        start: Date;
        end: Date;
        days: (boolean | null)[];
        user: number;
        id: number;
        name: string | null;
        monday: boolean | null;
        tuesday: boolean | null;
        wednesday: boolean | null;
        thursday: boolean | null;
        friday: boolean | null;
        saturday: boolean | null;
        sunday: boolean | null;
    }[];
    id: number;
    name: string | null;
    password: string | null;
    group: number;
}

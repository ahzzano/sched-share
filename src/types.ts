
type ParsedItem = Omit<typeof items.$inferSelect, "start" | "end"> & { days: boolean[]; start: Date; end: Date; }

export enum SELECTED_DAYS {
    ALL = -1,
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6,
}


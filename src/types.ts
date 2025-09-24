
type ParsedItem = Omit<typeof items.$inferSelect, "start" | "end"> & { days: boolean[]; start: Date; end: Date; }


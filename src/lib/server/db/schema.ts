import { relations } from 'drizzle-orm';
import { pgTable, serial, integer, text, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
	id: serial('id').primaryKey(),
	name: text('name'),
    password: text('password'),
    group: serial('group_id').references(() => groups.id),
});

export const groups = pgTable('group', {
    id: serial('id').primaryKey(),
    name: text('name'),
})

export const items = pgTable('items', {
    id: serial('id').primaryKey(),
    name: text('name'),
    // schedule: serial('schedule_id').references(() => schedules.id).notNull(),
    user: serial('user_id').references(() => users.id).notNull(),
    start: text('start_time').notNull(),
    end: text('end_time').notNull(),
    monday: boolean('monday'),
    tuesday: boolean('tuesday'),
    wednesday: boolean('wednesday'),
    thursday: boolean('thursday'),
    friday: boolean('friday'),
    saturday: boolean('saturday'),
    sunday: boolean('sunday'),
})

export const userRelations = relations(users, ({many}) => ({
    items: many(items)
}))

export const itemRelations = relations(items, ({one}) => ({
    schedule: one(users, {
        fields: [items.user],
        references: [users.id]
    })
 
}))

export type NewUser = typeof users.$inferInsert
export type NewItem = typeof items.$inferInsert
export type User = typeof users.$inferSelect


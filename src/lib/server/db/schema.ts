import { pgTable, serial, integer, text } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
	id: serial('id').primaryKey(),
	name: text('name'),
    password: serial('password'),
    group: serial('group_id').references(() => groups.id),
});

export const groups = pgTable('group', {
    id: serial('id').primaryKey(),
    name: text('name'),
})

export const schedules = pgTable('schedules', { 
    id: serial('id'),
    user: serial('user_id').references(() => users.id).notNull()
})

export const items = pgTable('items', {
    name: serial('id'),
    schedule: serial('schedule_id').references(() => schedules.id).notNull(),
    start: text('start-time'),
    end: text('start-time'),
    days: text('days') 
})

import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';


export const priorityEnum = ['low', 'medium', 'high', 'urgent'] as const;
export type Priority = typeof priorityEnum[number];

export const todos = sqliteTable('todos', {
  id: int('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  completed: int('completed', { mode: 'boolean' }).notNull().default(false),
  priority: text('priority', { enum: priorityEnum }).notNull().default('medium'),
  createdAt: int('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
import { relations } from 'drizzle-orm';
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

export const photos = sqliteTable('photos', {
  id: int('id').primaryKey({ autoIncrement: true }),
  uri: text('uri').notNull(),
  todoId: int('todo_id').notNull()
    .references(() => todos.id, { onDelete: 'cascade' }),
  createdAt: int('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
});

// Relaciones
export const todosRelations = relations(todos, ({ many }) => ({
  photos: many(photos),
}));

export const photosRelations = relations(photos, ({ one }) => ({
  todo: one(todos, {
    fields: [photos.todoId],
    references: [todos.id],
  }),
}));


export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
export type Photo = typeof photos.$inferSelect;
export type NewPhoto = typeof photos.$inferInsert;

export type TodoWithPhotos = Todo & { photos: Photo[] };
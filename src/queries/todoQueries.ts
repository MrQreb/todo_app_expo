import { desc, eq } from 'drizzle-orm';
import { db } from '../db/client';
import { photos, Priority, todos } from '../db/schema';

/**
 * Queries personalizadas de los todos
 */
export const todoQueries = {

    getAll: () => {

        return db.select().
            from(todos).
            orderBy(
                desc(todos.createdAt)
            );
    },

    getByPriority: (priority: Priority) => {
        return db.select()
            .from(todos)
            .where(
                eq(todos.priority, priority)
            )
    },

    getCompleted: (isCompleted: boolean = true) => {
        return db.select()
            .from(todos)
            .where(
                eq(todos.completed, isCompleted)
            )
    },
    updateTitle: async (id: number, newTitle: string) => {
        await db.update(todos)
            .set({ title: newTitle })
            .where(eq(todos.id, id));
    },
    getLastWithPhotos: () => {
        return db.select({
            todo: todos,
            photo: photos,
        })
            .from(todos)
            .leftJoin(photos, eq(photos.todoId, todos.id))
            .orderBy(desc(todos.createdAt))
            .limit(1);
    },
}

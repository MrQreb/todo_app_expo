import { desc, eq } from 'drizzle-orm';
import { db } from '../db/client';
import { Priority, todos } from '../db/schema';

export const todoQueries = {

    getAll: () => {
        return db.query.todos.findMany({
            with: { photos: true },
            orderBy: desc(todos.createdAt),
        });
    },

    getCompleted: (isCompleted: boolean = true) => {
        return db.query.todos.findMany({
            with: { photos: true },
            where: eq(todos.completed, isCompleted),
        });
    },

    getByPriority: (priority: Priority) => {
        return db.query.todos.findMany({
            with: { photos: true },
            where: eq(todos.priority, priority),
        });
    },

    getLastWithPhotos: async () => {
        return db.query.todos.findFirst({
            with: { photos: true },
            orderBy: desc(todos.createdAt),
        });
    },

    updateTitle: async (id: number, newTitle: string) => {
        await db.update(todos)
            .set({ title: newTitle })
            .where(eq(todos.id, id));
    },
};
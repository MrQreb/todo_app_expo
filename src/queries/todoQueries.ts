import { desc, eq } from 'drizzle-orm';
import { db } from '../db/client';
import { Priority, todos } from '../db/schema';

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
    }
}
import { Todo } from "@/src/db/schema";
import { todoQueries } from "@/src/queries/todoQueries";
import { useEffect, useState } from 'react';

export const useTodoDetail = (todo: Todo | null) => {
  const [editedTitle, setEditedTitle] = useState(todo?.title ?? '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditedTitle(todo?.title ?? '');
  }, [todo]);

  const saveTitle = async () => {
    if (!todo || editedTitle.trim() === todo.title) return;
    setIsSaving(true);
    await todoQueries.updateTitle(todo.id, editedTitle.trim());
    setIsSaving(false);
  };

  return { editedTitle, setEditedTitle, saveTitle, isSaving };
};

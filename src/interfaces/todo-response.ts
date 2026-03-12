import { Priority } from "@src/db/schema";

export interface TodoWithPhotos {
    photos: Photos | null;
    todos:  Todos;
}

export interface Photos {
    createdAt: Date;
    id:        number;
    todoId:    number;
    uri:       string;
}

export interface Todos {
    completed: boolean;
    createdAt: Date;
    id:        number;
    priority:  Priority;
    title:     string;
}

import * as todosAcess from '../helpers/todosAcess';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

// TODO: Implement businessLogic
async function getTodosForUser(userId: string) {
    return todosAcess.getTodosOfUser(userId);
}

async function createTodo(userId: string, newTodo: CreateTodoRequest) {
    const todoItem: TodoItem = {
        ...newTodo,
        userId,
        done: false,
        todoId: uuid.v4(),
        attachmentUrl: '',
        createdAt: new Date().toDateString()
    };
    await todosAcess.createTodo(todoItem);
    return todoItem;
}

async function updateTodo(userId: string, todoId: string, updatedTodo: UpdateTodoRequest) {
    await todosAcess.updateTodo(userId, todoId, updatedTodo);
}

async function deleteTodo(userId: string, todoId: string) {
    await todosAcess.deleteTodo(userId, todoId);
}

export {
    createTodo,
    updateTodo,
    deleteTodo,
    getTodosForUser
}
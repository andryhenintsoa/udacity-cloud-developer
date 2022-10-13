import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const logger = createLogger('TodosAccess')

const docClient = new DocumentClient()
const todosTable = process.env.TODOS_TABLE

// TODO: Implement the dataLayer logic
async function getTodosOfUser(userId: string) {
    const result = await docClient
      .query({
        TableName: todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise();
      logger.info('List of items: ' + JSON.stringify(result));
    return result.Items;
}

async function createTodo(todoItem: TodoItem) {
    await docClient.put({
        TableName: todosTable,
        Item: todoItem
    }).promise()
    logger.info('New item: ' + JSON.stringify(todoItem));
}

async function addTodoImageUrl(userId: string, todoId: string) {
    await docClient
        .update({
          TableName: todosTable,
          Key: { userId, todoId },
          UpdateExpression: 'set attachmentUrl = :attachmentUrl',
          ExpressionAttributeValues: {
            ':attachmentUrl': `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}`
          }
        })
        .promise();
        logger.info('Image url added');
  }

async function updateTodo(userId: string, todoId: string, updatedTodo: TodoUpdate) {
  await docClient
      .update({
        TableName: todosTable,
        Key: { userId, todoId },
        UpdateExpression: 'set #todoName = :todoName, dueDate = :dueDate, done = :done', // Use an alias as name is reserved
        ExpressionAttributeNames: { '#todoName': 'name' },
        ExpressionAttributeValues: {
          ':todoName': updatedTodo.name,
          ':dueDate': updatedTodo.dueDate,
          ':done': updatedTodo.done
        }
      })
      .promise();
      logger.info('Item updated: ', + JSON.stringify(updatedTodo));
}

async function deleteTodo(userId: string, todoId: string) {
    await docClient
      .delete({
        TableName: todosTable,
        Key: { userId, todoId }
      })
      .promise();
      logger.info('Item deleted')
}

export {
    getTodosOfUser,
    addTodoImageUrl,
    createTodo,
    updateTodo,
    deleteTodo
}
'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');
const dbContext = new AWS.DynamoDB.DocumentClient();
const listsTable = process.env.TODOS_TABLE;

exports.handler = async (event) => {
  console.log('Processing event:', event);

  const body = JSON.parse(event.body);
  const item = {
    id: uuid.v4(),
    createdAt: new Date().toISOString(),
    name: body.name,
    dueDate: body.dueDate,
    done: body.done,
    atatchmentUrl: body.atatchmentUrl,
    userId: body.userId
  };

  const result = await dbContext.put({
    TableName: listsTable,
    Item: item
  }).promise();

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(item)
  }
};
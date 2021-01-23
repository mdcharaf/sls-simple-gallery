'use strict';

const AWS = require('aws-sdk');
const dbContext = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.GALLERY_TABLE;

exports.handler = async (event) => {
  console.log('Processing event:', event);

  const result = await dbContext.scan({
    TableName: tableName
  }).promise();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(result.Items)
  }
};
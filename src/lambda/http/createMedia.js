'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');
const response = require('../../utils/response.js');
const dbContext = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3({ signatureVersion: 'v4' });
const mediaTable = process.env.MEDIA_TABLE;
const galleryTable = process.env.GALLERY_TABLE;
const bucketName = process.env.MEDIA_S3_BUCKET;

exports.handler = async (event) => {
  console.log('Processing event:', event);

  const body = JSON.parse(event.body);
  const galleryId = body.galleryId;
  const gallery = dbContext.get({
    TableName: mediaTable,
    Key: {
      'id': {
        S: galleryId
      }
    }
  })

  const id = uuid.v4();
  const item = {
    id,
    createdAt: new Date().toISOString(),
    galleryId,
    url: `https://${bucketName}.s3.amazonaws.com/${id}`
  };

  await dbContext.put({
    TableName: mediaTable,
    Item: item
  }).promise();

  const uploadImageURL = getUploadURL(item.id);

  return response.created(201, { 
    ...item, 
    uploadImageURL 
  });
};

function getUploadURL (key) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: key,
    Expires: process.env.SIGNED_URL_AGE,
  });
}

function getGallery(galleryId) {
  return dbContext.get({ 
    TableName: galleryTable,
    Key: {
      'id': {
        S: galleryId
      }
    }
  }).promise();
}
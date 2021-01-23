'use strict';

exports.handler = async (event) => {
  try {
    verifyToken(event.authorizationToken);

    console.log('User successfully authorized');

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (error) {
    console.log('User auth failed');

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
};

function verifyToken(authHeader) {
  if (!authHeader) {
    throw new Error('Null auth header')
  }
  
  if (!authHeader.toLocaleLowerCase().startsWith('bearer ')) {
    throw new Error('Invalid auth header format');
  }
  
  const token = authHeader.split(' ')[1];

  if (token !== '123') {
    throw new Error('Invalid auth token')
  }
}
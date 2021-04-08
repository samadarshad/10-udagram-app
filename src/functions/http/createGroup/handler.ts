import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient()

const groupsTable = process.env.GROUPS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  const id = uuid.v4()

  let body
  if (event.body !== null && event.body !== undefined) {
      body = JSON.parse(event.body)
  }

  const newItem = {
      id,
      ...body
  }

  console.log('newItem: ', newItem)

  await docClient.put({
      TableName: groupsTable,
      Item: newItem
  }).promise()


  return {
      statusCode: 201,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
          newItem
      })
  }
}

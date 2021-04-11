import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        method: 'post',
        path: 'groups',
        cors: true,
        authorizer: 'RS256Auth',
        request: {
          schema: {
            'application/json': '${file(models/create-group-request.json)}'
          }
        }
      }
    }
  ],
  deploymentSettings: {
    type: 'Linear10PercentEvery1Minute',
    alias: 'Live'
  }
}

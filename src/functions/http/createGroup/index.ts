import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        method: 'post',
        path: 'groups',
        cors: true,
        request: {
          schema: {
            'application/json': '${file(models/create-group-request.json)}'
          }
        }
      }
    }
  ]
}
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        method: 'post',
        path: 'groups/{groupId}/images',
        cors: true,
        request: {
          schema: {
            'application/json': '${file(models/create-image-request.json)}'
          }
        }
      }
    }
  ]
}

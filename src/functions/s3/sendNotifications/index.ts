import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      s3: {
        bucket: "serverless-udagram-324941539183-images-dev",
        event: 's3:ObjectCreated:*',
        existing: true,
      }
    }
  ]
}

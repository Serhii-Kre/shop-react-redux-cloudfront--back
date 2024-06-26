import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: '${self:provider.environment.S3_BUCKET_NAME}',
        event: "s3:ObjectCreated:*",
        rules: [{ prefix: "uploaded/" }],
        existing: true,
      },
    },
  ],
};

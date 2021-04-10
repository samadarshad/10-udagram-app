export default {
    accountId: "324941539183",
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    GROUPS_TABLE: "Groups-${self:provider.stage}",
    IMAGES_TABLE: "Images-${self:provider.stage}",
    CONNECTIONS_TABLE: "Connections-${self:provider.stage}",
    IMAGE_ID_INDEX: "ImageIdIndex",
    IMAGES_S3_BUCKET: "serverless-udagram-${self:provider.environment.accountId}-images-${self:provider.stage}",
    SIGNED_URL_EXPIRATION: '300',
    THUMBNAILS_S3_BUCKET: 'serverless-udagram-thumbnail-${self:provider.environment.accountId}-${self:provider.stage}',
    AUTH_0_SECRET_ID: 'Auth0Secret-${self:provider.stage}',
    AUTH_0_SECRET_FIELD: 'auth0Secret'
  }
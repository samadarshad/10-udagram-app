export default [
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:Scan',
        'dynamodb:PutItem',
        'dynamodb:GetItem'
      ],
      Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.GROUPS_TABLE}'
    },
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:Query',
        'dynamodb:PutItem'
      ],
      Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.IMAGES_TABLE}'
    },
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:Query'
      ],
      Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.IMAGES_TABLE}/index/${self:provider.environment.IMAGE_ID_INDEX}'
    },
    {
      Effect: 'Allow',
      Action: [
        's3:PutObject',
        's3:GetObject'
      ],
      Resource: 'arn:aws:s3:::${self:provider.environment.IMAGES_S3_BUCKET}/*'
    },
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:Scan',
        'dynamodb:PutItem',
        'dynamodb:DeleteItem',
      ],
      Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.CONNECTIONS_TABLE}'
    },
    {
      Effect: 'Allow',
      Action: [
        's3:PutObject',
      ],
      Resource: 'arn:aws:s3:::${self:provider.environment.THUMBNAILS_S3_BUCKET}/*'
    }, 
    {
      Effect: 'Allow',
      Action: [
        'codedeploy:*',
      ],
      Resource: '*'
    }
]
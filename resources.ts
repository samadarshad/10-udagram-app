export default {
    Resources: {
      'GroupsDynamoDBTable': {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [{
            AttributeName: 'id',
            AttributeType: 'S'
          }],
          KeySchema: [{
            AttributeName: 'id',
            KeyType: 'HASH'
          }],
          BillingMode: 'PAY_PER_REQUEST',
          TableName: "${self:provider.environment.GROUPS_TABLE}"
        }
      },
      'ImagesDynamoDBTable': {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'groupId',
              AttributeType: 'S'
            },
            {
              AttributeName: 'timestamp',
              AttributeType: 'S'
            },
            {
              AttributeName: 'imageId',
              AttributeType: 'S'
            }
          ],
          KeySchema: [
            {
              AttributeName: 'groupId',
              KeyType: 'HASH'
            },
            {
              AttributeName: 'timestamp',
              KeyType: 'RANGE'
            },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: "${self:provider.environment.IMAGE_ID_INDEX}",
              KeySchema: [
                {
                  AttributeName: 'imageId',
                  KeyType: 'HASH'
                }
              ],
              Projection: {
                ProjectionType: 'ALL'
              }
            }
          ],
          BillingMode: 'PAY_PER_REQUEST',
          TableName: "${self:provider.environment.IMAGES_TABLE}",
          StreamSpecification: {
            StreamViewType: 'NEW_IMAGE'
          }
        }
      },
      'AttachmentsBucket': {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: "${self:provider.environment.IMAGES_S3_BUCKET}",
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: ['*'],
                AllowedHeaders: ['*'],
                AllowedMethods: [
                  'GET',
                  'PUT',
                  'POST',
                  'DELETE',
                  'HEAD'              
                ],
                MaxAge: 3000
              }
            ]
          }
        }
        
      }, 
      'BucketPolicy': {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          PolicyDocument: {
            Id: 'MyPolicy',
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'PublicReadForGetBucketObjects',
                Effect: 'Allow',
                Principal: '*',
                Action: 's3:GetObject',
                Resource: 'arn:aws:s3:::${self:provider.environment.IMAGES_S3_BUCKET}/*'
              }
            ]
          },
          Bucket: {
            Ref: "AttachmentsBucket"
          }
        }
      },
      'WebSocketConnectionsDynamoDBTable': {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S'
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH'
            }
          ],
          BillingMode: 'PAY_PER_REQUEST',
          TableName: "${self:provider.environment.CONNECTIONS_TABLE}"
        }        
      },
      'ImagesSearch': {
        Type: 'AWS::Elasticsearch::Domain',
        Properties: {
          ElasticsearchVersion: '6.3',
          DomainName: 'images-search-${self:provider.stage}',
          ElasticsearchClusterConfig: {
            DedicatedMasterEnabled: false,
            InstanceCount: '1',
            ZoneAwarenessEnabled: false,
            InstanceType: 't2.small.elasticsearch'
          },
          EBSOptions: {
            EBSEnabled: true,
            Iops: 0,
            VolumeSize: 10,
            VolumeType: 'gp2'
          },
          AccessPolicies: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  AWS: ['*']
                },
                Action: ['es:*'],
                Resource: 'arn:aws:es:${self:provider.region}:${self:provider.environment.accountId}:domain/images-search-${self:provider.stage}/*'
              }
            ]
          }
        }
      }
    }
  }
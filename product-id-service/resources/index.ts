import dynamodb from "./dynamodb"

export const resources = {
    Resources: {
      ...dynamodb,
      catalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: '${self:provider.environment.CATALOG_ITEMS_QUEUE}',
        },
      },
      createProductTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "createProductTopic",
        },
      },
      createProductTopicSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Protocol: "email",
          TopicArn: {
            Ref: "createProductTopic",
          },
          Endpoint: "serhii_krechmarovskyi@epam.com",
        },
      },
      
    },
    Outputs: {
    CatalogItemsQueueUrl: {
      Value: {
        Ref: '${self:provider.environment.CATALOG_ITEMS_QUEUE}',
      },
      Export: {
        Name: 'CatalogItemsQueueUrl',
      },
    },
    CatalogItemsQueueArn: {
      Value: {
        'Fn::GetAtt': ['${self:provider.environment.CATALOG_ITEMS_QUEUE}', 'Arn'],
      },
      Export: {
        Name: 'CatalogItemsQueueArn',
      },
    },
  }
  }
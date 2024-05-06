import type { AWS } from '@serverless/typescript';
import 'dotenv/config'
import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-esbuild'], 
 
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'eu-central-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
      CATALOG_ITEMS_QUEUE_URL: '${self:custom.CatalogItemsQueueUrl}',
			CATALOG_ITEMS_QUEUE_ARN: '${self:custom.CatalogItemsQueueArn}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              's3:*',
              's3-object-lambda:*'
            ],
            Resource: 'arn:aws:s3:::${self:provider.environment.S3_BUCKET_NAME}/*',
          },
          {
            Effect: "Allow",
            Action: ["sqs:SendMessage"],
            Resource: "${self:provider.environment.CATALOG_ITEMS_QUEUE_ARN}",
          },
        ]
      }
    }
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  resources: {
    Resources: {
      ImportS3Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:provider.environment.S3_BUCKET_NAME}',
          VersioningConfiguration: {
            Status: 'Enabled'
          },
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: ["*"],
                AllowedHeaders: ["*"],
                AllowedMethods: ["GET", "PUT", "HEAD"],
              },
            ],
          }
        },
      },
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    CatalogItemsQueueUrl: {
			'Fn::ImportValue': 'CatalogItemsQueueUrl',
		},
		CatalogItemsQueueArn: {
			'Fn::ImportValue': 'CatalogItemsQueueArn',
		}
  },
};

module.exports = serverlessConfiguration;

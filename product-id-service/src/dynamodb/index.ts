import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";


const client = new DynamoDBClient({region: 'eu-central-1', });
export const dynamoDB = DynamoDBDocumentClient.from(client);
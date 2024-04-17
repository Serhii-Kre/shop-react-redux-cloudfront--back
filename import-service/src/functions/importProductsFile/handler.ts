import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


export const importProductsFile: ValidatedEventAPIGatewayProxyEvent<null> = async (event:any) => {
  try {
    const client = new S3Client({region: 'eu-central-1'});
    const fileName = event?.queryStringParameters?.name;

    const commandParams = {Bucket: process.env.S3_BUCKET_NAME, Key: `uploaded/${fileName}`}

    const command = new PutObjectCommand(commandParams);

    const presignedURL = await getSignedUrl(client, command, {expiresIn: 3600});

    return formatJSONResponse({url: presignedURL})
  } catch (err) {
    if (err.$metadata?.httpStatusCode === 403 || err.$metadata?.httpStatusCode === 404) {
      return formatJSONResponse({message:'File not found'});
    }
    return formatJSONResponse({message:'Internal server error'})
  }

};

export const main = middyfy(importProductsFile);

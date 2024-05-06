import { SQSEvent } from "aws-lambda";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { createProduct } from "@functions/createProduct/createProduct";
import { AvailableProduct } from "@models/product";

const snsClient = new SNSClient({region: "eu-central-1"});

export const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    for (const record of event.Records) {
      const product = JSON.parse(record.body) as AvailableProduct;
      
      await createProduct(product)
      const params = {
        Message: `${product.title}s was created. Count is ${product.count}`,
        TopicArn: process.env.SNS_TOPIC_ARN,
        MessageAttributes: {
          count: {
            DataType: 'Number',
            StringValue: String(product.count)
          }
        }
      };
     
      await snsClient.send(new PublishCommand(params))
    }
  } catch (err) {
    const params = {
      Message: JSON.stringify(err),
      TopicArn: process.env.SNS_TOPIC_ARN,
    };
   
    await snsClient.send(new PublishCommand(params))
  }
}

export const main = catalogBatchProcess;

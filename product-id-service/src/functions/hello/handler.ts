import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { middyfy } from '@libs/lambda';
import { dynamoDB } from "../../dynamodb";
import products from '@mocks/products';


const hello: ValidatedEventAPIGatewayProxyEvent<any> = async (event: any) => {

for (const product of products) {
  const putProductCommand = new PutCommand({
    TableName: process.env.PRODUCTS_TABLE,
    Item: product,
  });
  const putStockCommand = new PutCommand({
    TableName: process.env.STOCK_TABLE,
    Item: {
      id: product.id,
      count: Math.floor(Math.random() * 20) + 1,
    }
  })
  await dynamoDB.send(putProductCommand);
  await dynamoDB.send(putStockCommand);

 }

  return formatJSONResponse({message: 'Done!'});
};

export const main = middyfy(hello);

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { AvailableProduct } from "@models/product";
import { dynamoDB } from "@dynamodb/index";


const getProductsById: ValidatedEventAPIGatewayProxyEvent<AvailableProduct> = async (event) => {
  const getProductCommand = new GetCommand({
    TableName: process.env.PRODUCTS_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  });

  const getCountCommand = new GetCommand({
    TableName: process.env.STOCK_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  });

  const {Item: product} = await dynamoDB.send(getProductCommand);
  const {Item: stock} = await dynamoDB.send(getCountCommand);

  if (!product) {
    return formatJSONResponse({message: `Product with ID ${event.pathParameters.id} not found`});
  }
  if (!stock) {
    return formatJSONResponse({message:'Information about count not found'});
  }

  return formatJSONResponse({...product, ...stock});
  
};

export const main = middyfy(getProductsById);

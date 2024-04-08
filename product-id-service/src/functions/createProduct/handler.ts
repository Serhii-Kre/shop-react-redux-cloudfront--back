import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { AvailableProduct } from "@models/product";
import { dynamoDB } from "@dynamodb/index";
import { CreateProductBodySchema } from "../../schemas/createProd.schema";


const getProductsById: ValidatedEventAPIGatewayProxyEvent<AvailableProduct> = async (event) => {
  const {error, value} = CreateProductBodySchema.validate(event.body)

  if (error) {
    return formatJSONResponse(error.details.map((err) => err.message).join(', '))
  }

  const {count = 0, ...product} = value
  const id = uuidv4();

  const createProductCommand = new PutCommand({
    TableName: process.env.PRODUCTS_TABLE,
    Item: {
      id,
      ...product,
    },
  });
  const createStockCommand = new PutCommand({
    TableName: process.env.STOCK_TABLE,
    Item: {
      id,
      count,
    },
  });
  await dynamoDB.send(createProductCommand);
  await dynamoDB.send(createStockCommand);

  return formatJSONResponse({id, count, ...product});
  
};

export const main = middyfy(getProductsById);

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { GetCommand, ScanCommand} from "@aws-sdk/lib-dynamodb";
import { AvailableProduct, Product } from "@models/product";
import { dynamoDB } from "@dynamodb/index";


const getProductsById: ValidatedEventAPIGatewayProxyEvent<AvailableProduct> = async (event) => {
  const getCommand = new ScanCommand({
    TableName: process.env.PRODUCTS_TABLE,
    ConsistentRead: true,
  });
  const {Items} = await dynamoDB.send(getCommand);

  const products: AvailableProduct[] = await Promise.all(Items.map(async (product: Product): Promise<AvailableProduct> => {
    const getCountCommand = new GetCommand({
      TableName: process.env.STOCK_TABLE,
      Key: {
        id: product.id
      }
    });
    const {Item: stock} = await dynamoDB.send(getCountCommand);
    return {...product, ...stock} as AvailableProduct;
  }))
  return formatJSONResponse(products);
};

export const main = middyfy(getProductsById);

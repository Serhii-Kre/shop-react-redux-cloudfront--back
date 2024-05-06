import { middyfy } from "@libs/lambda";
import { createProduct } from "./createProduct";
import { ValidatedAPIGatewayProxyEvent } from "@libs/api-gateway";
import { AvailableProduct } from "@models/product";

export const main = middyfy((event: ValidatedAPIGatewayProxyEvent<AvailableProduct>) => createProduct(event.body));
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

const headers = {
  'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE',
'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
}

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(response)
  }
}

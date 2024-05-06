import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"

export type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: S }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

const headers = {
  'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE',
'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
}


export const formatJSONResponse = (response: any) => {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(response)
  }
}

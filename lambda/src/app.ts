import { APIGatewayEvent, APIGatewayProxyEvent, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

exports.lambdaHandler = async (event: APIGatewayEvent, context: APIGatewayProxyEvent): Promise<APIGatewayProxyStructuredResultV2> => {
    let response = {
        'statusCode': 500,
        'body': "Something has gone wrong"
    }

    try {


    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};

import { APIGatewayAuthorizerEvent, APIGatewayAuthorizerResult, APIGatewayAuthorizerHandler } from 'aws-lambda'
import 'source-map-support/register'

export const handler: APIGatewayAuthorizerHandler = async (event: APIGatewayAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
    try {
        verifyToken(event.authorizationToken)
        console.log('User was authorized');
        return allowAllIamPolicyStatement        
    } catch (error) {
        console.log('User was not authorized', error.message);
        return denyAllIamPolicyStatement    
    }    
}

function verifyToken(authHeader: string) {
    if (!authHeader)
        throw new Error('No authorization header')

    if (!authHeader.toLocaleLowerCase().startsWith('bearer '))
        throw new Error('Invalid authorization header')

    const split = authHeader.split(' ')
    const token = split[1]

    if (token !== '123')
        throw new Error('Invalid token')

    // A request has been authorized
}


const allowAllIamPolicyStatement = {
    principalId: 'user',
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: 'Allow',
                Resource: '*'
            }
        ]
    }
}

const denyAllIamPolicyStatement = {
    principalId: 'user',
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: 'Deny',
                Resource: '*'
            }
        ]
    }
}
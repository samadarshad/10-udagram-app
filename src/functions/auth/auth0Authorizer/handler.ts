import { APIGatewayAuthorizerEvent, APIGatewayAuthorizerResult, APIGatewayAuthorizerHandler } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../../auth/JwtToken'

const auth0Secret = process.env.AUTH_0_SECRET

export const handler: APIGatewayAuthorizerHandler = async (event: APIGatewayAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
    try {
        const decodedToken = verifyToken(event.authorizationToken)
        console.log('User was authorized');
        return allowAllIamPolicyStatement(decodedToken.sub)        
    } catch (error) {
        console.log('User was not authorized', error.message);
        return denyAllIamPolicyStatement    
    }    
}

function verifyToken(authHeader: string): JwtToken {
    if (!authHeader)
        throw new Error('No authorization header')

    if (!authHeader.toLocaleLowerCase().startsWith('bearer '))
        throw new Error('Invalid authorization header')

    const split = authHeader.split(' ')
    const token = split[1]


    return verify(token, auth0Secret) as JwtToken
}


const allowAllIamPolicyStatement = (userId) => {
    return {
        principalId: userId,
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
import { APIGatewayAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../../auth/JwtToken'

import * as middy from 'middy'
import { secretsManager } from 'middy/middlewares'

const secretId = process.env.AUTH_0_SECRET_ID
const secretField = process.env.AUTH_0_SECRET_FIELD


export const handler = middy(async (
    event: APIGatewayAuthorizerEvent, 
    context
): Promise<APIGatewayAuthorizerResult> => {
    try {
        const decodedToken = verifyToken(
            event.authorizationToken,
            context.AUTH0_SECRET[secretField]
        )
        console.log('User was authorized');
        return allowAllIamPolicyStatement(decodedToken.sub)        
    } catch (error) {
        console.log('User was not authorized', error.message);
        return denyAllIamPolicyStatement    
    }    
})

function verifyToken(authHeader: string, secret: string): JwtToken {
    if (!authHeader)
        throw new Error('No authorization header')

    if (!authHeader.toLocaleLowerCase().startsWith('bearer '))
        throw new Error('Invalid authorization header')

    const split = authHeader.split(' ')
    const token = split[1]

    return verify(token, secret) as JwtToken
}

handler.use(
    secretsManager({
        cache: true,
        cacheExpiryInMillis: 60000,
        throwOnFailedCall: true,
        secrets: {
            AUTH0_SECRET: secretId
        }
    })
)

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
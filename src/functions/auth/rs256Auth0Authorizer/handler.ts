import { APIGatewayAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../../auth/JwtToken'

export const handler = async (event: APIGatewayAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
    try {
        const decodedToken = verifyToken(
            event.authorizationToken
        )
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

    return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}

const cert = `-----BEGIN CERTIFICATE-----
MIIDFTCCAf2gAwIBAgIJc+Zq+K/kmQLRMA0GCSqGSIb3DQEBCwUAMCgxJjAkBgNV
BAMTHWFiZHVzLXNhbWFkLWZzbmQuZXUuYXV0aDAuY29tMB4XDTIwMTIxMDE3MTMx
MloXDTM0MDgxOTE3MTMxMlowKDEmMCQGA1UEAxMdYWJkdXMtc2FtYWQtZnNuZC5l
dS5hdXRoMC5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQClH0K5
C+Y2alRfedWKj3e45MdZ2GRjU5XpZMQQh3MiI0szDvZBRgR2CMmhDtCDflsxtjQF
hySsN32cjKsUczicovLFzxxdDDlufj02yo6UjYYtLZWXG9JRyrdW3NURQYC1877x
Vd+Iz5FYTAy1ztBp1kiBxNBDMmLajidzGd0vsz85YaMb/kMMHlNCz4pgIq9/GB4s
MUetaysErhcbI8esVx1AdbtzJllhzfMlTZ1xGasnVY3yEvxuyIrL3Q3vrmgElEtG
wUuaUlXTAgWLGUemS+/ccC4k+hSvTz1TuJFUwNW/TYGvxmsvsPlYWlk6CluIh7YV
CXHD2ZvorkTvtSqLAgMBAAGjQjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYE
FPdPx+RiX3d+XsxvtfRSNaevFzQlMA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0B
AQsFAAOCAQEAYNgs5a1euw1pb4NYCC3RjiZodoABlU2BJUpfkXu0drEu4tMneCo5
fWG69M5DvrBgBtclOeGDui5yK0JAfZsHEH9vCwcDJSqU/fOMhr7vBhe00VJBxMTL
eI6JB+duub/ZLVJFPu1tLrVdoq86wsfIIT1BJ5m2y2l9iybaDA4luIp7NR+NKBwc
NQof9f6zIxUGIGwARkDXujTPbuBH7AVgOWDNbZS1OFtlQmGRE78d6x+wLHGbQFV0
bRWsuQHFJRkKo2K+8/nxozna1j+Uu3MSfPul/SgcejEFBApUTIKLKYuglC65fljh
qp2KEorduceEn153NJGwpxw0Pgn5PkfBoQ==
-----END CERTIFICATE-----`

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
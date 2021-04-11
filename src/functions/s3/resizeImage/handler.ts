import { SNSHandler, SNSEvent, S3EventRecord } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)

import Jimp from 'jimp/es'

const s3 = new XAWS.S3()

const imagesBucketName = process.env.IMAGES_S3_BUCKET
const thumbnailsBucketName = process.env.THUMBNAILS_S3_BUCKET

export const handler: SNSHandler = async (event: SNSEvent) => {
    console.log('Processing SNS event ', JSON.stringify(event));
    for (const snsRecord of event.Records) {
        const s3EventStr = snsRecord.Sns.Message
        console.log('Processing S3 event', s3EventStr);
        const s3Event = JSON.parse(s3EventStr)

        for (const record of s3Event.Records) {
            await processImage(record)
        }
        
    }
    
}

async function processImage(record: S3EventRecord) {
    const key = record.s3.object.key

    const response = await s3
        .getObject({
            Bucket: imagesBucketName,
            Key: key
        }).promise()

    const body = response.Body as string

    const convertedBuffer = await resizeImage(body)

    await s3
        .putObject({
            Bucket: thumbnailsBucketName,
            Key: `${key}.jpeg`,
            Body: convertedBuffer
        })
        .promise()
}

async function resizeImage(body: string) {
    console.log('Reading image');
    
    const image = await Jimp.read(body)

    console.log('resizing image');
    image.resize(150, Jimp.AUTO)

    console.log('Converting image');
    const convertedBuffer = await image.getBufferAsync(Jimp.AUTO)
    return convertedBuffer
}


// lib/r2.ts
import AWS from "aws-sdk";

const s3 = new AWS.S3({
    endpoint: process.env.R2_ENDPOINT,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    region: process.env.R2_REGION || "auto",
    signatureVersion: "v4",
});

export async function uploadToR2(
    key: string,
    buffer: Buffer,
    mimetype: string
) {
    const params = {
        Bucket: process.env.R2_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
        ACL: "private", // zdjęcia trzymamy prywatnie
    };
    await s3.putObject(params).promise();
    return key;
}

export function getR2ObjectStream(key: string) {
    const params = { Bucket: process.env.R2_BUCKET!, Key: key };
    return s3.getObject(params).createReadStream();
}

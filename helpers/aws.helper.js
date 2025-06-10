import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Use local credentials
const s3 = new S3Client({});

export const uploadFile = async (uploadInfo) => {
  const { Bucket, Key, Body, ContentType, ACL, Metadata } = uploadInfo;

  return await s3.send(
    new PutObjectCommand({
      Bucket,
      Key,
      Body,
      ContentType,
      ACL,
      Metadata,
    })
  );
};

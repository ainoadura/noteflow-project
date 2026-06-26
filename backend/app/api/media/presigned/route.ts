//app/api/media/presigned/route.ts
import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-3',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

interface PresignedUrlResponse {
  signedUrl: string;
  publicUrl: string;
}

interface ErrorResponse {
  error: string;
}

export async function POST(request: Request): Promise<NextResponse<PresignedUrlResponse | ErrorResponse>> {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME;
    if (!bucketName) {
      return NextResponse.json({ error: 'Storage configuration is missing' }, { status: 500 });
    }

    const body = await request.json() as { filename: string; contentType: string };
    const { filename, contentType } = body;

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'Missing filename or contentType in request body' }, { status: 400 });
    }

    const uniqueKey = `uploads/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueKey,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    const publicUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || 'eu-west-3'}://${uniqueKey}`;

    return NextResponse.json({
      signedUrl,
      publicUrl,
    }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('S3 Presigned URL error:', error.message);
      return NextResponse.json({ error: 'Internal server error generating upload URL' }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected backend error occurred' }, { status: 500 });
  }
}

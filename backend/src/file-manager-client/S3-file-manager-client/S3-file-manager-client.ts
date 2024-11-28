import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Stream } from 'stream';
import { FileManagerClient } from '../FileManagerClient';

@Injectable()
export class S3FileManagerClient implements FileManagerClient {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({ region: 'your-region' });
  }

  async save(key: string, file: Stream): Promise<void> {
    const chunks: Buffer[] = [];
    file.on('data', (chunk) => chunks.push(chunk));
    await new Promise((resolve) => file.on('end', resolve));
    const fileBuffer = Buffer.concat(chunks);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'your-bucket-name',
        Key: key,
        Body: fileBuffer,
        ContentType: 'application/pdf',
      }),
    );
  }

  async getByKey(key: string): Promise<Stream> {
    const response = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: 'your-bucket-name',
        Key: key,
      }),
    );
    return response.Body as Stream;
  }
}

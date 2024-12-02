import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Stream } from 'node:stream';
import { FileManagerClient } from '../file-manager-client';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3FileManagerClient implements FileManagerClient {
  private s3Client: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get<string>('S3_BUCKET');

    const region = this.configService.get<string>('S3_REGION');

    this.s3Client = new S3Client({ region });
  }

  async getSignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const expiresIn =
      this.configService.get<number>('S3_SIGNED_URL_EXPIRES_IN') || 3600; // Tempo padrão: 1 hora

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async save(
    file: Stream,
    config: { key: string; contentType: string },
  ): Promise<void> {
    const chunks: Buffer[] = [];
    file.on('data', (chunk) => chunks.push(chunk));
    await new Promise((resolve) => file.on('end', resolve));
    const fileBuffer = Buffer.concat(chunks);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: config.key,
        Body: fileBuffer,
        ContentType: config.contentType,
      }),
    );
  }

  async getByKey(key: string): Promise<Stream> {
    const response = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
    return response.Body as Stream;
  }
}

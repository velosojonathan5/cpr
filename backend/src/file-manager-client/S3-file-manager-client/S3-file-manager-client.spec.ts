import { ConfigService } from '@nestjs/config';
import { S3FileManagerClient } from './S3-file-manager-client';
import { Readable } from 'stream';

describe('S3FileManagerClient', () => {
  let fileManager: S3FileManagerClient;

  beforeEach(() => {
    fileManager = new S3FileManagerClient({
      get: () => 'ENV_VAR',
    } as unknown as ConfigService);
    fileManager['s3Client'].send = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should upload a file to S3', async () => {
      const fileContent = Buffer.from('test content');
      const stream = new Readable();
      stream.push(fileContent);
      stream.push(null);

      await fileManager.save(stream, {
        key: 'key',
        contentType: 'application/pdf',
      });

      // TODO melherar testes aqui
      expect(fileManager['s3Client'].send).toHaveBeenCalledTimes(1);
    });
  });

  describe('getByKey', () => {
    it('should retrieve a file from S3', async () => {
      fileManager['s3Client'].send = jest.fn().mockResolvedValue({ Body: '' });
      await fileManager.getByKey('key');

      // TODO melherar testes aqui
      expect(fileManager['s3Client'].send).toHaveBeenCalledTimes(1);
    });
  });
});

import { Stream } from 'node:stream';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { FileManagerClient } from '../file-manager-client';

class LocalFileManagerClient implements FileManagerClient {
  private readonly storageDirectory: string;

  constructor(storageDirectory: string) {
    this.storageDirectory = storageDirectory;

    if (!fs.existsSync(this.storageDirectory)) {
      fs.mkdirSync(this.storageDirectory, { recursive: true });
    }
  }

  getSignedUrl(key: string): Promise<string> {
    const filePath = path.join(this.storageDirectory, key);

    if (!fs.existsSync(filePath)) {
      return Promise.reject(new Error(`File with key "${key}" not found`));
    }

    return Promise.resolve(filePath);
  }

  async save(
    file: Stream,
    config: { key: string; contentType: string },
  ): Promise<void> {
    const filePath = path.join(this.storageDirectory, config.key);
    const dirPath = path.dirname(filePath);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      const writableStream = fs.createWriteStream(filePath);

      file.pipe(writableStream);

      file.on('error', (err) => {
        reject(err);
      });

      writableStream.on('finish', () => {
        resolve();
      });

      writableStream.on('error', (err) => {
        reject(err);
      });
    });
  }

  async getByKey(key: string): Promise<Stream> {
    const filePath = path.join(this.storageDirectory, key);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File with key "${key}" not found`);
    }

    return fs.createReadStream(filePath);
  }
}

export { LocalFileManagerClient };

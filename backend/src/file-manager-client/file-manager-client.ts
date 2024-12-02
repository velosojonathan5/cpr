import { Stream } from 'node:stream';

export interface FileManagerClient {
  save(
    file: Stream,
    config: { key: string; contentType: string },
  ): Promise<void>;
  getByKey(key: string): Promise<Stream>;
  getSignedUrl(key: string): Promise<string>;
}

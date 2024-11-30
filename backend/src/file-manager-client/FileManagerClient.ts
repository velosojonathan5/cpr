import { Stream } from 'node:stream';

export interface FileManagerClient {
  save(key: string, file: Stream): Promise<void>;
  getByKey(key: string): Promise<Stream>;
}

import { Readable } from 'node:stream';
import { CprDocument } from './cpr-document';

export interface CprDocumentGenerator {
  generate(data: CprDocument): Readable;
}

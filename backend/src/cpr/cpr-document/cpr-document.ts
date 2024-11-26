import { CprEntity } from 'src/entities/cpr/cpr.entity';

export type SectionTemplate = {
  titleFn?: (cpr: CprEntity) => string;
  contentFn?: (cpr: CprEntity) => string | string[];
  title?: string;
  content?: string | string[];
};

export type Signatory = { role: string; name: string; email: string };

export interface CprDocument {
  sections: SectionTemplate[];
  signatures: Signatory[];
  headerImage: string;
}

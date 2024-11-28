import { CprEntity } from '../../../entities/cpr/cpr.entity';
import { PMGCprDataModel } from './pmg-cpr-data-model'; // Ajuste o caminho conforme necessário

describe('PMGCprDataModel', () => {
  let cprDataModel: PMGCprDataModel;
  let mockCpr: CprEntity;

  beforeEach(() => {
    cprDataModel = new PMGCprDataModel();
    mockCpr = {
      emitter: {
        name: 'João da Silva',
        email: 'joao@email.com',
        individual: { spouse: true },
      },
      creditor: {
        legalName: 'Banco Credor S.A.',
        email: 'banco@email.com',
      },
      guarantor: {
        name: 'Maria Oliveira',
        email: 'maria@email.com',
      },
    } as unknown as CprEntity;
  });

  describe('generateData', () => {
    it('should generate data with header image path, sections, and signatories', () => {
      jest
        .spyOn(cprDataModel as any, 'getSections')
        .mockReturnValue([{ title: 'Seção 1', content: 'Conteúdo 1' }]);
      jest
        .spyOn(cprDataModel as any, 'getSignatories')
        .mockReturnValue([
          { role: 'Emitente', name: 'João da Silva', email: 'joao@email.com' },
        ]);

      const result = cprDataModel.generateData(mockCpr);

      expect(result).toHaveProperty(
        'headerImagePath',
        'src/assets/images/capaPMG.jpg',
      );
      expect(result.sections).toEqual([
        { title: 'Seção 1', content: 'Conteúdo 1' },
      ]);
      expect(result.signatories).toEqual([
        { role: 'Emitente', name: 'João da Silva', email: 'joao@email.com' },
      ]);
    });
  });

  describe('getSections', () => {
    it('should return an array of sections with titles and content', () => {
      const mockSections = [
        {
          titleFn: (cpr: CprEntity) => `Título para ${cpr.emitter.name}`,
          contentFn: (cpr: CprEntity) => `Conteúdo para ${cpr.emitter.email}`,
        },
      ];

      jest.spyOn(cprDataModel as any, 'getSections').mockReturnValue(
        mockSections.map((section) => ({
          title: section.titleFn(mockCpr),
          content: section.contentFn(mockCpr),
        })),
      );

      const result = (cprDataModel as any).getSections(mockCpr);

      expect(result).toEqual([
        {
          title: 'Título para João da Silva',
          content: 'Conteúdo para joao@email.com',
        },
      ]);
    });
  });

  describe('getSignatories', () => {
    it('should return the correct signatories for the CPR', () => {
      const result = (cprDataModel as any).getSignatories(mockCpr);

      expect(result).toEqual([
        {
          role: 'Emitente',
          name: 'João da Silva',
          email: 'joao@email.com',
        },
        {
          role: 'Cônjuge do emitente',
          name: 'João da Silva',
          email: 'joao@email.com',
        },
        {
          role: 'Credora',
          name: 'Banco Credor S.A.',
          email: 'banco@email.com',
        },
        {
          role: 'Interveniente Garantidor',
          name: 'Maria Oliveira',
          email: 'maria@email.com',
        },
      ]);
    });

    it('should not include the spouse if none exists', () => {
      delete mockCpr.emitter.individual.spouse;

      const result = (cprDataModel as any).getSignatories(mockCpr);

      expect(result).toEqual([
        {
          role: 'Emitente',
          name: 'João da Silva',
          email: 'joao@email.com',
        },
        {
          role: 'Credora',
          name: 'Banco Credor S.A.',
          email: 'banco@email.com',
        },
        {
          role: 'Interveniente Garantidor',
          name: 'Maria Oliveira',
          email: 'maria@email.com',
        },
      ]);
    });

    it('should not include the guarantor if none exists', () => {
      delete mockCpr.guarantor;

      const result = (cprDataModel as any).getSignatories(mockCpr);

      expect(result).toEqual([
        {
          role: 'Emitente',
          name: 'João da Silva',
          email: 'joao@email.com',
        },
        {
          role: 'Cônjuge do emitente',
          name: 'João da Silva',
          email: 'joao@email.com',
        },
        {
          role: 'Credora',
          name: 'Banco Credor S.A.',
          email: 'banco@email.com',
        },
      ]);
    });
  });
});

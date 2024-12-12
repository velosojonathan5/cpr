import { CprEntity } from '../../../entities/cpr/cpr.entity';
import { PMGCprDataModel } from './pmg-cpr-data-model'; // Ajuste o caminho conforme necessário

describe('PMGCprDataModel', () => {
  let cprDataModel: PMGCprDataModel;
  let mockCpr: CprEntity;

  beforeEach(() => {
    cprDataModel = new PMGCprDataModel();
    mockCpr = {
      number: 'MOD14758296',
      issueDateFormatted: '21/11/2024',
      emitter: {
        name: 'João da Silva',
        email: 'joao@email.com',
        individual: { spouse: true },
        qualification: 'Emitter qualificatior',
      },
      creditor: {
        legalName: 'Banco Credor S.A.',
        email: 'banco@email.com',
        qualification: 'Creditor qualificatior',
      },
      guarantor: {
        name: 'Maria Oliveira',
        email: 'maria@email.com',
        qualification: 'Guarantor qualificatior',
      },
      product: {
        name: 'Milho',
        characteristics:
          'TIPO EXPORTAÇÃO, padrão CONCEX, com até 13,0 % (treze por cento) de umidade, até 0,0% (zero por cento) de impurezas, até 6,0% (seis por cento) de avariados – estes últimos com até 6% (seis por cento) de grãos mofados, 30% (trinta por cento) de grãos quebrados, partidos e amassados, 6% (seis por cento) de grãos verdes, 6% (seis por cento) de ardidos e 1% (um por cento) de grãos queimados.',
        specialConditios:
          'O produto acima descrito será entregue à CREDORA ou à sua ordem, no prazo e endereço acima declinados. Cumprirá ao recebedor conferir o produto e após verificar que se encontra nas condições acima descritas, dará plena quitação, declarando o cumprimento das obrigações estipuladas nesta Cédula. Declaro ainda que o produto poderá ser recusado pela CREDORA ou de quem esta indicar, caso na data de sua entrega apresente características diferentes daquelas acima transcritas a exclusivo critério e por mera liberalidade da CREDORA ou de quem esta indicar, verificará a quantidade e a qualidade do Produto no momento de sua entrega ou retirada, mediante pesagem e classificação realizadas carga a carga no Local de Entrega/Retirada, pela própria CREDORA ou por terceiros por ela contratados, de acordo com as técnicas e procedimentos padrão da CREDORA, os quais o EMITENTE declara conhecer e concordar o produto em desacordo poderá ser recebido com os seguintes descontos: c.1. Umidade: Até 13,0% (treze por cento); c.2. Impurezas: 0% (zero por cento); c.3. Ardidos e/ou avariados: Até de 6,0% (seis por cento), respeitando o limite máximo de 6,0% (quatro por cento) para grãos ardidos; c.4. Grãos verdes: Até de 6,0% (seis por cento)',
      },
      crop: '2026/2027',
      quantityFormatted: '120000',
      sacasFormatted: '2000',
      productDevelopmentSite: {
        qualifications: [
          {
            label: 'Imóvel rural',
            content: 'Fazenda Cunha',
          },
          {
            label: 'Inscrição Estadual',
            content: '14785296315',
          },
          {
            label: 'Localização do imóvel rural',
            content:
              'Rua Novo Horizonte, Zona Rural de Albertos, Bom Sucesso-MG',
          },
          {
            label: 'Área total em hectares',
            content: '4500',
          },
          {
            label: 'Área cultivada em hectares',
            content: '2500',
          },
          {
            label: 'NIRF',
            content: 'NIRF457821',
          },
          {
            label: 'Posse',
            content: 'proprietário',
          },
        ],
      },
      deliveryPlace: {
        qualification: 'Qualificação Local de entrega',
      },
      paymentSchedule: [
        {
          valueFormatted: 'R$500000',
          dueDateFormatted: '21/03/2025',
        },
        {
          valueFormatted: 'R$180000',
          dueDateFormatted: '21/04/2025',
        },
      ],

      valueFormatted: '680000',
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
  describe('sections', () => {
    it('should return an array of sections', () => {
      const result = cprDataModel.generateData(mockCpr);

      expect(result.sections[0].title).toBe(`Nº ${mockCpr.number}`);
      expect(result.sections[0].content).toBe(
        `Emitido em ${mockCpr.issueDateFormatted}`,
      );
      expect(result.sections[1].content).toBe(
        `${mockCpr.creditor.qualification}`,
      );
      expect(result.sections[2].content).toBe(
        `${mockCpr.emitter.qualification}`,
      );
      expect(result.sections[3].content).toBe(
        `${mockCpr.guarantor.qualification}`,
      );
      expect(result.sections[5].content).toBe(
        `${mockCpr.product.name} em Grãos, safra agrícola ${mockCpr.crop}.`,
      );
      expect(result.sections[6].content).toBe(mockCpr.product.characteristics);
      expect(result.sections[7].content).toBe(
        `${mockCpr.quantityFormatted} Kg equivalentes a ${mockCpr.sacasFormatted} sacas de 60 kg cada uma.`,
      );
      expect(result.sections[9].content[0]).toBe('Imóvel rural: Fazenda Cunha');
      expect(result.sections[9].content[1]).toBe(
        'Inscrição Estadual: 14785296315',
      );
      expect(result.sections[9].content[2]).toBe(
        'Localização do imóvel rural: Rua Novo Horizonte, Zona Rural de Albertos, Bom Sucesso-MG',
      );
      expect(result.sections[9].content[3]).toBe(
        'Área total em hectares: 4500',
      );
      expect(result.sections[9].content[4]).toBe(
        'Área cultivada em hectares: 2500',
      );
      expect(result.sections[9].content[5]).toBe('NIRF: NIRF457821');
      expect(result.sections[9].content[6]).toBe('Posse: proprietário');
      expect(result.sections[10].content[0]).toBe(
        'A entrega do PRODUTO objeto desta Cédula será realizada da seguinte forma:',
      );
      expect(result.sections[10].content[1]).toBe(
        `a) Período de entrega: A primeira colheita na área mencionada na cláusula “DO LOCAL DE FORMAÇÃO DA LAVOURA” desta cédula até a data de vencimento ${mockCpr.paymentSchedule[0].dueDateFormatted}, comprometendo-me(nos) a entregar(em) o primeiro produto colhido, independentemente de estar ou não vencida esta Cédula;`,
      );
      expect(result.sections[10].content[2]).toBe(
        `b) Local de entrega: Obrigatoriamente deverá ser entregue no(a)${mockCpr.deliveryPlace.qualification}`,
      );
      expect(result.sections[10].content[3]).toBe(
        `c) Condições especiais: ${mockCpr.product.specialConditios}`,
      );
      expect(result.sections[10].content[4]).toBe(
        'd) Despesas relacionadas com o produto: Correrão por conta da EMITENTE todos os riscos, todas as despesas de manutenção, conservação, armazenagem, transporte, perdas e avarias do produto, inclusive eventos qualificados como caso fortuito ou de força maior e outras mais que se fizerem necessárias, se houverem, relativas ao produto objeto desta Cédula, até a efetiva entrega à CREDORA ou à sua ordem.',
      );
      expect(result.sections[10].content[6]).toBe(
        'e) Tradição: A titularidade do Produto será efetivamente transferida para a CREDORA, com seus respectivos riscos, no momento em que ocorrer a tradição do Produto livre e desembaraçado de quaisquer ônus ou gravames, acompanhado das respectivas demais documentos fiscais aplicáveis.',
      );
      expect(result.sections[10].content[7]).toBe(
        'f) Funrural e Senar: As retenções relativas à Funrural e Senar, incidentes sob o produto da comercialização da mercadoria, é de responsabilidade da CREDORA. O cálculo dessas retenções será incidido sobre o valor total conforme o percentual do dia (estabelecidos pelo Governo Brasileiro) do vencimento desse contrato.',
      );
      expect(result.sections[10].content[8]).toBe(
        'g) Outras obrigações: O EMITENTE se compromete a dar prioridade ao cumprimento deste Contrato em relação a eventuais outras obrigações de entrega de produtos similares ao Produto, firmadas entre o EMITENTE e terceiros.',
      );
      expect(result.sections[11].content[0]).toBe(
        `Produto em grãos, conforme quantidade e padrão das cláusulas 3 e 5, até a data do dia ${mockCpr.paymentSchedule[0].dueDateFormatted}.`,
      );
      expect(result.sections[11].content[1]).toBe(
        '8.1 A obrigação de pagamento do Preço está condicionada ao integral cumprimento, pelo EMITENTE, de todas as obrigações assumidas ao abrigo deste Contrato, notadamente a entrega da quantidade total de Produto, livre e desonerado, e desde que acompanhado das respectivas notas fiscais de venda e demais documentos fiscais aplicáveis, incluindo, se necessário e solicitado pela CREDORA, a nota fiscal de complemento de valor.',
      );
      expect(result.sections[11].content[2]).toBe(
        '8.2 As Partes declaram que (i) a ocorrência de grandes aumentos ou reduções das cotações e preços do Produto ou dos insumos para produção, no mercado interno ou externo, (ii) a variação da cotação do dólar em relação ao real e (iii) a incidência de pragas, doenças, intempéries ou variações climáticas nos locais de cultivo do Produto são fatores previsíveis, ordinários e inerentes à atividade empresarial agropecuária e ao agronegócio. Por este motivo, em nenhuma hipótese, referidos fatores constituirão justo motivo para a resolução deste Contrato ou a revisão de qualquer das obrigações assumidas pelas Partes.',
      );
      expect(result.sections[11].content[3]).toBe(
        '8.3 Todos os tributos, taxas, contribuições, custos e despesas decorrentes desta CPR objeto deste Contrato e/ou da legislação a ela aplicável serão de responsabilidade exclusiva do EMITENTE. Consequentemente, as Partes ajustam que: (i) a(s) CREDORA(S) reterá (ão) e/ou descontará (ão) do Preço a contribuição social e todos os demais tributos cuja retenção e/ou desconto seja determinado pela legislação aplicável ou dos quais a CREDORA seja considerada substituta tributária; e (ii) a CREDORA terá o direito de descontar do Preço todos os valores adicionais eventualmente despendidos a título de tributos, incluindo aqueles eventualmente criados e/ou alterados após a data de assinatura deste Contrato.',
      );
      expect(result.sections[11].content[4]).toBe(
        '8.4 O EMITENTE se compromete a dar prioridade ao cumprimento deste Contrato em relação a eventuais outras obrigações de entrega de produtos similares ao Produto, firmadas entre o EMITENTE e terceiros.',
      );
      expect(result.sections[11].content[5]).toBe(
        '8.5 Caso a CREDORA constate a qualquer momento a instituição de ônus, gravames ou constrições sobre o Produto, a obrigação de pagamento do Preço (conforme definido adiante) será automaticamente suspensa até a comprovação de que o Produto foi desonerado. Além disto, a CREDORA terá o direito de, a seu exclusivo critério:',
      );
      expect(result.sections[11].content[6]).toBe(
        '8.5.1 A obrigação do EMITENTE de entregar o Produto terá seu vencimento imediata e automaticamente antecipado, independentemente de notificação ou qualquer outra formalidade, caso a qualquer tempo a CREDORA constate: (i) falta ou mora no cumprimento de quaisquer obrigações do EMITENTE e/ou de qualquer parte a ele relacionada perante a CREDORA ou qualquer parte a ela relacionada, neste Contrato ou em qualquer outro negócio pactuado entre a CREDORA, EMITENTE e/ou quaisquer partes a eles relacionadas; (ii) que o EMITENTE, após a celebração deste Contrato, onerou ou alienou, sob qualquer forma, o Produto; (iii) que o EMITENTE não possui a intenção ou capacidade técnica, financeira e/ou operacional para cumprir suas obrigações; (iv) o desvio do Produto, assim entendido a alienação ou entrega de qualquer quantidade de Produto a terceiros e/ou em local diverso do Local de Entrega/Retirada; (v) a violação, imprecisão ou inveracidade de qualquer declaração prestada pelo EMITENTE neste Contrato; (vi) extinção, alteração ou modificação da atividade do EMITENTE que prejudique o cumprimento deste Contrato; (vii) que o EMITENTE ou qualquer parte a ele relacionada ingressou em juízo contra a CREDORA e/ou quaisquer empresas integrantes do seu grupo econômico, com quaisquer medidas judiciais; e/ou (viii) a degradação das condições financeiras do EMITENTE, incluindo (viii.1) o apontamento do nome do EMITENTE nos órgãos de restrição ao crédito e/ou impossibilidade de emissão de quaisquer certidões tributárias em nome do EMITENTE (viii.2) o protesto e/ou a adoção de quaisquer procedimentos judiciais ou extrajudiciais contra o EMITENTE que totalizem a cobrança de valor igual ou superior a cinquenta por cento do Preço da quantidade total de Produto objeto deste Contrato ou (viii.3) o requerimento ou a decretação de falência, insolvência, recuperação ou liquidação judicial ou extrajudicial do EMITENTE.',
      );
      expect(result.sections[12].content).toBe(
        `Fica ajustado o valor da CPR em ${mockCpr.valueFormatted}, referente a quantidade mencionada de ${mockCpr.product.name}, e acordo com o cronograma de vencimento: ${mockCpr.paymentScheduleText}.`,
      );
    });
    it('should return undefined in guarantor', () => {
      mockCpr.guarantor = undefined;

      const result = cprDataModel.generateData(mockCpr);

      expect(result.sections[3].content).toBe(undefined);
    });
  });
});

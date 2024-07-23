export enum ProductKeyEnum {
  SOY = 'SOY',
  CORN = 'CORN',
  ARABIC_COFFE = 'ARABIC_COFFE',
}

export class ProductEntity {
  key: ProductKeyEnum;
  name: string;
  characteristics: string;
  specialConditios: string;
  private static _data: Map<string, ProductEntity>;

  constructor() {}

  static init(): void {
    this._data = new Map<string, ProductEntity>();

    const productList = [
      {
        key: ProductKeyEnum.SOY,
        name: 'Soja',
        characteristics:
          'Até 13% de umidade, 0% de impurezas, até 6% de grãos avariados (grãos brotados, imaturos, chochos, danificados e com máximo de 6% de grãos mofados), grãos quebrados, partidos e amassados até 20%, até 6% de grãos esverdeados (grãos que apresentam coloração esverdeada na casca e na polpa), até 6% de grãos ardidos e 1% de grãos queimados. Padrão determinados conforme os conceitos definidos pelas Instruções Normativas MAPA número 11, 15/maio/2007 (D.O.U 16/05/2007) e número 37, 27/julho/2007 (D.O.U 30/07/2007).',
        specialConditios:
          'O produto acima descrito será entregue à CREDORA ou à sua ordem, no prazo e endereço acima declinados. Cumprirá ao recebedor conferir o produto e após verificar que se encontra nas condições acima descritas, dará plena quitação, declarando o cumprimento das obrigações estipuladas nesta Cédula. Declaro ainda que o produto poderá ser recusado pela CREDORA ou de quem esta indicar, caso na data de sua entrega apresente características diferentes daquelas acima transcritas a exclusivo critério e por mera liberalidade da CREDORA ou de quem esta indicar, verificará a quantidade e a qualidade do Produto no momento de sua entrega ou retirada, mediante pesagem e classificação realizadas carga a carga no Local de Entrega/Retirada, pela própria CREDORA ou por terceiros por ela contratados, de acordo com as técnicas e procedimentos padrão da CREDORA, os quais o EMITENTE declara conhecer e concordar o produto em desacordo poderá ser recebido com os seguintes descontos: c.1. Umidade: Até 13,0% (treze por cento); c.2. Impurezas: 0% (zero por cento); c.3. Ardidos e/ou avariados: Até de 6,0% (seis por cento), respeitando o limite máximo de 6,0% (quatro por cento) para grãos ardidos; c.4. Grãos verdes: Até de 6,0% (seis por cento)',
      },
      {
        key: ProductKeyEnum.CORN,
        name: 'Milho',
        characteristics:
          'TIPO EXPORTAÇÃO, padrão CONCEX, com até 13,0 % (treze por cento) de umidade, até 0,0% (zero por cento) de impurezas, até 6,0% (seis por cento) de avariados – estes últimos com até 6% (seis por cento) de grãos mofados, 30% (trinta por cento) de grãos quebrados, partidos e amassados, 6% (seis por cento) de grãos verdes, 6% (seis por cento) de ardidos e 1% (um por cento) de grãos queimados. ',
        specialConditios:
          'O produto acima descrito será entregue à CREDORA ou à sua ordem, no prazo e endereço acima declinados. Cumprirá ao recebedor conferir o produto e após verificar que se encontra nas condições acima descritas, dará plena quitação, declarando o cumprimento das obrigações estipuladas nesta Cédula. Declaro ainda que o produto poderá ser recusado pela CREDORA ou de quem esta indicar, caso na data de sua entrega apresente características diferentes daquelas acima transcritas a exclusivo critério e por mera liberalidade da CREDORA ou de quem esta indicar, verificará a quantidade e a qualidade do Produto no momento de sua entrega ou retirada, mediante pesagem e classificação realizadas carga a carga no Local de Entrega/Retirada, pela própria CREDORA ou por terceiros por ela contratados, de acordo com as técnicas e procedimentos padrão da CREDORA, os quais o EMITENTE declara conhecer e concordar o produto em desacordo poderá ser recebido com os seguintes descontos: c.1. Umidade: Até 13,0% (treze por cento); c.2. Impurezas: 0% (zero por cento); c.3. Ardidos e/ou avariados: Até de 6,0% (seis por cento), respeitando o limite máximo de 6,0% (quatro por cento) para grãos ardidos; c.4. Grãos verdes: Até de 6,0% (seis por cento)',
      },
      {
        key: ProductKeyEnum.ARABIC_COFFE,
        name: 'Café Arábica',
        characteristics:
          'Café Bica Corrida Arábica tipo 6/7, com até 123 defeitos e até 15% de catação (consumo interno), umidade 12%, bebida dura para melhor, percentual de peneira safra, isento de grãos chuvados, barrentos, varreção, mal secos, fermentados, gosto ou cheiro de secador, ou gosto estranho ao característico do café.',
        specialConditios:
          'O produto deverá ser entregue em lotes homogêneos. Por homogêneo entende-se que entre as amostras de um determinado lote não poderá haver variações de tipo maiores a 5% (cinco por cento), caso contrário esse lote será avaliado como do tipo imediatamente inferior. Condições especiais: O produto acima descrito será entregue à CREDORA ou à sua ordem, no prazo e endereço acima declinados. Cumprirá ao recebedor conferir o produto e após verificar que se encontra nas condições acima descritas, dará plena quitação, declarando o cumprimento das obrigações estipuladas nesta Cédula. Declaro ainda que o produto poderá ser recusado pela CREDORA ou de quem esta indicar, caso na data de sua entrega apresente características diferentes daquelas acima transcritas a exclusivo critério e por mera liberalidade da CREDORA ou de quem esta indicar, verificará a quantidade e a qualidade do Produto no momento de sua entrega ou retirada, mediante pesagem e classificação realizadas carga a carga no Local de Entrega/Retirada, pela própria CREDORA ou por terceiros por ela contratados, de acordo com as técnicas e procedimentos padrão da CREDORA, os quais o EMITENTE declara conhecer e concordar o produto em desacordo poderá ser recebido com os informado na cláusula “DAS CARACTERISTICAS DO PRODUTO”.',
      },
    ];

    productList.map((p) => this._data.set(p.key, p));
  }

  static findByKey(key: ProductKeyEnum): ProductEntity {
    return this._data.get(key);
  }

  static create(obj: {
    key: ProductKeyEnum;
    name: string;
    characteristics;
  }): ProductEntity {
    const product = new ProductEntity();

    product.key = obj.key;
    product.name = obj.name;
    product.characteristics = obj.characteristics;

    return product;
  }
}

ProductEntity.init();

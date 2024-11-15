import { Injectable } from '@nestjs/common';
import {
  CreateCprPhysicDto,
  CreateGuarantorDto,
} from './dto/create-cpr-physic.dto';
import { CprPhysicEntity } from '../../entities/cpr/cpr-physic.entity';
import { CprService } from '../cpr.service';
import { GuarantorEntity } from '../../entities/person/guarantor.entity';
import { IndividualEntity } from '../../entities/person/individual.entity';
import { CompanyEntity } from '../../entities/person/company.entity';
import { AddressEntity } from '../../entities/person/address.entity';
import { ProductEntity } from '../../entities/product.entity';
import * as PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { PaymentEntity } from '../../entities/cpr/cpr.entity';

@Injectable()
export class CprPhysicService extends CprService<CprPhysicEntity> {
  async create(
    createCprPhysicDto: CreateCprPhysicDto,
  ): Promise<{ id: string }> {
    const creditor = await this.creditorService.getById(
      createCprPhysicDto.creditor.id,
    );

    const emitter = await this.emitterService.getById(
      createCprPhysicDto.emitter.id,
    );

    const deliveryPlace = await this.deliveryPlaceService.getById(
      createCprPhysicDto.deliveryPlace.id,
    );

    let guarantor: GuarantorEntity;

    if (createCprPhysicDto.guarantor) {
      guarantor = this.buildGuarantor(createCprPhysicDto.guarantor);
    }

    const productDevelopmentSite = emitter.getDevelopmentSite(
      createCprPhysicDto.productDevelopmentSite.id,
    );

    if (createCprPhysicDto.productDevelopmentSite.cultivatedArea) {
      productDevelopmentSite.cultivatedArea =
        createCprPhysicDto.productDevelopmentSite.cultivatedArea;
    }

    const {
      product,
      crop,
      quantity,
      paymentSchedule,
      value,
      responsibleForExpenses,
    } = createCprPhysicDto;
    const cpr = CprPhysicEntity.create({
      creditor,
      emitter,
      guarantor,
      product: ProductEntity.findByKey(product),
      crop,
      quantity,
      productDevelopmentSite,
      paymentSchedule: paymentSchedule.map((p) =>
        PaymentEntity.create(p.dueDate, p.value),
      ),
      deliveryPlace,
      value,
      responsibleForExpenses,
    });

    // arquitetura orientada a eventos?
    this.generateDocument(cpr);

    super.save(cpr);

    return { id: cpr.id };
  }

  private generateDocument(cpr: CprPhysicEntity) {
    const sanitize = (text: string) => {
      return text.replace(/(\r\n|\n|\r)/gm, '');
    };

    const sections = [
      {
        title: 'Nº ' + cpr.number,
        content: 'Emitido em ' + cpr.issueDateFormatted,
      },
      {
        title: 'CREDORA',
        content: sanitize(cpr.creditor.qualification),
      },
      {
        title: 'EMITENTE',
        content: sanitize(cpr.emitter.qualification),
      },
      {
        title: 'INTERVENIENTE GARANTIDOR',
        content: cpr.guarantor
          ? sanitize(cpr.guarantor.qualification)
          : undefined,
      },
      {
        title: '1) DO OBJETO',
        content:
          'Fornecimento de produtos e insumos agrícolas pela CREDORA para o EMITENTE, em troca/BARTER de parte ou totalidade de sua safra para saldar o débito existente com a CREDORA.',
      },
      {
        title: '2) DO PRODUTO',
        content: `${cpr.product.name} em Grãos, safra agrícola ${cpr.crop}.`,
      },
      {
        title: '3) DAS CARACTERÍSTICAS DO PRODUTO:',
        content: sanitize(cpr.product.characteristics),
      },
      {
        title: '4) DA QUANTIDADE',
        content: `${cpr.quantityFormatted} Kg equivalentes a ${cpr.sacasFormatted} sacas de 60 kg cada uma.`,
      },
      {
        title: '5) DO ACONDICIONAMENTO',
        content: `A granel`,
      },
      {
        title: '6) DO LOCAL DE FORMAÇÃO DA LAVOURA',
        content: cpr.productDevelopmentSite.qualifications.map(
          (q) => q.label + ': ' + sanitize(q.content),
        ),
      },
      {
        title: '7) DAS CONDIÇÕES DE ENTREGA',
        content: [
          'A entrega do PRODUTO objeto desta Cédula será realizada da seguinte forma:',
          `a) Período de entrega: A primeira colheita na área mencionada na cláusula “DO LOCAL DE FORMAÇÃO DA LAVOURA” desta cédula até a data de vencimento ${cpr.paymentSchedule[0].dueDateFormatted}, comprometendo-me(nos) a entregar(em) o primeiro produto colhido, independentemente de estar ou não vencida esta Cédula;`,
          'b) Local de entrega: Obrigatoriamente deverá ser entregue no(a)' +
            sanitize(cpr.deliveryPlace.qualification),
          'c) Condições especiais: ' + sanitize(cpr.product.specialConditios),
          'd) Despesas relacionadas com o produto: Correrão por conta da EMITENTE todos os riscos, todas as despesas de manutenção, conservação, armazenagem, transporte, perdas e avarias do produto, inclusive eventos qualificados como caso fortuito ou de força maior e outras mais que se fizerem necessárias, se houverem, relativas ao produto objeto desta Cédula, até a efetiva entrega à CREDORA ou à sua ordem.',
          cpr.responsibleForExpensesText,
          'e) Tradição: A titularidade do Produto será efetivamente transferida para a CREDORA, com seus respectivos riscos, no momento em que ocorrer a tradição do Produto livre e desembaraçado de quaisquer ônus ou gravames, acompanhado das respectivas demais documentos fiscais aplicáveis.',
          'f) Funrural e Senar: As retenções relativas à Funrural e Senar, incidentes sob o produto da comercialização da mercadoria, é de responsabilidade da CREDORA. O cálculo dessas retenções será incidido sobre o valor total conforme o percentual do dia (estabelecidos pelo Governo Brasileiro) do vencimento desse contrato.',
          'g) Outras obrigações: O EMITENTE se compromete a dar prioridade ao cumprimento deste Contrato em relação a eventuais outras obrigações de entrega de produtos similares ao Produto, firmadas entre o EMITENTE e terceiros.',
        ],
      },
      {
        title: '8) DO PREÇO E FORMA DE LIQUIDAÇÃO',
        content: [
          `Produto em grãos, conforme quantidade e padrão das cláusulas 3 e 5, até a data do dia ${cpr.paymentSchedule[0].dueDateFormatted}.`,
          '8.1 A obrigação de pagamento do Preço está condicionada ao integral cumprimento, pelo EMITENTE, de todas as obrigações assumidas ao abrigo deste Contrato, notadamente a entrega da quantidade total de Produto, livre e desonerado, e desde que acompanhado das respectivas notas fiscais de venda e demais documentos fiscais aplicáveis, incluindo, se necessário e solicitado pela CREDORA, a nota fiscal de complemento de valor.',
          '8.2 As Partes declaram que (i) a ocorrência de grandes aumentos ou reduções das cotações e preços do Produto ou dos insumos para produção, no mercado interno ou externo, (ii) a variação da cotação do dólar em relação ao real e (iii) a incidência de pragas, doenças, intempéries ou variações climáticas nos locais de cultivo do Produto são fatores previsíveis, ordinários e inerentes à atividade empresarial agropecuária e ao agronegócio. Por este motivo, em nenhuma hipótese, referidos fatores constituirão justo motivo para a resolução deste Contrato ou a revisão de qualquer das obrigações assumidas pelas Partes.',
          '8.3 Todos os tributos, taxas, contribuições, custos e despesas decorrentes desta CPR objeto deste Contrato e/ou da legislação a ela aplicável serão de responsabilidade exclusiva do EMITENTE. Consequentemente, as Partes ajustam que: (i) a(s) CREDORA(S) reterá (ão) e/ou descontará (ão) do Preço a contribuição social e todos os demais tributos cuja retenção e/ou desconto seja determinado pela legislação aplicável ou dos quais a CREDORA seja considerada substituta tributária; e (ii) a CREDORA terá o direito de descontar do Preço todos os valores adicionais eventualmente despendidos a título de tributos, incluindo aqueles eventualmente criados e/ou alterados após a data de assinatura deste Contrato.',
          '8.4 O EMITENTE se compromete a dar prioridade ao cumprimento deste Contrato em relação a eventuais outras obrigações de entrega de produtos similares ao Produto, firmadas entre o EMITENTE e terceiros.',
          '8.5 Caso a CREDORA constate a qualquer momento a instituição de ônus, gravames ou constrições sobre o Produto, a obrigação de pagamento do Preço (conforme definido adiante) será automaticamente suspensa até a comprovação de que o Produto foi desonerado. Além disto, a CREDORA terá o direito de, a seu exclusivo critério:',
          '8.5.1 A obrigação do EMITENTE de entregar o Produto terá seu vencimento imediata e automaticamente antecipado, independentemente de notificação ou qualquer outra formalidade, caso a qualquer tempo a CREDORA constate: (i) falta ou mora no cumprimento de quaisquer obrigações do EMITENTE e/ou de qualquer parte a ele relacionada perante a CREDORA ou qualquer parte a ela relacionada, neste Contrato ou em qualquer outro negócio pactuado entre a CREDORA, EMITENTE e/ou quaisquer partes a eles relacionadas; (ii) que o EMITENTE, após a celebração deste Contrato, onerou ou alienou, sob qualquer forma, o Produto; (iii) que o EMITENTE não possui a intenção ou capacidade técnica, financeira e/ou operacional para cumprir suas obrigações; (iv) o desvio do Produto, assim entendido a alienação ou entrega de qualquer quantidade de Produto a terceiros e/ou em local diverso do Local de Entrega/Retirada; (v) a violação, imprecisão ou inveracidade de qualquer declaração prestada pelo EMITENTE neste Contrato; (vi) extinção, alteração ou modificação da atividade do EMITENTE que prejudique o cumprimento deste Contrato; (vii) que o EMITENTE ou qualquer parte a ele relacionada ingressou em juízo contra a CREDORA e/ou quaisquer empresas integrantes do seu grupo econômico, com quaisquer medidas judiciais; e/ou (viii) a degradação das condições financeiras do EMITENTE, incluindo (viii.1) o apontamento do nome do EMITENTE nos órgãos de restrição ao crédito e/ou impossibilidade de emissão de quaisquer certidões tributárias em nome do EMITENTE (viii.2) o protesto e/ou a adoção de quaisquer procedimentos judiciais ou extrajudiciais contra o EMITENTE que totalizem a cobrança de valor igual ou superior a cinquenta por cento do Preço da quantidade total de Produto objeto deste Contrato ou (viii.3) o requerimento ou a decretação de falência, insolvência, recuperação ou liquidação judicial ou extrajudicial do EMITENTE.',
        ],
      },
      {
        title: '9) PARA FINS DE EMOLUMENTOS',
        content: `Fica ajustado o valor da CPR em ${cpr.valueFormatted}, referente a quantidade mencionada de ${cpr.product.name}, e acordo com o cronograma de vencimento: ${cpr.paymentScheduleText}.`,
      },
      {
        title: '10) DAS OBRIGAÇÕES ESPECIAIS E ACESSÓRIAS',
        content: [
          'Por força desta Cédula de Produto Rural, obrigo-me (amo-nos) ainda:',
          '10.1 A formar a lavoura para obtenção do produto ora negociado, na área e local determinados desta Cédula;',
          '10.2 A não gravar ou alienar em favor de terceiros, durante a vigência deste título, os bens vinculados em garantia e o produto objeto desta Cédula. Eventual alienação será considerada fraudulenta, razão pela qual autorizo (amos) a CREDORA a retirar o produto na quantidade e qualidade aqui avençada até atingir a quantidade devida, se assim desejar, diretamente da minha (nossa) lavoura, ou ainda buscar o produto onde este se encontrar, mesmo que em nome de terceiros, e, nestes casos arcarei com todas as despesas decorrentes da colheita e a retirada do produto.',
        ],
      },
      {
        title: '11) DO DEPÓSITO',
        content: [
          `Nos termos do art. 7º, parágrafo primeiro, da Lei 8.929/94 e demais dispositivos legais aplicáveis à espécie, especialmente o art. 627 do Código Civil Brasileiro, permanecerei na posse imediata do(s) bem(ns) ora dado(s) em penhor, assumindo o compromisso de guardá-lo(s) e conservá-lo(s) na condição FIEL DEPOSITÁRIO no máximo até o vencimento final do presente contrato, ${cpr.paymentSchedule[cpr.paymentSchedule.length - 1].dueDateFormatted} correndo por minha exclusiva conta a risco todas as despesas de manutenção, conservação, armazenagem e outras mais que se fizerem necessárias ao bom e fiel desempenho do encargo.`,
        ],
      },
      {
        title: '12) DEMAIS OBRIGAÇÕES E DECLARAÇÕES DAS PARTES',
        content: [
          '12.1 Caso o EMITENTE, por qualquer motivo, deixe de carregar ou transportar o Produto no tempo e condições previstas neste Contrato, a CREDORA terá o direito de realizar estes serviços por conta própria ou por terceiros contratados para este fim, suprindo o inadimplemento do EMITENTE. Nesta hipótese, o EMITENTE, deverá reembolsar à CREDORA todas as despesas incorridas por ela a este título, acrescidos de taxa de administração de 10% (dez por cento), correção monetária pelo IGP-M/FGV e juros moratórios de 1% (um por cento) ao mês, calculados desde a data do desembolso pela CREDORA até o efetivo reembolso pelo EMITENTE.',
          '12.2 Sem prejuízo das demais obrigações assumidas ao abrigo deste Contrato, o EMITENTE obriga-se a: (i) informar imediatamente à CREDORA qualquer evento que possa ameaçar o cumprimento integral das obrigações assumidas pelo EMITENTE ao abrigo deste Contrato; (ii) informar imediatamente à CREDORA eventual intenção de armazenar o Produto em local diverso do Local de Armazenagem, ocasião em que deverá obter autorização por escrito da CREDORA para efetuar a modificação; e (iii) manter válidas e em vigor, durante toda a vigência deste Contrato, todas as autorizações legais, governamentais e regulatórias necessárias para o exercício de suas atividades e cumprimento de suas obrigações.',
          '12.3 Durante toda vigência deste Contrato, o EMITENTE se obriga a dar acesso à CREDORA (ou a terceiros por ela indicados) ao Local de Entrega e/ou às lavouras onde o Produto estiver sendo cultivado, assim como aos armazéns aonde o Produto for/estiver estocado ou todas as instalações existentes em tais locais, para, em especial, realização de vistoria do plantio, de seus estoques de Produto, mediante contagem física ou verificação contábil. A CREDORA assegura-se o direito de recusar o recebimento do Produto, bem como a retenção de pagamentos caso o EMITENTE se recuse a dar acesso à CREDORA os locais indicados nesta cláusula.',
          '12.4 O EMITENTE autoriza a CREDORA a questionar e buscar informações perante terceiros, instituições financeiras, armazéns, tradings ou revendas, acerca das vendas, financiamentos, depósitos ou entregas de sua produção agrícola do Produto em qualquer safra posterior ao objeto deste Contrato. A autorização aqui outorgada possui validade por todo período de vigor deste Contrato e, em especial, em caso de inadimplemento à obrigação de entrega.',
          '12.5 O EMITENTE declara ainda que:',
          'a) O Produto está de acordo com toda a legislação e normas brasileiras aplicáveis, incluindo todas as normas ambientais e trabalhistas e o EMITENTE exige e continuará exigindo que todos seus fornecedores de matéria-prima cumpram integralmente a legislação e normas brasileiras aplicáveis, incluindo todas as normas ambientais e trabalhistas;',
          'b) Se compromete a combater práticas de discriminação negativa e/ou restritivas ao acesso na relação de emprego ou a sua manutenção, tais como, mas não se limitando, motivos de: sexo, origem, raça, cor, condição física, religião, estado civil, idade ou situação familiar, bem como a praticar esforços nesse sentido junto aos seus respectivos fornecedores;',
          'c) Nunca empregou e nunca contratou fornecedores ou prestadores de serviço que empreguem mão-de-obra infantil, escrava ou análoga a qualquer condição escrava, inclusive durante o cultivo, a colheita e todos os demais procedimentos relacionados ao Produto;',
          'd) Todas as suas atividades são conduzidas de acordo com a legislação ambiental vigente, assim entendida toda a legislação federal, estadual e municipal, bem como, qualquer ato da Administração Pública direta ou indireta;',
          'e) Exige e continuará exigindo de todos os seus fornecedores de matéria-prima que o cultivo do Produto objeto deste Contrato ocorra de acordo com as melhores práticas agrícolas e com uso racional de defensivos agrícolas durante todas as etapas de seu cultivo, respeitando os períodos de carência e demais normas do Contrato nº. 41, da Associação Nacional dos Exportadores de Cereais (“ANEC 41”);',
          'f) É o único e exclusivo proprietário da totalidade do Produto, que não é objeto de nenhuma disputa ou conflito judicial, incluindo processo de inventário, registro ou arrolamento, de modo que não depende de nenhuma anuência ou autorização para a venda do Produto ao abrigo deste Contrato;',
          'g) O Produto está e manter-se-á durante toda a vigência deste Contrato totalmente livre e desembaraçado de quaisquer ônus, gravames e/ou encargos de qualquer natureza, incluindo, mas não se limitando, a penhor agrícola, mercantil ou alienação fiduciária em favor de terceiros;',
          'h) Zelará pelo bom nome comercial da CREDORA e a abster-se-á da prática de atos que possam prejudicar a reputação da CREDORA, sob pena de responder pelas perdas e danos decorrentes da difamação e injúria decorrente;',
          '12.6 Sem prejuízo das penalidades aplicáveis, na hipótese de o EMITENTE entregar à CREDORA qualquer quantidade de Produto objeto deste Contrato que, por qualquer motivo, precise ser devolvido pela CREDORA ao EMITENTE ou para terceiros, o EMITENTE será o único responsável por todas as despesas relacionadas ao frete, padronização, classificação e armazenagem da quantidade de Produto devolvida. A obrigação ora pactuada será aplicável a toda e qualquer hipótese em que a CREDORA seja obrigada a devolver Produto que lhe fora entregue pelo EMITENTE, seja para o EMITENTE ou para terceiros, incluindo, mas não se limitando, a decisões judiciais ou administrativas nesse sentido.',
        ],
      },
      {
        title: '13) PROTEÇÃO DE DADOS',
        content: [
          '13.1 As Partes acordam que qualquer Dado Pessoal que as Partes tenham acesso no contexto de execução deste Contrato será Tratado de acordo com as leis aplicáveis, incluindo, sem limitação, a Lei nº 13.709, de 14 de agosto de 2018 (“LGPD”) e que nenhum Tratamento de Dados Pessoais ocorrerá de modo excessivo ou para finalidades estranhas ao objeto do Contrato, que rege o relacionamento entre as Partes. As Partes reconhecem que os Dados Pessoais também poderão ser tratados caso necessários para cumprimento de obrigação legal ou regulatória a qual a Parte esteja sujeita no Brasil ou para o exercício de direitos em processos judiciais, administrativos e arbitrais.',
          '13.2 Para os fins destas cláusulas os termos grafados com as iniciais em letra maiúscula que não estejam definidos nesta cláusula terão os significados que lhes são atribuídos na LGPD.',
          '13.3 A Parte que compartilhar Dados Pessoais no contexto do Contrato firmado se responsabiliza e garante a idoneidade das informações que compartilhar diretamente com a outra. Ou seja, os Dados foram coletados e podem licitamente ser compartilhadas, em conformidade com todas as leis e regulamentos aplicáveis de Privacidade e Proteção de Dados.',
        ],
      },
      {
        title: '14) DO INADIMPLEMENTO E RESCISÃO DESTE CONTRATO',
        content: [
          'As obrigações assumidas pelo EMITENTE ao abrigo deste Contrato serão consideradas inadimplidas automaticamente, independentemente de qualquer aviso, notificação ou interpelação, nas seguintes hipóteses:',
          'a) Em caso de inveracidade de qualquer declaração ou inadimplemento de qualquer obrigação assumida pelo EMITENTE ao abrigo deste Contrato;',
          'b) Em caso de degradação das condições financeiras do EMITENTE, incluindo as hipóteses de requerimento ou decretação de insolvência, falência, recuperação ou liquidação judicial ou extrajudicial;',
          'c) Ocorrência de quaisquer das hipóteses de vencimento antecipado da obrigação de entrega do Produto, conforme previsto na cláusula 8.5.1 acima;',
          'd) Em caso de descumprimento pelo EMITENTE das obrigações assumidas ao abrigo da cláusula 8.5 acima.',
          '14.1 Em qualquer hipótese de inadimplemento do EMITENTE, a CREDORA terá o direito de rescindir este Contrato e exigir do EMITENTE:',
          'a) O pagamento de multa penal não compensatória, no valor correspondente a 20% (vinte por cento) do Preço da quantidade total de Produto negociado ao abrigo deste Contrato, acrescida de correção monetária pelo IGP-M/FGV e juros moratórios de 1% (um por cento) ao mês, contados desde a data do inadimplemento/vencimento antecipado até a data do efetivo pagamento;',
          'b) A devolução de eventuais valores em aberto que tenham sido pagos antecipadamente pela CREDORA, acrescidos dos juros remuneratórios e correção monetária pactuados entre as Partes, desde o desembolso até a data do efetivo pagamento; e juros moratórios de 1% (um por cento) ao mês, contados desde a data do inadimplemento/vencimento antecipado até a data do efetivo pagamento; e',
          'c) Caso o EMITENTE tenha deixado de entregar qualquer quantidade de Produto objeto deste Contrato, o pagamento de todas as perdas e danos incorridos pela CREDORA, cujo valor não poderá ser inferior ao maior valor entre os seguintes, sem prejuízo de indenização suplementar: (i) 20% (vinte por cento) do Preço da quantidade de Produto que deixou de ser entregue (“Saldo”); ou (ii) a diferença entre o preço do Saldo estabelecido neste Contrato e o preço do Saldo para a praça mais próxima ao Local de Entrega/Retirada, no primeiro dia útil posterior ao término do Período de Entrega/Retirada ou à data do inadimplemento/vencimento antecipado, o que ocorrer primeiro. A multa compensatória aqui estabelecida será acrescida de correção monetária pelo IGP-M/FGV e juros moratórios de 1% (um por cento) ao mês, contados desde a data do inadimplemento/vencimento antecipado até a data do efetivo pagamento.',
          '14.2 Em caso de inadimplemento das obrigações assumidas pelo EMITENTE ao abrigo deste Contrato, alternativamente ao direito de rescisão deste Contrato, a CREDORA terá o direito de, a seu exclusivo critério, adotar todas as medidas judiciais e/ou extrajudiciais cabíveis para exigir do EMITENTE o cumprimento da obrigação de entrega do Produto, acrescido da penalidade estabelecida no item (a) cláusula 14.1. acima.',
          '14.3 Na hipótese da cláusula 14.2. acima, caso a pretensão da CREDORA de obter a entrega forçada da integralidade do Produto seja frustrada, por qualquer motivo, o EMITENTE estará sujeito ao pagamento de todas as penalidades estabelecidas na cláusula 14.1. acima.',
          '14.4 Todas as penalidades, multas e indenizações previstas neste Contrato são cumulativas e complementares com relação a eventuais penalidades legais e ou demais danos efetivamente comprovados.',
        ],
      },
      {
        title: '15) DA GARANTIA.',
        content: [
          'O Interveniente Garantidor, qualificado acima, comparece no presente Contrato, na qualidade de fiador, coobrigado e solidariamente responsável com o EMITENTE no cumprimento de todas as obrigações decorrentes do Contrato, incluindo, mas não se limitando à entrega do Produto, expressamente renunciando aos benefícios dos artigos 827, 834, 835, 837, 838 e 839 do Código Civil brasileiro, e artigo 794 do Código de Processo Civil brasileiro.',
        ],
      },
      {
        title: '16) DAS DISPOSIÇÕES GERAIS.',
        content: [
          'Cada Parte neste ato declara e garante à outra que as afirmações a seguir são verdadeiras em relação à própria Parte e, também, em relação às suas intenções com este Contrato: (i) cada Parte está apta a cumprir as obrigações previstas neste Contrato e agirá de boa-fé e com lealdade; (ii) nenhuma Parte depende economicamente da outra; (iii) nenhuma das Partes se encontra em estado de necessidade ou sob coação para celebrar este Contrato e/ou tem urgência de contratar; (iv) as discussões sobre o objeto deste Contrato decorrem de sua livre iniciativa; (v) cada Parte tem experiência em negócios semelhantes ao instrumentalizado neste Contrato; (vi) as Partes foram informadas de todas as condições e circunstâncias envolvidas neste Contrato e que poderiam influenciar sua manifestação de vontade; e (vii) as Partes conhecem e anuem ao Padrão de Qualidade do Produto.',
          '16.1. Caso as Partes tenham firmado outros contratos de compra e venda de Produto, a CREDORA terá o direito de imputar, a seu exclusivo critério, as cargas de Produto entregues pelo EMITENTE ao cumprimento, total ou parcial, de qualquer um dos referidos contratos. Consequentemente, o EMITENTE renuncia expressamente, em favor da CREDORA, o direito previsto no artigo 352 do Código Civil.',
          '16.1.1. Para fins do livre exercício do direito de imputação pela CREDORA ao pagamento ora pactuado, as Partes ajustam que o seguinte procedimento será observado: (i) eventual apontamento realizado pelo EMITENTE em qualquer documento ou nota fiscal será ineficaz para todos efeitos de direito, inclusive perante terceiros; (ii) a CREDORA realizará a imputação que lhe compete, informando por escrito, inclusive por mensagens eletrônicas, ao EMITENTE a imputação realizada; e (iii) competirá ao EMITENTE dar ciência da imputação a terceiros direta e indiretamente afetados, assumindo ainda o EMITENTE os ônus de eventual informação incorreta e a obrigação de retificação.',
          '16.1.2. A comunicação da imputação ao pagamento realizada pela CREDORA será vinculante na relação entre as Partes, configurando prova inequívoca de sua realização e da concordância da CREDORA nos termos deste Contrato, para todos os fins, inclusive processuais.',
          '16.2. As Partes declaram que conhecem, entendem e cumprem os termos das leis anticorrupção e de combate à lavagem de dinheiro, nacionais ou estrangeiras, e quaisquer outras normas relacionadas, nacionais ou estrangeiras (“Leis de Integridade”) e que executará todas suas operações, atividades e serviços, incluindo o objeto deste Contrato, de forma ética e de acordo com as Leis de Integridade.',
          '16.2.1. As Partes declaram que suas controladas, controladoras, sociedades sob controle comum, administradores, empregados, subcontratados, terceiros, representantes, fornecedores e consultores: (i) estão familiarizados e agem de acordo com as Leis de Integridade; e (ii) não autorizarão ou farão qualquer pagamento ou entrega de presentes ou qualquer coisa de valor, pecuniário ou moral, oferta ou promessa de pagamentos ou entretenimento, viagem ou outra vantagem para o uso ou benefício, direta ou indiretamente, relacionado, ou não, a este Contrato, para (1) qualquer funcionário de qualquer governo ou repartição pública, inclusive partido político, membro de partido político, candidato a cargo eletivo, para que ele seja influenciado a obter ou reter qualquer negócio ou garantir qualquer vantagem indevida à CREDORA e/ou ao EMITENTE; e/ou (2) qualquer pessoa física, para que este seja indevidamente influenciado a proporcionar qualquer vantagem indevida à CREDORA e/ou ao EMITENTE.',
          '16.2.2. O EMITENTE informará imediatamente à CREDORA sobre a instauração e andamento de qualquer investigação, processo administrativo ou judicial para apuração de prática de irregularidades descritas em qualquer das Leis de Integridade, imputados ao EMITENTE e/ou a qualquer das pessoas descritas na cláusula 9.2.1. acima.',
          '16.2.3. O EMITENTE providenciará treinamentos a todas as pessoas descritas na cláusula 16.2.1. acima sobre as Leis de Integridade, ressaltando o compromisso ora assumido, bem como tomará medidas para que tais pessoas se comprometam a não praticar condutas ou omissões que possam resultar em responsabilidade no âmbito das Leis de Integridade.',
          '16.2.4. O EMITENTE se responsabilizará pelos atos praticados em descumprimento ao disposto nas Leis de Integridade e nesta cláusula, por si e por todas as pessoas descritas na cláusula 16.2.1, acima.',
          '16.3. As Partes declaram que eventuais aumentos ou reduções bruscas e significantes das cotações do Produto ou dos insumos para a sua produção, no mercado interno ou externo, a variação da cotação do dólar em relação ao real e a incidência de pragas, doenças, intempéries ou variações climáticas nos locais de cultivo do Produto são fatores previsíveis, ordinários e inerentes à atividade agropecuária e ao agronegócio, de modo que o risco decorrente de tais fatores é assumido integralmente pelo EMITENTE e não poderá ensejar a resolução deste Contrato ou a revisão de quaisquer obrigações contratuais, em nenhuma hipótese.',
          '16.4. O EMITENTE não poderá ceder, dar em garantia, securitizar, transferir a terceiros, emitir ou sacar títulos representativos de quaisquer créditos que detenha contra a CREDORA e que sejam relacionados a este Contrato sem a prévia e expressa autorização, por escrito, da CREDORA. Qualquer cessão realizada em descumprimento desta obrigação será considerada nula de pleno direito. Não obstante, a CREDORA poderá livremente ceder e transferir seus direitos decorrentes do presente Contrato a terceiros, mediante simples comunicação ao EMITENTE.',
          '16.5.1. Em qualquer hipótese de cessão ou qualquer outra forma de transmissão dos créditos e direitos que o EMITENTE detenha contra a CREDORA e que estejam relacionados a este Contrato, ainda que expressamente anuído pela CREDORA, sempre estará integralmente assegurado o direito da CREDORA de opor ao cessionário do crédito e/ou direito todas as exceções que possua contra a CREDORA, nos termos do artigo 294 do Código Civil, sejam exceções de caráter pessoal ou material, exceto quando a CREDORA expressamente renunciar a tal direito, por escrito.',
          '16.6. A CREDORA poderá suspender, a seu exclusivo critério, total ou parcialmente o pagamento do Preço devido neste Contrato caso o EMITENTE venha a descumprir ou desatender qualquer obrigação assumidas perante a CREDORA, ao abrigo deste Contrato ou de qualquer outro negócio jurídico entre as Partes, suspensão esta que perdurará até o respectivo cumprimento e regularização.',
          '16.7. Nos termos dos artigos 368 e seguintes do Código Civil, todas as obrigações de pagamento assumidas pela CREDORA neste Contrato poderão ser adimplidas por compensação com quaisquer créditos que a CREDORA possua contra o EMITENTE e/ou qualquer parte a ele relacionada, o que inclui cônjuge, familiares em qualquer grau de parentesco e pessoas jurídicas das quais o EMITENTE seja sócio ou controlador, seja neste Contrato seja em qualquer outro negócio jurídico celebrado entre as Partes e/ou qualquer parte a elas relacionada.',
          '16.7.1. As Partes ajustam que, para fins do pagamento por compensação autorizado na cláusula retro, a CREDORA poderá se valer de todo e qualquer crédito certo, líquido e exigível que a CREDORA detenha contra o EMITENTE no momento de pagamento do Preço, incluindo-se encargos, multas e descontos previstos neste Contrato. Para tanto, o EMITENTE concorda, para todos os fins de direito, que a Multa Não Compensatória, a Multa Compensatória, Devolução Adiantamentos e outros encargos previstos neste Contrato, quando inadimplido, constitui crédito certo, líquido e exigível da CREDORA, de pleno direito, no momento de eventual inadimplemento ou vencimento antecipado da obrigação de entrega do EMITENTE, nos termos do artigo 408 do Código Civil.',
          '16.7.2. Na hipótese de realização da compensação, o único dever da CREDORA é informar ao EMITENTE, por qualquer meio possível: (i) o valor do crédito do EMITENTE, na data da compensação ocorrida, demonstrado por memória de cálculo; (ii) o valor do crédito da CREDORA, na data da compensação ocorrida, demonstrado por memória de cálculo e amparado em eventuais documentos que embasam referido cálculo; e (iii) eventual saldo remanescente em favor de alguma das Partes.',
          '16.7.3. A informação enviada pela CREDORA, de forma simples e/ou eletrônica (aos endereços físicos e/ou eletrônicos indicados no preâmbulo) será considerada, para todo e qualquer fim, inclusive processual, como prova inequívoca da ocorrência da compensação no momento juridicamente adequado.',
          '16.7.4. As Partes ajustam que a compensação realizada nos termos desta cláusula constituirá pagamento para fins de adimplemento e extinção da obrigação da CREDORA perante o EMITENTE, servindo inclusive como fundamento de defesa da CREDORA em eventual cobrança judicial do EMITENTE que, uma vez garantido o juízo, deverá ser suspenso até reconhecimento judicial da compensação.',
          '16.8. As Partes autorizam-se mutuamente a gravar/arquivar todas as comunicações trocadas entre elas (inclusive ligações e chamadas telefônicas ou áudios) referentes a fatos relacionados a este Contrato, que servirão como meio de prova em juízo, se necessário.',
          '16.9. Todas as comunicações e notificações entre as Partes poderão ser feitas por escrito por meio de carta entregue mediante recibo ou com Aviso de Recebimento destinadas aos endereços constantes do preâmbulo deste instrumento ou por meios eletrônicos/digitais, inclusive via telefone, aplicativos de mensagens instantâneas, endereço de e-mail mencionado no preâmbulo deste Contrato ou qualquer outro usualmente utilizado pelas Partes.',
          '16.10. O EMITENTE autoriza que a CREDORA entre em contato via e-mail ou por telefone indicados no preâmbulo deste Contrato, a qualquer momento e a partir de qualquer localidade nacional ou internacional, para confirmação de quaisquer informações e condições deste Contrato.',
          '16.11. Nos termos do artigo 190 do Código de Processo Civil, as Partes esclarecem que, em caso de qualquer litígio envolvendo este Contrato: (i) admitem como válida e regular a sua citação por todos os meios legais indicados no artigo 246 do CPC, inclusive mediante (a) o envio de carta por correio para o endereço mencionado no preâmbulo deste Contrato ou qualquer outro constante de qualquer contrato celebrado entre as partes, que deve ser mantido atualizado pelo EMITENTE, sob pena de citação ser considerada válida mesmo se o EMITENTE tiver alterado o seu endereço; e (b) por meios eletrônicos/digitais, inclusive via telefone, aplicativos de mensagens instantâneas, endereço de e-mail mencionado no preâmbulo deste Contrato ou qualquer outro usualmente utilizado pelas Partes; (ii) não possuem interesse na realização da audiência inicial de conciliação ou de mediação prevista no artigo 334 do Código de Processo Civil, conforme artigo 334, §4º, I, do Código de Processo Civil. Consequentemente, as Partes ajustam e reconhecem que, naquela hipótese, o prazo para defesa terá início com a citação, nos termos dos artigos 231, 806 e seguintes do Código de Processo Civil.',
          '16.12. A tolerância, por qualquer das Partes, em relação ao descumprimento de qualquer obrigação assumida ao abrigo deste Contrato constituirá mera liberalidade e não poderá ser interpretada como novação ou precedente invocável pela outra Parte.',
          '16.13. Este Contrato é firmado em caráter irrevogável e irretratável, não comportando arrependimento, de modo que obriga e vincula as Partes e seus respectivos herdeiros, sucessores e cessionários, a qualquer título, e constitui título executivo extrajudicial para todos os fins de direito.',
          '16.14. As Partes declaram e reconhecem, de forma irrevogável e irretratável, que caso o presente Contrato, bem como todos os demais documentos a ele relacionados, sejam assinados(a) de forma digital, com utilização de certificados emitidos conforme parâmetros da Infraestrutura de Chaves Públicas Brasileira (“ICP-Brasil”), ou (b) de forma eletrônica, por meio da plataforma de assinatura digital ou de qualquer outra que cumpra os respectivos requisitos legais, (a)são plenamente válidos e vinculantes entre as Partes, como se vias físicas assinadas manualmente fossem, para todos os fins e efeitos de direito; e (b)tem valor probante, estando aptos a conservar a integridade de seu conteúdo e comprovar a autoria dos respectivos assinantes.',
        ],
      },
      {
        title: '17) DO FORO.',
        content: [
          'As Partes elegem o Foro da Comarca de Formiga/MG, como competente para dirimir quaisquer dúvidas ou controvérsias relacionadas a este Contrato.',
          'E por estarem assim, justas e contratadas, as Partes assinam este Contrato em 3 (três) vias de igual teor e forma, na presença de 02 (duas) testemunhas abaixo assinadas.',
        ],
      },
    ];

    const signatories: { role: string; name: string; email: string }[] = [];

    signatories.push({
      role: 'Emitente',
      name: cpr.emitter.name,
      email: cpr.emitter.email,
    });

    if (cpr.emitter.individual.spouse) {
      signatories.push({
        role: 'Cônjuge do emitente',
        name: cpr.emitter.name,
        email: cpr.emitter.email,
      });
    }

    signatories.push({
      role: 'Credora',
      name: cpr.creditor.legalName,
      email: cpr.creditor.email,
    });

    if (cpr.guarantor) {
      signatories.push({
        role: 'Interveniente Garantidor',
        name: cpr.guarantor.name,
        email: cpr.guarantor.email,
      });
    }

    const doc = new PDFDocument({ bufferPages: true });

    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage
    doc.pipe(createWriteStream('cpr.pdf'));

    const imagePath = 'src/assets/images/capaPMG.jpg';
    const pageWidth = doc.page.width;
    doc.image(imagePath, 0, 0, {
      width: pageWidth,
      align: 'center',
    });

    doc.moveDown();
    doc.moveDown();

    doc.font('Helvetica-Bold');
    doc.fillColor('#468F5D');
    doc.fontSize(30).text('CÉDULA DE PRODUTO RURAL', { align: 'center' });

    sections.forEach((s) => {
      if (!s.content && !s.content) {
        return;
      }

      doc.fontSize(16);
      doc.moveDown();

      const rectX = 0;
      const rectY = doc.y - 5;
      const rectWidth = 50;
      const rectHeight = 22;

      doc.rect(rectX, rectY, rectWidth, rectHeight).fill('#468F5D');

      doc.fillColor('#468F5D');

      doc.font('Helvetica-Bold').text(s.title);
      doc.moveDown(0.5);
      doc.fillColor('#000');
      doc.fontSize(13);
      if (typeof s.content === 'string') {
        doc.font('Helvetica').text(s.content, { align: 'justify' });
      } else if (s.content) {
        s.content.map((sub) => {
          doc.font('Helvetica').text(sub, { align: 'justify' });
          doc.moveDown(0.5);
        });
      }
    });

    // ASSINATURA

    signatories.forEach((s) => {
      doc.moveDown(2);

      const posicaoX = 100;
      const posicaoY = doc.y;
      const larguraLinha = 200;
      const espessuraLinha = 1;

      // Adicionar a linha de assinatura
      doc
        .moveTo(posicaoX, posicaoY)
        .lineTo(posicaoX + larguraLinha, posicaoY)
        .lineWidth(espessuraLinha)
        .stroke();

      // Adicionar o nome do signatário abaixo da linha
      doc.fontSize(12).text(`${s.name} - ${s.role}`, posicaoX, posicaoY + 10);
    });

    // PAGINAÇÂO
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      const oldBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;
      doc.text(
        `Página ${i + 1} de ${pages.count}`,
        0,
        doc.page.height - oldBottomMargin / 2,
        { align: 'center' },
      );
      doc.page.margins.bottom = oldBottomMargin;
    }

    doc.flushPages();

    doc.end();
  }

  private buildGuarantor(
    createGuarantorDto: CreateGuarantorDto,
  ): GuarantorEntity {
    let individual: IndividualEntity;
    let company: CompanyEntity;

    if (createGuarantorDto.cpf) {
      let spouseData: IndividualEntity | undefined;

      if (createGuarantorDto.spouse) {
        const { spouse } = createGuarantorDto;

        spouseData = IndividualEntity.create({
          ...spouse,
          spouse: undefined,
          address: undefined,
        });
      }

      const address = AddressEntity.create(createGuarantorDto.address);

      individual = IndividualEntity.create({
        ...createGuarantorDto,
        spouse: spouseData,
        address,
      });
    } else if (createGuarantorDto.cnpj) {
      const address = AddressEntity.create(createGuarantorDto.address);
      const legalRepresentative = IndividualEntity.create({
        ...createGuarantorDto.legalRepresentative,
        spouse: undefined,
        address: undefined,
      });
      company = CompanyEntity.create({
        ...createGuarantorDto,
        address,
        legalRepresentative,
      });
    }
    return GuarantorEntity.create(individual || company);
  }
}

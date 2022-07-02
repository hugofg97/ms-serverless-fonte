const SubscriberService = require("../subscriber/SubscriberService");
const AWS = require('aws-sdk');
const { Buffer } = require('buffer');
const { isRequired, validateDocument } = require("../../core/libs/validator");
const {
  handleError,
  successfullyRead,
} = require("../../core/libs/ResponseService");

class ProfileController {
  constructor() {
    this.service = new SubscriberService();
  }

  async privacity() {
    try {
      const privacity = [
        {
          title: "POLÍTICA DE PRIVACIDADE -LGPD",
          content: "A empresa FONTE inscrita no CNPJ 43.741.771/0001-42, esclarece que temos por prioridade, zelar pela segurança e a privacidade de nossos clientes, por isso somos comprometidos e tratamos com transparência seus dados pessoais coletados, seja por meios digitais ou não.\r\nAo utilizar nossos serviços, você entende que será coletado e usado suas informações pessoais na forma descrita nesta Política, sob as normas de Proteção da Lei Federal 8078/1990 e as demais normas do ordenamento jurídico brasileiro aplicáveis.\r\n Antes de explicar sobre o tratamento dos seus dados pessoais, é importante estar consciente de que a prática do Reiki não se constitui atividade médica e não pode substituir tratamentos médicos convencionais. ",
        },
        {
          title: "GLOSSÁRIO DE TERMOS E DEFINIÇÕES:",
          content: ` `,
        },
        {
          title: "Anonimização:",
          content: "utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo. ",
        },
        {
          title: "Cookie:",
          content: "São arquivos de texto que ficam gravados no computador do internauta e podem ser recuperados pelo site que o envio durante a navegação. ",
        },
        {
          title: "Dado pessoal:",
          content: "Informação relacionada à pessoa natural identificada ou  identificável, que a identifique ou possa identificar, tais como nome, números, códigos de identificação, telefones, endereços. ",
        },
        {
          title: "Titular",
          content: "Pessoa natural a quem se referem os dados pessoais que são objeto de tratamento. ",
        },
        {
          title: "Controlador:",
          content: "Pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais.",
        },
        {
          title: "Operador:",
          content: "Pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador.",
        },
        {
          title: "Tratamento de dados pessoais:",
          content: "Toda operação realizada com dados pessoais, como as que se referem à coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle de informação, modificação, comunicação, transferência, difusão ou extração.",
        },
        {
          title: "Garantia da segurança da informação:",
          content:"Capacidade de sistemas e organizações assegurarem a disponibilidade, a integridade, a confidencialidade e a autenticidade da informação.",
        },
        {
          title: "Armazenamento",
          content: "Ação ou resultado de manter ou conservar em repositório um dado.",
        },
        {
          title: "Glossário",
          content: "Após a apresentação do glossário, a próxima etapa é entender atuamos nos procedimentos internos conforme a Lei vigente.",
        },
        {
          title: "DIRETRIZES:",
          content: "Pautamos a política de privacidade nas premissas relacionadas ao TITULAR:\r\n\n • Respeito à privacidade.\r\n\n • Tratamento de dados pessoais, observados os preceitos legais da Lei.\r\n\n • Manutenção dos dados pessoais de forma segura e protegida, em consonância as diretrizes do Código de Conduta Ética.\r\n\n • Transparência no tratamento dos dados do TITULAR, respeitando o segredo comercial/industrial.\r\n\n • Asseguração dos direitos do TITULAR, sem prejudicar o cumprimento da regulamentação vigente.\r\n\n • Observância da finalidade para tratamento dos dados pessoais do TITULAR. ",
        },
        {
          title: "PARA QUAL FINALIDADE COLETAMOS DE SEUS DADOS?",
          content: `Os dados são coletados para cadastrar você em nossa plataforma online e realizar REIKI, bem como para pagamento pela nossa prestação de serviços.`,
        },
        {
          title: "POR QUAIS MEIOS OS MEUS DADOS PODERÃO SER COLETADOS?",
          content: `• Atendimentos presencias / telefônico;\r\n• Atendimento via e-mail, WhatsApp, Skype (eletrônico).`,
        },
        {
          title: "O QUE ACONTECE COM OS MEUS DADOS APÓS A COLETA? ",
          content: `Os dados são encaminhados para os departamentos responsáveis para iniciar a prestação do objetivo serviço, os dados ficam armazenados em nosso servidor interno, apenas os colaboradores tem acesso. `,
        },
        {
          title: "DO ACESSO AOS DADOS: ",
          content: `Ao informar os dados pessoais o TITULAR está ciente da custódia dos mesmos pela nossa empresa, bem como a possibilidade de compartilhamento para cumprir obrigações da regulamentação vigente e definidas em nosso Estatuto Social.\r\nA FONTE coopera com as autoridades competentes e, portanto, pode divulgar os seus dados pessoais quando houver determinação legal, requerimento, requisição, ordem judicial, ou com autoridades judiciais, administrativas, arbitral ou governamentais competentes, sempre que autorizados, nos termos da regulamentação vigente.\r\nSomente às pessoas autorizadas é fornecido acesso às informações coletadas, de modo a assegurar o tratamento adequado dos dados pessoais.\r\nAs pessoas que utilizarem estas informações indevidamente estarão sujeitas às medidas legais cabíveis.\r\nA FONTE pode utilizar Cookies e tecnologias similares para reconhecer suas visitas às plataformas digitais e também, podemos utilizar Cookies para nos permitir apresentar o conteúdo mais relevante para o usuário e oferecer uma melhor experiência baseada em suas preferências.\r\nPara poder fazer uso das plataformas digitais da FONTE pode ser necessário o aceite ao uso de COOKIES.`,
        },
        {
          title: "ARMAZENAMENTO DE DADOS:",
          content: `A FONTE dispõe de infraestrutura própria para o armazenamento de dados pessoais, no entanto, pode fazer uso de infraestrutura de terceiro para esta atividade, se assim entender adequado.\r\nOs locais de armazenamento são escolhidos para operar com eficiência, melhorar o desempenho e criar contingências para proteger os dados no caso de uma interrupção ou outros problemas de indisponibilidade.`,
        },
        {
          title: "TEMPO DE ARMAZENAMENTO DO DADO:",
          content: `A FONTE pode reter dados pessoais para cumprir as obrigações legais ou regulamentares, os dados pessoais serão mantidos sempre que houver necessidade legal legítima ou hipótese prevista na legislação vigente.\r\nO TITULAR está ciente que o armazenamento para fins estatísticos ou históricos poderão ser realizados, sem prejuízo de eventual anonimização, quando aplicável. Os dados pessoais serão mantidos no sistema da FONTE pelo maior dos seguintes períodos:\r\na) enquanto for necessário para o desempenho das atividades do Operador, pertinentes ao alcance da finalidade almejada;\r\nb) qualquer período de retenção exigido pela lei e regulamento ou respaldadas em contratos, convênios ou instrumentos congêneres.`,
        },
        {
          title: "COMPARTILHAMENTO DO DADOS:",
          content: `Quando necessário, as informações do TITULAR serão compartilhadas com os provedores de serviços terceirizados (parceiros de negócios) que atuam para dar suporte no desempenho das atividades da empresa.\r\nAdotamos procedimentos para que as empresas prestadoras de serviços contratadas atuem com o mesmo comprometimento com a privacidade de dados aderente a esta Política, os dados coletados e armazenados também poderão ser compartilhados desde que observadas as hipóteses admitidas na LGPD. `,
        },
        {
          title: "QUAIS SÃO OS SEUS DIREITOS:",
          content: `Você poderá nos contatar para exercer os seus direitos previstos na Lei, sobretudo os direitos nomeados abaixo: \r\n\n1. Confirmação da existência de tratamento;\r\n\n2. Acesso aos dados; \r\n\n3. Correção de dados incompletos, inexatos ou desatualizados; \r\n\n4. Anonimização, se cabível; \r\n\n5. Bloqueio; \r\n\n6. Eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a lei; \r\n\n7. Revogação do consentimento; \r\n\n8. Eliminação dos dados tratados com o consentimento; \r\n\n9. Informação da possibilidade de recusar o consentimento e consequências; \r\n\n10. Informações das entidades a quem os dados foram compartilhados;\r\n\n11. Direito de oposição em havendo descumprimento da lei nas hipóteses de dispensado consentimento; \r\n\n12. Direito de petição à autoridade pública (ANPD). \r\n\n`,
        },
        {
          title: "SEGURANÇA DOS DADOS:  ",
          content: `A presente Política pode sofrer atualização sempre que o Operador mudar a forma de tratar os dados pessoais, sendo reservado a FONTE o direito de realizar tais alterações a qualquer tempo, desde que mantida a conformidade com a legislação vigente.`,
        },
        {
          title: "SEGURANÇA DOS DADOS:  ",
          content: `São adotadas medidas técnicas e organizacionais apropriadas e razoáveis, projetadas para proteger os dados pessoais do TITULAR inseridos no ambiente da Fonte para prevenir a perda, uso indevido, acesso não autorizado, divulgação indevida, alteração não autorizada e destruição inapropriada, levando em consideração os riscos envolvidos no processamento e a natureza dos dados pessoais.\r\nCompete ao TITULAR do dado tomar as precauções necessárias para se proteger contra fraudes ao utilizar os Serviços Externos e proteger os seus sistemas informatizados contra vírus.\r\nA FONTE não se responsabiliza por práticas maliciosas ou pelo mau uso de conteúdo de outros sites, bem como por falhas na segurança de dados ou ilegalidades cometidas por outrem.\r\nEm caso de incidentes de segurança que possa gerar aos seus dados pessoais, a FONTE garantirá de imediato a operacionalização de protocolos de resposta para correção e mitigação dos efeitos, comunicará aos afetados e a Autoridade Nacional de Proteção de Dados sobre o ocorrido, em consonância com as disposições da Lei Geral de Proteção de Dados.`,
        },
        {
          title: "ENCARREGADO PARA O TRATAMENTO DE DADOS PESSOAIS:  ",
          content: `Para atuar como canal de comunicação com o TITULAR dos dados pessoais fica disponível o endereço de e-mail: chernandez_jps@hotmail.com.`,
        },
        {
          title: "DISPOSIÇÕES GERAIS: ",
          content: `Excepcionalmente, esta Política Organizacional está estruturada de forma a atender à Lei vigente, esta Política Organizacional revoga todas as disposições em contrário firmadas até o momento sobre o assunto.`,
        },
      ];
      return successfullyRead({ data: privacity });
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  }
  async profileImage({userSession, body}) {
    try {
      const { image } = JSON.parse(body);
      
      isRequired(image);
      const userExists = await this.service.findById(userSession);
      if (!userExists) throw 400;

      const base64Image = image.split(';base64,').pop();
      const bufferImg = Buffer.from(base64Image, 'base64');
      const dateImageUpload = new Date().getTime();
      const s3 = new AWS.S3({
        params: {
          Bucket: process.env.AWS_BUCKET_NAME_PICTURES
        },
      });
      const data = {
        Key: `${process.env.AWS_PASTE_PROFILE_IMAGES}/${userSession.document}-${dateImageUpload}.jpeg`,
        Body: bufferImg,
        Bucket: process.env.AWS_BUCKET_NAME_PICTURES,
        ContentEncoding: 'image/jpeg',
        ACL: "public-read"
      }
      const upload = await s3
        .putObject(data, function (err, data) {
          if (err) {
            console.log('Error uploading data: ', err);
          }
        })
        .promise().then(d => true).catch(e => false);
      if (!upload) throw 400;
      const imageUrl = `${process.env.AWS_URL_BUCKET}/${process.env.AWS_PASTE_PROFILE_IMAGES}/${userSession.document}-${dateImageUpload}.jpeg`;
      const saveDbImageLink = await this.service.setUrlImageProfile({ ...userSession, profileImage: imageUrl });
      if(!saveDbImageLink) throw 400;
      return successfullyRead({ data: { imageUrl: imageUrl, fullUserData: saveDbImageLink } });
    } catch (error) {
      console.log(error)
      return handleError(error);
    }
  }
  async support() {
    try {
      const privacity = [
       
        {
          title: "Videos estão bloqueados",
          content: `Em nossa plataforma disponibilizamos diversos videos gratuitos, mas para manter nosso propósito precisamos de sua ajuda! Sendo assim, alguns videos dependem que você seja assinante para assisti-los, que tal experimentar? Assine agora!`,
        },
        {
          title: "Agendei uma consulta, e agora?",
          content: `Agora é só esperar que entraremos em contato, pois precisamos te conhecer, saber o propósito da consulta para que você possa ser atendido da melhor forma possivel, entraremos em contato por whatsapp e email, e marcaremos uma data e horario que podera ser visualizada na aba de consultas`,
        },
        {
          title: "Entre em contato conosco",
          content: `Para reportar algum bug, ou problema em nosso app, envie um email anexando o problema para suporte@fontereiki.com.br`,
        }
      ];
      return successfullyRead({ data: privacity });
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  }
  async dayTexts() {
    try {
      const privacity = [
        {
          page: "HOME",
          text: `Só por hoje não me preocupo`,
        },
        {
          page: "REIKI",
          text: `Só por hoje não me preocupo`,
        },
        {
          page: "MEDITACAO",
          text: `Só por hoje não me preocupo`,
        },
        {
          page: "DICAS",
          text: `Só por hoje não me preocupo`,
        },
        {
          page: "FAVORITOS",
          text: `Só por hoje não me preocupo`,
        },
        {
          page: "PERFIL",
          text: `Só por hoje não me preocupo`,
        },
      ];
      return successfullyRead({ data: privacity });
    } catch (error) {
      console.log(error);
      return handleError(error);
    }
  }

  async update() { }
}

module.exports = ProfileController;

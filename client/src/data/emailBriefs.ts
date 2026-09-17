export type EmailBriefStep = {
  step: string;
  role: string;
  direction: string;
  example: string;
};

export type EmailBriefVersion = {
  id: string;
  label: string;
  audience: string;
  objective: string;
  subjectDirection: string;
  steps: EmailBriefStep[];
  cta: string;
  destinationLabel: string;
  destinationUrl: string;
  exclusion: string;
};

export type EmailDecisionRule = {
  condition: string;
  action: string;
  reason: string;
};

export type EmailCampaignBrief = {
  label: string;
  decision: string;
  rationale: string;
  versions: EmailBriefVersion[];
  routing: EmailDecisionRule[];
  productionChecks: string[];
  fallback: string;
  limits: string;
};

const masterclassesUrl = "https://masterclassconference.savagetgroup.com.br/";
const masterclassesThankYouUrl =
  "https://masterclassconference.savagetgroup.com.br/obrigado";
const newsUrl = "https://oferta.savagetgroup.com.br/conference-2027";
const bodybuildingReelUrl = "https://www.instagram.com/reel/DVZDZWEFPP3/";
const sonafePostUrl =
  "https://www.instagram.com/p/DTnBm0Qlo0Q/?stkn=MW0wbmNwN2c2bmwwMw%3D%3D";

export const emailCampaignBriefs: Record<string, EmailCampaignBrief> = {
  "email-base-comparativo": {
    label: "Briefing detalhado · envio de 18/09",
    decision:
      "Usar as três masterclasses como próximo passo para quem ainda não liberou as aulas.",
    rationale:
      "Este envio não precisa levar novamente à Landing Page de Novidades. Para quem ainda não se cadastrou nas masterclasses, o avanço mais útil é receber três aulas completas de 2026. O e-mail apresenta essa entrega de forma simples e exclui quem já liberou as aulas.",
    versions: [
      {
        id: "masterclasses",
        label: "Versão única · três aulas disponíveis",
        audience:
          "Contatos engajados e participantes anteriores com interesse em Nutrição Estética, Nutrição Esportiva ou Gestão de Academias que ainda não se cadastraram nas masterclasses.",
        objective:
          "Mostrar o que a pessoa recebe: três aulas completas da edição de 2026, uma de cada área representada na isca.",
        subjectDirection:
          "Dizer de forma direta que há três aulas gratuitas disponíveis. Exemplos de direção: ‘Três aulas completas do Arnold Conference para assistir gratuitamente’ ou ‘Escolha por qual das três masterclasses começar’. A copy final passa por aprovação.",
        steps: [
          {
            step: "Bloco 1",
            role: "Oferta clara",
            direction:
              "Abrir informando que três aulas completas da edição de 2026 estão disponíveis gratuitamente.",
            example:
              "Você pode assistir gratuitamente a três aulas completas do Arnold Conference 2026.",
          },
          {
            step: "Bloco 2",
            role: "Quais são as aulas",
            direction:
              "Listar palestrante, título e área de cada aula. Não citar informações de 2027 que ainda sejam internas.",
            example:
              "Ana Paula Pujol — Estratégias Nutricionais para Emagrecimento; Andreia Naves — Update na Suplementação de Carboidratos; Roberto Tranjan — Academias em Alta Potência: de corpo, mente e alma.",
          },
          {
            step: "Bloco 3",
            role: "Como escolher",
            direction:
              "Relacionar cada aula a uma necessidade simples, sem comparar congressos.",
            example:
              "Emagrecimento e reganho: Ana Paula. Carboidratos e performance: Andreia. Gestão, direção e equipe: Roberto.",
          },
          {
            step: "Bloco 4",
            role: "Ação",
            direction:
              "Explicar que um único cadastro libera as três aulas e usar apenas um botão para a Landing Page das masterclasses.",
            example:
              "Cadastre-se uma vez, libere as três aulas e comece pelo tema mais próximo do seu trabalho.",
          },
        ],
        cta: "Liberar as 3 masterclasses gratuitas",
        destinationLabel: "Landing page das masterclasses",
        destinationUrl: masterclassesUrl,
        exclusion:
          "Não enviar a quem já se cadastrou nas masterclasses. Esse público deve receber conteúdo de continuidade, e não outro pedido para preencher o mesmo formulário.",
      },
    ],
    routing: [
      {
        condition:
          "Tem interesse em uma das três áreas representadas e ainda não se cadastrou nas masterclasses",
        action:
          "Enviar o e-mail de 18/09 com o botão para a Landing Page das masterclasses.",
        reason: "A pessoa ainda não recebeu a isca compatível com sua área.",
      },
      {
        condition: "Já se cadastrou nas masterclasses",
        action:
          "Excluir deste disparo e manter na sequência de consumo das aulas.",
        reason: "Repetir o cadastro cria atrito e não acrescenta conteúdo.",
      },
      {
        condition:
          "Tem interesse apenas em SONAFE, Bodybuilding ou Certificação Internacional em Personal Training – WTTC",
        action: "Não enviar esta campanha.",
        reason:
          "As três aulas não representam essas áreas. Cada público deve receber conteúdo compatível com seu interesse.",
      },
    ],
    productionChecks: [
      "Selecionar apenas contatos das três áreas representadas pelas aulas.",
      "Excluir todos os contatos que já converteram na Landing Page das masterclasses.",
      "Usar um único botão e uma UTM específica para o disparo de 18/09.",
      "Conferir títulos, nomes e descrições nas próprias aulas de 2026.",
      "Não incluir programação, sessões, palestrantes ou promessas de 2027 ainda não divulgadas.",
    ],
    fallback:
      "Se não houver segmentação por área, enviar somente a contatos que abriram ou clicaram nos e-mails anteriores das masterclasses e ainda não converteram.",
    limits:
      "O e-mail não anuncia data de vendas, preço ou lote. Ele promove somente as três aulas de 2026 já disponíveis.",
  },
  "email-base-48h": {
    label: "Briefing detalhado · envio de 21/09",
    decision:
      "Aprofundar Nutrição Esportiva com uma ideia concreta da aula de Andreia Naves.",
    rationale:
      "Este envio não mistura três palestrantes nem três teses. Ele usa uma única questão: como separar evolução científica de argumento de marketing na suplementação de carboidratos. Quem ainda não liberou as aulas vai para a isca; quem já se cadastrou retorna diretamente à página das aulas.",
    versions: [
      {
        id: "nutricao-esportiva-nao-converteu",
        label: "Versão A · ainda não liberou as aulas",
        audience:
          "Nutricionistas e profissionais ligados à Nutrição Esportiva que ainda não se cadastraram nas masterclasses.",
        objective:
          "Apresentar uma pergunta relevante da aula de Andreia Naves e convidar a pessoa a assistir ao conteúdo completo.",
        subjectDirection:
          "Usar uma pergunta direta. Exemplos: ‘Suplementação de carboidratos: evolução ou argumento de marketing?’ ou ‘Antes de aumentar a dose, o que precisa ser avaliado?’. Não colocar dose no assunto.",
        steps: [
          {
            step: "Bloco 1",
            role: "Pergunta central",
            direction:
              "Abrir com a dúvida que orienta o e-mail: como diferenciar atualização científica de uma promessa comercial.",
            example:
              "Quando surge uma nova estratégia de suplementação, o primeiro passo não é copiar: é entender a evidência, o contexto e para quem ela se aplica.",
          },
          {
            step: "Bloco 2",
            role: "Exemplo da aula",
            direction:
              "Explicar que Andreia questiona recomendações concentradas tratadas como solução universal e relaciona estratégia à adaptação do atleta. Não prescrever quantidade.",
            example:
              "Na aula, Andreia mostra por que uma recomendação popular pode exigir mais contexto antes de virar conduta profissional.",
          },
          {
            step: "Bloco 3",
            role: "O que a pessoa encontra",
            direction:
              "Apresentar o título oficial da aula e deixar claro que o conteúdo é da edição de 2026.",
            example:
              "Masterclass: Update na Suplementação de Carboidratos — da Tecnologia à Ciência e Aplicação Prática.",
          },
          {
            step: "Bloco 4",
            role: "Ação",
            direction:
              "Convidar para liberar as três masterclasses; a aula de Andreia é o ponto de entrada desta segmentação.",
            example:
              "Libere as três masterclasses e comece pela aula de Nutrição Esportiva.",
          },
        ],
        cta: "Assistir à masterclass de Andreia Naves",
        destinationLabel: "Landing page das masterclasses",
        destinationUrl: masterclassesUrl,
        exclusion:
          "Não enviar esta versão a quem já se cadastrou nas masterclasses.",
      },
      {
        id: "nutricao-esportiva-ja-converteu",
        label: "Versão B · já liberou as aulas",
        audience:
          "Contatos com interesse em Nutrição Esportiva que já se cadastraram nas masterclasses.",
        objective:
          "Fazer a pessoa retornar à aula de Andreia Naves sem pedir novo cadastro.",
        subjectDirection:
          "Tratar como retomada de conteúdo. Exemplo: ‘Uma pergunta para levar à aula de Andreia Naves’. Não apresentar a aula como nova inscrição.",
        steps: [
          {
            step: "Bloco 1",
            role: "Retomada",
            direction:
              "Lembrar que a aula já está liberada e apresentar a pergunta sobre evidência e marketing.",
            example:
              "Sua aula já está disponível. Ao assistir, observe como Andreia diferencia atualização científica de uma recomendação transformada em tendência.",
          },
          {
            step: "Bloco 2",
            role: "Onde prestar atenção",
            direction:
              "Orientar a atenção para critérios, contexto e adaptação, sem antecipar prescrição.",
            example:
              "Procure os momentos em que a palestrante questiona soluções universais e reforça a necessidade de adaptação.",
          },
          {
            step: "Bloco 3",
            role: "Aplicação editorial",
            direction:
              "Propor uma pergunta de reflexão profissional, não um protocolo.",
            example:
              "Que informação você verificaria antes de transformar uma tendência em conduta para um atleta?",
          },
          {
            step: "Bloco 4",
            role: "Ação",
            direction:
              "Levar diretamente à página onde as aulas já estão disponíveis.",
            example: "Retome a aula de Andreia Naves no ponto que preferir.",
          },
        ],
        cta: "Retomar a aula de Nutrição Esportiva",
        destinationLabel: "Página das três aulas",
        destinationUrl: masterclassesThankYouUrl,
        exclusion:
          "Não pedir novo cadastro. O acesso depende do mesmo navegador ou da identificação por e-mail já prevista na página.",
      },
    ],
    routing: [
      {
        condition: "Interesse em Nutrição Esportiva + ainda não se cadastrou",
        action: "Enviar a Versão A para a Landing Page das masterclasses.",
        reason: "A isca oferece uma aula diretamente relacionada ao interesse.",
      },
      {
        condition: "Interesse em Nutrição Esportiva + já se cadastrou",
        action: "Enviar a Versão B para a página das aulas.",
        reason:
          "O próximo passo é consumir o conteúdo, não preencher o formulário novamente.",
      },
      {
        condition: "Não há sinal de interesse em Nutrição Esportiva",
        action: "Não enviar este e-mail.",
        reason:
          "O tema é específico e não deve ser usado como disparo genérico.",
      },
    ],
    productionChecks: [
      "Separar convertidos e não convertidos antes de preparar os links.",
      "Usar o título oficial da aula e identificar que o conteúdo é de 2026.",
      "Não colocar doses, protocolos ou promessas de performance na copy.",
      "Usar UTM diferente em cada versão.",
    ],
    fallback:
      "Se não for possível separar convertidos, não disparar para toda a base. Priorizar quem clicou nos e-mails das masterclasses e usar a rota de acesso já compatível com esse histórico.",
    limits:
      "A pauta é evidência versus argumento de marketing. Não é um guia de suplementação e não antecipa a programação de 2027.",
  },
  "email-base-vespera": {
    label: "Briefing detalhado · envio de 22/09",
    decision:
      "Aquecer Bodybuilding com um conteúdo público sobre a equipe que sustenta a preparação.",
    rationale:
      "Como ainda não existe uma isca específica de Bodybuilding, o e-mail entrega valor no próprio corpo da mensagem e oferece o Reel original como aprofundamento. A Landing Page de Novidades aparece somente para quem ainda não está cadastrado.",
    versions: [
      {
        id: "bodybuilding-conteudo",
        label: "Versão A · contato já está na lista de novidades",
        audience:
          "Leads com interesse em Bodybuilding que já estão cadastrados na Landing Page de Novidades.",
        objective:
          "Mostrar que a preparação de alto rendimento envolve diferentes especialidades e não se limita ao treino visível no palco.",
        subjectDirection:
          "Usar uma chamada direta. Exemplos: ‘Quem trabalha por trás de uma preparação de alto rendimento?’ ou ‘O físico de palco não é construído por uma única especialidade’. A copy final passa por revisão técnica.",
        steps: [
          {
            step: "Bloco 1",
            role: "Pergunta",
            direction:
              "Abrir perguntando quais profissionais participam de uma preparação de alto rendimento.",
            example:
              "Treino e nutrição aparecem primeiro. Mas uma preparação pode envolver também medicina, fisioterapia, LPF e psicologia.",
          },
          {
            step: "Bloco 2",
            role: "Relato disponível",
            direction:
              "Apresentar como experiência relatada por Ricardo Pannain, não como regra universal.",
            example:
              "No Reel, Ricardo Pannain explica como ampliou a equipe e por que passou a incluir apoio psicológico no trabalho com atletas.",
          },
          {
            step: "Bloco 3",
            role: "Pergunta para reflexão",
            direction:
              "Mostrar que integrar especialidades também exige coordenação, limites de atuação e decisões compartilhadas.",
            example:
              "Não basta reunir profissionais: é preciso definir o papel de cada especialidade e como as decisões serão integradas.",
          },
          {
            step: "Bloco 4",
            role: "Ação",
            direction: "Convidar para assistir ao Reel original.",
            example: "Veja o relato completo de Ricardo Pannain.",
          },
        ],
        cta: "Assistir ao Reel",
        destinationLabel: "Reel público do Arnold Conference",
        destinationUrl: bodybuildingReelUrl,
        exclusion:
          "Não usar este conteúdo para afirmar que uma especialidade isolada causa títulos, performance ou saúde.",
      },
      {
        id: "bodybuilding-cadastro",
        label: "Versão B · contato ainda não está na lista",
        audience:
          "Leads com interesse em Bodybuilding que ainda não se cadastraram na Landing Page de Novidades.",
        objective:
          "Entregar o mesmo conteúdo e, no final, oferecer a inscrição para receber futuras novidades da sala.",
        subjectDirection:
          "Manter o mesmo tema da Versão A. O cadastro entra como próximo passo, não como assunto principal.",
        steps: [
          {
            step: "Bloco 1",
            role: "Pergunta",
            direction:
              "Abrir com a pergunta sobre quem trabalha por trás de uma preparação.",
            example:
              "O público vê o atleta no palco. A preparação, porém, pode envolver uma equipe muito maior.",
          },
          {
            step: "Bloco 2",
            role: "Exemplo",
            direction:
              "Resumir o relato de Ricardo Pannain e oferecer o Reel como link secundário no texto.",
            example:
              "Ricardo relata a presença de medicina, Educação Física, nutrição, LPF e psicologia em sua equipe.",
          },
          {
            step: "Bloco 3",
            role: "Conexão com a sala",
            direction:
              "Relacionar o tema ao tipo de discussão que interessa ao público de Bodybuilding, sem anunciar programação.",
            example:
              "Esse olhar multidisciplinar ajuda a entender a preparação para além do resultado visual.",
          },
          {
            step: "Bloco 4",
            role: "Ação",
            direction:
              "Convidar a pessoa a cadastrar seu interesse para receber novidades de Bodybuilding.",
            example:
              "Cadastre-se para acompanhar as próximas novidades do Arnold Conference.",
          },
        ],
        cta: "Quero receber novidades de Bodybuilding",
        destinationLabel: "Landing page de novidades",
        destinationUrl: newsUrl,
        exclusion:
          "Não enviar esta versão a quem já está cadastrado na Landing Page de Novidades.",
      },
    ],
    routing: [
      {
        condition: "Interesse em Bodybuilding + já está na lista de novidades",
        action: "Enviar a Versão A e usar o Reel como destino principal.",
        reason:
          "A pessoa já cumpriu a etapa de cadastro e deve receber conteúdo.",
      },
      {
        condition: "Interesse em Bodybuilding + ainda não está na lista",
        action:
          "Enviar a Versão B e usar a Landing Page de Novidades como CTA principal.",
        reason:
          "O conteúdo aquece; o cadastro registra a preferência para próximos envios.",
      },
      {
        condition: "Sem sinal de interesse em Bodybuilding",
        action: "Não enviar este e-mail.",
        reason:
          "A pauta é específica e não deve ser enviada indiscriminadamente.",
      },
    ],
    productionChecks: [
      "Usar somente o Reel DVZDZWEFPP3 como fonte principal.",
      "Identificar o conteúdo como relato de Ricardo Pannain.",
      "Revisar nomenclaturas das especialidades antes da aprovação.",
      "Não transformar a fala em relação causal entre equipe, saúde e títulos.",
      "Separar cadastrados e não cadastrados antes de definir o CTA.",
    ],
    fallback:
      "Se a equipe não conseguir separar cadastrados, enviar somente a quem ainda não está na lista e usar a Landing Page de Novidades. Não pedir novo cadastro a uma base sem conferência.",
    limits:
      "O e-mail não apresenta programação de 2027, protocolo de preparação ou promessa de resultado.",
  },
  "email-base-vendas-abertas": {
    label: "Briefing detalhado · envio de 23/09",
    decision:
      "Aquecer SONAFE com um conteúdo público sobre recovery, prevenção e avaliação.",
    rationale:
      "Sem uma isca própria da SONAFE, o e-mail precisa entregar uma ideia útil antes de pedir cadastro. O conteúdo-base já é público: recovery não começa no recurso da moda, mas na avaliação, na organização da carga e no respeito aos limites. Esses eixos também aparecem entre os temas centrais confirmados para 2027. Quem já está na lista vai para o post; quem ainda não está pode cadastrar seu interesse.",
    versions: [
      {
        id: "sonafe-conteudo",
        label: "Versão A · contato já está na lista de novidades",
        audience:
          "Fisioterapeutas e profissionais ligados à Fisioterapia Esportiva que já estão cadastrados na Landing Page de Novidades.",
        objective:
          "Mostrar que recovery também envolve prevenção, avaliação e organização de carga, e não apenas técnicas aplicadas depois da dor.",
        subjectDirection:
          "Usar uma pergunta simples. Exemplos: ‘Recovery começa antes da dor?’ ou ‘Antes do gelo e da massagem, o que precisa ser avaliado?’. Evitar promessas clínicas.",
        steps: [
          {
            step: "Bloco 1",
            role: "Quebra de expectativa",
            direction:
              "Abrir dizendo que recovery não se resume a gelo, botas ou massagens.",
            example:
              "Recovery não começa quando aparece a dor e não depende apenas de uma técnica isolada.",
          },
          {
            step: "Bloco 2",
            role: "O que vem antes",
            direction:
              "Apresentar os três pontos do material público: avaliação, organização do treino e respeito aos limites do corpo.",
            example:
              "Antes de escolher um recurso, é preciso entender carga, contexto e sinais do atleta.",
          },
          {
            step: "Bloco 3",
            role: "Prevenção e aderência a 2027",
            direction:
              "Explicar que observar sobrecargas e fatores de risco faz parte do processo e que avaliação, carga e prevenção estão entre os temas centrais confirmados para 2027, sem abrir a grade.",
            example:
              "Na edição de 2027, avaliação, controle de carga e prevenção estarão entre os eixos de aprofundamento da SONAFE.",
          },
          {
            step: "Bloco 4",
            role: "Ação",
            direction: "Convidar para ler o carrossel público da SONAFE.",
            example: "Veja o conteúdo completo sobre recovery e prevenção.",
          },
        ],
        cta: "Ler o conteúdo sobre recovery",
        destinationLabel: "Carrossel público da SONAFE",
        destinationUrl: sonafePostUrl,
        exclusion:
          "Não transformar o conteúdo em protocolo, diagnóstico ou recomendação clínica individual.",
      },
      {
        id: "sonafe-cadastro",
        label: "Versão B · contato ainda não está na lista",
        audience:
          "Fisioterapeutas e profissionais ligados à Fisioterapia Esportiva que ainda não se cadastraram na Landing Page de Novidades.",
        objective:
          "Entregar o mesmo conteúdo e convidar a pessoa a registrar interesse em SONAFE para receber futuras novidades.",
        subjectDirection:
          "Manter o tema de recovery como assunto. O cadastro aparece somente no fechamento.",
        steps: [
          {
            step: "Bloco 1",
            role: "Quebra de expectativa",
            direction:
              "Abrir dizendo que recovery não se resume à técnica usada depois da dor.",
            example:
              "Gelo, botas e massagem não respondem sozinhos a todas as perguntas do recovery.",
          },
          {
            step: "Bloco 2",
            role: "Critérios",
            direction:
              "Apresentar avaliação, carga, contexto e prevenção como pontos a considerar.",
            example:
              "O raciocínio começa por entender o atleta, a modalidade, a carga e os sinais observados.",
          },
          {
            step: "Bloco 3",
            role: "Conexão com SONAFE 2027",
            direction:
              "Relacionar o tema aos eixos confirmados de avaliação, controle de carga, prevenção e retorno ao esporte, sem anunciar sessões ou palestrantes.",
            example:
              "Esses temas centrais conectam prevenção, recuperação e retorno ao esporte na SONAFE 2027.",
          },
          {
            step: "Bloco 4",
            role: "Ação",
            direction:
              "Convidar a pessoa a cadastrar seu interesse para acompanhar novidades da SONAFE.",
            example: "Cadastre-se e indique SONAFE como área de interesse.",
          },
        ],
        cta: "Quero receber novidades da SONAFE",
        destinationLabel: "Landing page de novidades",
        destinationUrl: newsUrl,
        exclusion:
          "Não enviar esta versão a quem já está cadastrado na Landing Page de Novidades.",
      },
    ],
    routing: [
      {
        condition: "Interesse em SONAFE + já está na lista de novidades",
        action: "Enviar a Versão A e direcionar para o carrossel público.",
        reason:
          "A pessoa já se cadastrou; agora precisa receber conteúdo útil.",
      },
      {
        condition: "Interesse em SONAFE + ainda não está na lista",
        action:
          "Enviar a Versão B e direcionar para a Landing Page de Novidades.",
        reason:
          "O cadastro registra a preferência para a continuidade da jornada.",
      },
      {
        condition: "Sem sinal de interesse em Fisioterapia Esportiva",
        action: "Não enviar este e-mail.",
        reason: "O assunto é específico e deve chegar ao público aderente.",
      },
    ],
    productionChecks: [
      "Usar o carrossel público DTnBm0Qlo0Q como fonte principal.",
      "Submeter a versão final à revisão técnica de profissional da SONAFE.",
      "Apresentar somente avaliação, controle de carga, prevenção e retorno ao esporte como temas centrais confirmados para 2027.",
      "Preservar títulos integrais, horários, sequência e palestrantes para a divulgação completa da programação.",
      "Não transformar os conceitos em protocolo clínico.",
      "Separar cadastrados e não cadastrados antes de definir o CTA.",
    ],
    fallback:
      "Se não houver separação segura entre cadastrados e não cadastrados, priorizar a versão de conteúdo e direcionar ao carrossel público. É melhor entregar valor do que pedir um cadastro possivelmente repetido.",
    limits:
      "O e-mail não promete prevenção de lesões, diagnóstico, tratamento ou resultado clínico.",
  },
  "email-base-recuperar-inscricao": {
    label: "Briefing detalhado · envio de 24–25/09",
    decision:
      "Usar este envio somente para registrar a área de interesse de quem ainda não a informou.",
    rationale:
      "Este não é um comparativo entre congressos e não deve ser enviado a toda a base. A função é ajudar contatos engajados, mas ainda sem área de interesse registrada, a reconhecer qual opção corresponde à sua atuação e atualizar a preferência na Landing Page de Novidades.",
    versions: [
      {
        id: "preferencia-pendente",
        label: "Versão única · preferência ainda não registrada",
        audience:
          "Contatos engajados que ainda não escolheram uma área de interesse na Landing Page de Novidades.",
        objective:
          "Explicar os seis públicos em uma frase cada e pedir que a pessoa registre apenas a área ligada à sua atuação.",
        subjectDirection:
          "Usar uma pergunta objetiva. Exemplos: ‘Qual área do Arnold Conference acompanha o seu trabalho?’ ou ‘Escolha a área sobre a qual você quer receber novidades’. Evitar ‘qual congresso é melhor para você’. ",
        steps: [
          {
            step: "Bloco 1",
            role: "Por que responder",
            direction:
              "Explicar que a escolha serve para receber comunicações mais relevantes e evitar assuntos que não tenham relação com a profissão da pessoa.",
            example:
              "Indique sua área para receber novidades mais próximas do seu trabalho.",
          },
          {
            step: "Bloco 2",
            role: "Seis públicos",
            direction:
              "Apresentar cada congresso pelo público, sem colocar um contra o outro.",
            example:
              "Gestão de Academias: gestores e proprietários. Certificação Internacional em Personal Training – WTTC: personal trainers. SONAFE: fisioterapeutas. Nutrição Estética e Nutrição Esportiva: nutricionistas de cada área. Bodybuilding: profissionais e público especializado na preparação de atletas.",
          },
          {
            step: "Bloco 3",
            role: "Critério simples",
            direction:
              "Orientar a pessoa a escolher pela própria atuação e pelo tema profissional que deseja acompanhar.",
            example:
              "Escolha a área que corresponde ao seu trabalho hoje ou ao campo em que pretende se desenvolver.",
          },
          {
            step: "Bloco 4",
            role: "Ação",
            direction:
              "Levar à Landing Page de Novidades para registrar a preferência.",
            example:
              "Cadastre sua área de interesse para receber as próximas novidades.",
          },
        ],
        cta: "Escolher minha área de interesse",
        destinationLabel: "Landing page de novidades",
        destinationUrl: newsUrl,
        exclusion:
          "Excluir quem já informou uma área de interesse. Esse público deve continuar recebendo conteúdo específico da área escolhida.",
      },
    ],
    routing: [
      {
        condition: "Contato engajado + ainda não informou área de interesse",
        action:
          "Enviar este e-mail e direcionar para a Landing Page de Novidades.",
        reason:
          "Há uma informação útil de segmentação que ainda precisa ser registrada.",
      },
      {
        condition: "Já informou uma ou mais áreas de interesse",
        action: "Não enviar este e-mail.",
        reason: "A pergunta já foi respondida e não deve ser repetida.",
      },
      {
        condition: "Contato sem engajamento recente",
        action: "Não priorizar neste disparo.",
        reason:
          "A mensagem exige uma ação de atualização e funciona melhor com audiência ativa.",
      },
    ],
    productionChecks: [
      "Cruzar a base com o campo de interesse antes de montar o disparo.",
      "Apresentar os seis públicos separadamente, sem formato versus.",
      "Escrever sempre Certificação Internacional em Personal Training – WTTC antes da sigla.",
      "Não citar programação, sessões, palestrantes, preços ou data de abertura.",
      "Usar uma única UTM para esta campanha de atualização de preferência.",
    ],
    fallback:
      "Se não for possível identificar quem já informou a preferência, não disparar para toda a base. Manter o conteúdo nas redes sociais e retomar o e-mail quando a segmentação estiver disponível.",
    limits:
      "Este envio não recomenda um congresso nem compara produtos. Ele apenas identifica a área profissional sobre a qual o contato quer receber novidades.",
  },
};

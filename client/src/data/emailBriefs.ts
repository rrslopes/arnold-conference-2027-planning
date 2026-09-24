import { octoberEmailBriefs } from "./octoberPlan";

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
  secondaryAction?: {
    label: string;
    destinationLabel: string;
    destinationUrl: string;
    context: string;
  };
  exclusion: string;
};

export type EmailDecisionRule = {
  condition: string;
  action: string;
  reason: string;
};

export type EmailSourceLink = {
  label: string;
  url: string;
  note: string;
};

export type EmailCampaignBrief = {
  label: string;
  decision: string;
  rationale: string;
  versions: EmailBriefVersion[];
  routing: EmailDecisionRule[];
  productionChecks: string[];
  agencyResearch?: string[];
  proofGate?: string;
  sourceLinks?: EmailSourceLink[];
  fallback: string;
  limits: string;
};

const masterclassesUrl = "https://masterclassconference.savagetgroup.com.br/";
const newsUrl = "https://oferta.savagetgroup.com.br/conference-2027";
const bodybuildingReelUrl = "https://www.instagram.com/reel/DVZDZWEFPP3/";

export const emailCampaignBriefs: Record<string, EmailCampaignBrief> = {
  "email-base-comparativo": {
    label: "Briefing detalhado · envio de 18/09",
    decision:
      "Manter a pauta publicada: mostrar a profundidade já visível nos temas centrais de Nutrição Estética e SONAFE.",
    rationale:
      "O próprio e-mail entrega a prévia temática e mantém o público aquecido. Não é necessário criar versões diferentes para quem já está ou não está na lista. O único botão leva à Landing Page de Novidades; quem já se cadastrou continua recebendo valor pelo conteúdo e não precisa preencher o formulário novamente.",
    versions: [
      {
        id: "programacoes-em-profundidade",
        label: "Versão única · prévia temática",
        audience:
          "Base engajada e participantes anteriores. Se os campos de interesse estiverem disponíveis, priorizar afinidade com Nutrição Estética ou SONAFE, sem criar peças diferentes.",
        objective:
          "Demonstrar a profundidade já visível em Nutrição Estética e SONAFE por meio dos temas centrais autorizados.",
        subjectDirection:
          "Apresentar a ideia de profundidade de forma direta. Exemplos: ‘O que os temas de Nutrição Estética e SONAFE já revelam’ ou ‘Duas salas, diferentes desafios profissionais e mais profundidade em 2027’. Não comparar os congressos.",
        steps: [
          {
            step: "Bloco 1",
            role: "Por que olhar para os temas",
            direction:
              "Abrir explicando que a qualidade de uma programação aparece nas perguntas profissionais que ela ajuda a aprofundar, não apenas na quantidade de palestras.",
            example:
              "Uma programação relevante ajuda o profissional a analisar melhor situações que não cabem em respostas genéricas.",
          },
          {
            step: "Bloco 2",
            role: "Nutrição Estética",
            direction:
              "Agrupar os temas centrais autorizados em uma leitura simples, sem revelar grade, horários, títulos integrais ou palestrantes.",
            example:
              "Metabolismo, GLP-1, cirurgia plástica, lipedema, saúde da mulher, composição corporal e performance aparecem como territórios de aprofundamento da sala.",
          },
          {
            step: "Bloco 3",
            role: "SONAFE",
            direction:
              "Apresentar os eixos centrais da Fisioterapia Esportiva sem transformar os temas em protocolo clínico.",
            example:
              "Avaliação, prevenção, controle de carga, diferentes populações esportivas, concussão e retorno ao esporte ampliam as perguntas da prática profissional.",
          },
          {
            step: "Bloco 4",
            role: "Continuidade da jornada",
            direction:
              "Explicar que esta é uma prévia temática e convidar a acompanhar as próximas confirmações. Informar que quem já está cadastrado não precisa se cadastrar novamente.",
            example:
              "Esta é apenas uma visão dos temas centrais. Acompanhe as próximas divulgações; se você já está na lista, não precisa preencher o formulário outra vez.",
          },
        ],
        cta: "Acompanhar as próximas programações",
        destinationLabel: "Landing page de novidades",
        destinationUrl: newsUrl,
        exclusion:
          "Excluir apenas descadastrados, inválidos e contatos sem base legal. Quem já está na lista pode receber o mesmo e-mail porque a mensagem entrega conteúdo, não apenas um pedido de cadastro.",
      },
    ],
    routing: [
      {
        condition: "Contato engajado ou participante anterior",
        action: "Enviar a mesma campanha, sem variações de criação.",
        reason:
          "O conteúdo tem função de aquecimento e pode ser consumido independentemente do cadastro anterior.",
      },
      {
        condition: "Contato já cadastrado na Landing Page de Novidades",
        action:
          "Manter no envio e informar, junto ao fechamento, que não precisa preencher o formulário novamente.",
        reason:
          "O valor está na prévia temática; o clique não é necessário para que o e-mail cumpra sua função.",
      },
      {
        condition: "Contato inválido, descadastrado ou sem base legal",
        action: "Não enviar.",
        reason: "A regra de consentimento e supressão continua obrigatória.",
      },
    ],
    productionChecks: [
      "Produzir uma única versão do e-mail.",
      "Não apresentar Nutrição Estética e SONAFE como alternativas concorrentes.",
      "Usar somente temas centrais autorizados; preservar grade, horários, títulos integrais e palestrantes.",
      "Manter um único botão para a Landing Page de Novidades.",
      "Avisar no fechamento que quem já está cadastrado não precisa preencher novamente.",
    ],
    fallback:
      "Se não houver segmentação por interesse, usar a mesma mensagem apenas para a parcela engajada da base. Não criar versões extras.",
    limits:
      "O e-mail não anuncia vendas nem entrega a programação completa. Também não transforma temas técnicos em protocolo ou promessa clínica.",
  },

  "email-base-48h": {
    label: "Briefing detalhado · envio de 21/09",
    decision:
      "Manter a pauta publicada: três decisões que exigem critério na Nutrição Esportiva.",
    rationale:
      "O e-mail avança o storytelling ao sair da apresentação geral das salas e demonstrar o tipo de raciocínio profissional discutido no Conference. A mensagem entrega os três contrastes no próprio corpo e usa a masterclass de Andreia Naves como aprofundamento disponível, sem criar versões diferentes por estágio de cadastro.",
    versions: [
      {
        id: "tres-decisoes-nutricao-esportiva",
        label: "Versão única · três decisões",
        audience:
          "Quem abriu ou clicou nos e-mails de 15 ou 18/09 e profissionais com interesse em Nutrição Esportiva. Usar a mesma criação para toda a audiência selecionada.",
        objective:
          "Demonstrar profundidade por três tensões: evidência versus moda, individualização versus receita pronta e desempenho imediato versus saúde sustentável.",
        subjectDirection:
          "Usar uma chamada objetiva. Exemplos: ‘Três decisões que exigem critério na Nutrição Esportiva’ ou ‘Quando a novidade não deve virar conduta automática’. Não usar dose, produto ou promessa de performance no assunto.",
        steps: [
          {
            step: "Bloco 1",
            role: "Evidência versus moda",
            direction:
              "Mostrar que novidade e popularidade não substituem evidência, contexto e objetivo do atleta.",
            example:
              "Antes de adotar uma tendência, o profissional precisa perguntar o que a sustenta, para quem ela se aplica e qual problema pretende resolver.",
          },
          {
            step: "Bloco 2",
            role: "Individualização versus receita pronta",
            direction:
              "Explicar que modalidade, duração, rotina, tolerância e histórico mudam a decisão nutricional.",
            example:
              "A mesma estratégia pode produzir respostas diferentes porque atletas, demandas e contextos não são iguais.",
          },
          {
            step: "Bloco 3",
            role: "Desempenho versus saúde",
            direction:
              "Apresentar a necessidade de observar o custo clínico de uma decisão orientada somente pelo resultado imediato.",
            example:
              "Uma estratégia não deve ser avaliada apenas pelo resultado de curto prazo, mas também pelos sinais de recuperação, disponibilidade energética e saúde.",
          },
          {
            step: "Bloco 4",
            role: "Aprofundamento disponível",
            direction:
              "Apresentar a masterclass de Andreia Naves como aprofundamento do primeiro eixo, deixando claro que ela não representa sozinha os três temas do e-mail.",
            example:
              "Na masterclass de Andreia Naves, o eixo evidência versus argumento de marketing é aprofundado a partir da suplementação de carboidratos.",
          },
        ],
        cta: "Aprofundar com a masterclass de Andreia Naves",
        destinationLabel: "Landing page das masterclasses",
        destinationUrl: masterclassesUrl,
        exclusion:
          "Não criar uma versão separada para quem já liberou as aulas. O e-mail continua útil como conteúdo; quem já tem acesso pode retomar a aula pelos links recebidos anteriormente.",
      },
    ],
    routing: [
      {
        condition: "Interesse ou engajamento em Nutrição Esportiva",
        action: "Enviar a versão única.",
        reason: "A pauta é específica e dá continuidade ao aquecimento da sala.",
      },
      {
        condition: "Já liberou as masterclasses",
        action:
          "Manter no envio; não criar outra peça. O conteúdo é autossuficiente e o contato pode retomar a aula pelo acesso anterior.",
        reason: "Evita duplicação operacional sem retirar conteúdo de quem já converteu.",
      },
      {
        condition: "Sem sinal de interesse em Nutrição Esportiva",
        action: "Não priorizar neste disparo.",
        reason: "O assunto deve chegar a uma audiência aderente.",
      },
    ],
    productionChecks: [
      "Produzir uma única versão do e-mail.",
      "Manter os três contrastes no mesmo encadeamento narrativo.",
      "Usar as transcrições de Andreia Naves, Bruno Zylber e Daniel Coimbra como sustentação editorial.",
      "Deixar claro que a masterclass de Andreia aprofunda o primeiro eixo, não os três.",
      "Não incluir doses, protocolos ou promessas de performance.",
    ],
    fallback:
      "Se a masterclass não puder ser usada como destino, manter o mesmo conteúdo e direcionar para a Landing Page de Novidades. Não alterar o tema do e-mail.",
    limits:
      "O e-mail não prescreve conduta, não anuncia a programação de 2027 e não cria urgência comercial sem data de abertura confirmada.",
  },

  "email-base-vespera": {
    label: "Briefing detalhado · envio de 22/09",
    decision:
      "Manter a pauta publicada: a equipe multidisciplinar que sustenta decisões de preparação no Bodybuilding.",
    rationale:
      "A mensagem usa um registro do Arnold Conference 2026 para entregar uma reflexão que continua relevante. A Landing Page de Novidades é o CTA principal e conecta o assunto ao que vem pela frente em 2027. O Reel aparece como referência secundária, já contextualizada como acervo de 2026, sem criar outra versão do e-mail.",
    versions: [
      {
        id: "equipe-bodybuilding",
        label: "Versão única · equipe multidisciplinar",
        audience:
          "Leads com interesse em Bodybuilding e públicos de performance. A mesma peça serve para cadastrados e não cadastrados.",
        objective:
          "Mostrar que a preparação de alto rendimento não se resume ao atleta e ao treinador e pode envolver diferentes especialidades.",
        subjectDirection:
          "Usar uma pergunta concreta. Exemplos: ‘Quem trabalha por trás de uma preparação de alto rendimento?’ ou ‘O físico de palco não mostra toda a equipe’. Não prometer títulos, saúde ou performance.",
        steps: [
          {
            step: "Bloco 1",
            role: "O que o público vê",
            direction:
              "Abrir com o contraste entre o resultado visível no palco e as decisões que acontecem fora dele.",
            example:
              "No palco aparece o atleta. A preparação, porém, pode envolver uma rede de profissionais e decisões que o público não vê.",
          },
          {
            step: "Bloco 2",
            role: "O que o acervo de 2026 mostrou",
            direction:
              "Identificar explicitamente que o Reel foi publicado em 2 de março de 2026 e apresenta a experiência da própria equipe de Ricardo, não uma novidade nem um modelo obrigatório.",
            example:
              "Em um registro do Arnold Conference 2026, Ricardo relata a presença de medicina, Educação Física, nutrição, LPF e psicologia na estrutura de trabalho com atletas.",
          },
          {
            step: "Bloco 3",
            role: "Integração com limites",
            direction:
              "Explicar que reunir especialidades não basta: integração exige comunicação, definição de papéis e respeito aos limites profissionais.",
            example:
              "O valor da equipe não está apenas na quantidade de especialistas, mas em como as decisões são coordenadas.",
          },
          {
            step: "Bloco 4",
            role: "Ponte entre o acervo e 2027",
            direction:
              "Fechar mostrando que discussões como essa compõem o repertório já construído pelo Conference e convidar a acompanhar o que vem pela frente na sala Bodybuilding. O Reel pode ser oferecido, depois do fechamento, como referência secundária.",
            example:
              "Em 2026, Ricardo Pannain mostrou como a preparação de alto rendimento passou a envolver profissionais de diferentes especialidades. O registro pertence à edição anterior, mas a pergunta permanece atual: como integrar conhecimento, papéis e decisões sem reduzir a preparação ao que aparece no palco? Esse é o tipo de discussão que faz parte do repertório do Arnold Conference. Acompanhe as próximas novidades da sala Bodybuilding em 2027.",
          },
        ],
        cta: "Acompanhar as novidades de Bodybuilding",
        destinationLabel: "Landing page de novidades",
        destinationUrl: newsUrl,
        secondaryAction: {
          label: "Assistir ao registro de 2026 com Ricardo Pannain",
          destinationLabel: "Reel do acervo Arnold Conference 2026",
          destinationUrl: bodybuildingReelUrl,
          context:
            "Referência secundária. O Reel foi publicado em 02/03/2026 e sua legenda contém a data e o CTA comercial daquela edição; não reutilizar esse fechamento como mensagem de 2027.",
        },
        exclusion:
          "Excluir apenas contatos sem consentimento ou sem qualquer afinidade com Bodybuilding e performance. Não criar variação por status de cadastro.",
      },
    ],
    routing: [
      {
        condition: "Interesse em Bodybuilding ou engajamento com conteúdos de performance",
        action:
          "Enviar a versão única com a Landing Page de Novidades como destino principal e o Reel como referência secundária.",
        reason:
          "O e-mail conecta o repertório de 2026 à continuidade de Bodybuilding em 2027.",
      },
      {
        condition: "Já está cadastrado na lista de novidades",
        action: "Manter no envio, sem trocar CTA ou criação.",
        reason: "A pessoa recebe aprofundamento, não um novo pedido de cadastro.",
      },
      {
        condition: "Sem afinidade com Bodybuilding ou performance",
        action: "Não priorizar neste disparo.",
        reason: "A pauta é específica.",
      },
    ],
    productionChecks: [
      "Produzir uma única versão.",
      "Identificar o Reel DVZDZWEFPP3 como acervo do Arnold Conference 2026, publicado em 02/03/2026.",
      "Usar a Landing Page de Novidades como CTA principal e o Reel como referência secundária.",
      "Não reproduzir a data de 26/04 nem o CTA de inscrição presentes na legenda antiga.",
      "Identificar o conteúdo como relato de Ricardo Pannain, não como confirmação de 2027.",
      "Revisar a nomenclatura das especialidades.",
      "Não criar relação causal entre equipe, saúde, performance ou títulos.",
    ],
    fallback:
      "Se o Reel não puder ser usado como referência secundária, manter o mesmo e-mail e o CTA principal para a Landing Page de Novidades. Não criar outra pauta.",
    limits:
      "O e-mail não trata a fala de 2026 como novidade ou tendência comprovada, não confirma Ricardo Pannain nem esse tema em 2027 e não apresenta protocolo, composição obrigatória de equipe ou promessa de resultado.",
  },

  "email-base-vendas-abertas": {
    label: "Briefing detalhado · envio de 23/09",
    decision:
      "Manter a pauta publicada: mostrar como diferentes populações e modalidades ampliam as perguntas da Fisioterapia Esportiva.",
    rationale:
      "O e-mail usa temas centrais autorizados da programação definitiva da SONAFE para demonstrar especificidade profissional. A mensagem entrega a reflexão no próprio corpo e mantém a Landing Page de Novidades como continuidade. Não há necessidade de criar versões diferentes por cadastro.",
    versions: [
      {
        id: "diversidade-sonafe",
        label: "Versão única · diferentes contextos esportivos",
        audience:
          "Leads com interesse em SONAFE e profissionais ligados à Fisioterapia Esportiva. A mesma criação atende cadastrados e não cadastrados.",
        objective:
          "Mostrar como população, modalidade e demanda mudam as perguntas da Fisioterapia Esportiva.",
        subjectDirection:
          "Usar uma pergunta clara. Exemplos: ‘Existe uma única resposta para todo tipo de atleta?’ ou ‘O contexto muda a decisão na Fisioterapia Esportiva’. Evitar chamada clínica ou promessa de prevenção.",
        steps: [
          {
            step: "Bloco 1",
            role: "Tensão central",
            direction:
              "Abrir dizendo que não existe um único tipo de atleta nem uma única pergunta profissional para todos os contextos.",
            example:
              "Idade, modalidade, sexo, histórico e demanda esportiva mudam o que precisa ser observado.",
          },
          {
            step: "Bloco 2",
            role: "Populações diferentes",
            direction:
              "Usar mulher no futebol, crianças atletas e esporte paralímpico como exemplos de contextos confirmados, sem anunciar sessões ou palestrantes.",
            example:
              "A atleta de futebol, a criança que pratica esporte e o atleta paralímpico apresentam demandas que não devem ser tratadas como equivalentes.",
          },
          {
            step: "Bloco 3",
            role: "Demandas diferentes",
            direction:
              "Relacionar avaliação funcional, concussão e retorno ao esporte à necessidade de leitura contextual, sem formular protocolo.",
            example:
              "A pergunta profissional muda conforme o risco, a modalidade, a fase de recuperação e o objetivo de retorno.",
          },
          {
            step: "Bloco 4",
            role: "Continuidade da jornada",
            direction:
              "Apresentar os exemplos como prévia temática e convidar a acompanhar as próximas novidades da SONAFE. Informar que quem já está na lista não precisa se cadastrar novamente.",
            example:
              "Acompanhe as próximas divulgações da SONAFE; se você já está cadastrado, não precisa preencher o formulário outra vez.",
          },
        ],
        cta: "Acompanhar as novidades da SONAFE",
        destinationLabel: "Landing page de novidades",
        destinationUrl: newsUrl,
        exclusion:
          "Excluir apenas contatos sem consentimento ou sem afinidade com Fisioterapia Esportiva. Quem já está cadastrado pode receber o conteúdo sem obrigação de clicar.",
      },
    ],
    routing: [
      {
        condition: "Interesse em SONAFE ou Fisioterapia Esportiva",
        action: "Enviar a versão única.",
        reason: "O conteúdo é aderente e mantém a sala aquecida.",
      },
      {
        condition: "Já está cadastrado na Landing Page de Novidades",
        action:
          "Manter no envio e sinalizar que não precisa se cadastrar outra vez.",
        reason: "O e-mail entrega conteúdo útil antes do CTA.",
      },
      {
        condition: "Sem afinidade com Fisioterapia Esportiva",
        action: "Não priorizar neste disparo.",
        reason: "O assunto é específico.",
      },
    ],
    productionChecks: [
      "Produzir uma única versão do e-mail.",
      "Usar somente os contextos temáticos autorizados da SONAFE 2027.",
      "Preservar títulos integrais, horários, sequência e palestrantes para a divulgação completa da programação.",
      "Não transformar os exemplos em protocolo, diagnóstico ou recomendação clínica.",
      "Manter um único botão para a Landing Page de Novidades.",
    ],
    fallback:
      "Se a revisão técnica não for concluída, usar uma versão mais geral sobre como modalidade, população e demanda mudam as perguntas profissionais, sem listar exemplos clínicos.",
    limits:
      "O e-mail não apresenta programação completa, protocolo, promessa de prevenção de lesões, diagnóstico ou resultado clínico.",
  },

  "email-base-recuperar-inscricao": {
    label: "Briefing detalhado · envio de 24–25/09",
    decision:
      "Manter a pauta publicada: quatro critérios para validar a escolha de congresso.",
    rationale:
      "O último envio da sequência ajuda a audiência a organizar a própria decisão antes da abertura do carrinho. O conteúdo funciona mesmo para quem já informou interesse, porque apresenta um checklist de reflexão. A Landing Page de Novidades permanece como próximo passo opcional para registrar ou atualizar a área de interesse, sem exigir versões diferentes.",
    versions: [
      {
        id: "quatro-criterios",
        label: "Versão única · checklist de escolha",
        audience:
          "Base engajada que acompanha o aquecimento. Priorizar quem ainda não declarou área de interesse, mas usar a mesma criação para todos os destinatários selecionados.",
        objective:
          "Oferecer quatro critérios para validar a escolha de congresso sem repetir o comparativo de perfis.",
        subjectDirection:
          "Usar uma pergunta prática. Exemplos: ‘Antes de escolher seu congresso, responda a estas quatro perguntas’ ou ‘Quatro critérios para avaliar qual conteúdo faz sentido para você’. Não usar formato versus.",
        steps: [
          {
            step: "Bloco 1",
            role: "Momento profissional",
            direction:
              "Perguntar se a pessoa quer fortalecer a atuação atual ou preparar um próximo passo na carreira.",
            example:
              "Você busca resolver melhor um desafio que já enfrenta ou desenvolver uma nova frente profissional?",
          },
          {
            step: "Bloco 2",
            role: "Problema prioritário",
            direction:
              "Pedir que a pessoa nomeie o problema concreto sobre o qual precisa de mais repertório.",
            example:
              "Qual decisão, situação ou dificuldade profissional você precisa compreender melhor agora?",
          },
          {
            step: "Bloco 3",
            role: "Profundidade e aplicação",
            direction:
              "Orientar a observar se os temas correspondem ao seu nível de experiência e o que espera analisar, decidir ou estruturar melhor depois do evento.",
            example:
              "O conteúdo vai além de uma introdução e ajuda você a aplicar o aprendizado no seu contexto?",
          },
          {
            step: "Bloco 4",
            role: "Próximo passo",
            direction:
              "Explicar que o checklist ajuda a filtrar interesses. Convidar a registrar ou atualizar a área de interesse, sem obrigar quem já fez isso a preencher novamente.",
            example:
              "Use suas respostas para acompanhar a sala mais aderente ao seu momento. Se sua preferência já foi informada, não é necessário refazer o cadastro.",
          },
        ],
        cta: "Registrar ou atualizar minha área de interesse",
        destinationLabel: "Landing page de novidades",
        destinationUrl: newsUrl,
        exclusion:
          "Excluir descadastrados, inválidos e contatos sem base legal. Não criar uma segunda peça para quem já informou interesse; o checklist continua útil para esse público.",
      },
    ],
    routing: [
      {
        condition: "Contato engajado no aquecimento",
        action: "Enviar a mesma versão do checklist.",
        reason: "O conteúdo ajuda a organizar a decisão antes da abertura do carrinho.",
      },
      {
        condition: "Já informou uma área de interesse",
        action:
          "Manter no envio e dizer que não precisa refazer o cadastro; o CTA pode ser usado apenas se quiser atualizar a preferência.",
        reason: "O valor principal está no checklist, não no formulário.",
      },
      {
        condition: "Contato sem engajamento recente",
        action: "Não priorizar neste disparo.",
        reason: "A mensagem exige atenção e funciona melhor com audiência aquecida.",
      },
    ],
    productionChecks: [
      "Produzir uma única versão.",
      "Manter os quatro critérios da pauta publicada.",
      "Não transformar o e-mail em comparação entre congressos.",
      "Usar um único botão para registrar ou atualizar a preferência.",
      "Informar que quem já declarou interesse não precisa preencher novamente.",
      "Não citar preço, lote, data de abertura ou compatibilidade de horários.",
    ],
    fallback:
      "Se a atualização de preferência não funcionar tecnicamente, manter o checklist no e-mail e trocar somente o fechamento por ‘Acompanhe as próximas novidades’. Não criar outra campanha.",
    limits:
      "O envio não recomenda um congresso, não promete compatibilidade entre salas e não antecipa a abertura de vendas.",
  },
  ...octoberEmailBriefs,
};

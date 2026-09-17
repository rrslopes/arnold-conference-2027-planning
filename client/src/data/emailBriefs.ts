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

export const emailCampaignBriefs: Record<string, EmailCampaignBrief> = {
  "email-base-comparativo": {
    label: "Briefing detalhado · envio de 18/09",
    decision:
      "Manter um único e-mail de aquisição para públicos aderentes às masterclasses, com uma promessa editorial e um único destino.",
    rationale:
      "O e-mail de 18/09 não deve repetir a Landing Page de Novidades para quem provavelmente já passou por ela nem antecipar a programação de 2027, que está disponível apenas para planejamento interno. O próximo passo útil é a isca já pública: três masterclasses gravadas em 2026. O disparo deve alcançar somente contatos aderentes às aulas e excluir quem já fez esse cadastro. SONAFE sai deste envio porque ainda não possui uma isca própria e a programação não está autorizada para divulgação.",
    versions: [
      {
        id: "masterclasses",
        label: "Versão única · aprofundamento pelas masterclasses",
        audience:
          "Contatos engajados, participantes anteriores e leads com afinidade por Nutrição Estética, Nutrição Esportiva ou Gestão de Academias que ainda não converteram na LP das masterclasses. Excluir quem já liberou as aulas.",
        objective:
          "Transformar interesse pelo Arnold Conference em consumo de conteúdo, apresentando as três aulas de 2026 como uma amostra real da profundidade do evento — sem antecipar informações ainda internas de 2027.",
        subjectDirection:
          "Prometer acesso a conteúdo aplicável e deixar claro que são aulas da edição de 2026. Exemplos de direção: ‘Três aulas para aprofundar decisões em nutrição e gestão’ ou ‘O conteúdo do Arnold Conference que você já pode acessar’. A copy final deve passar por aprovação.",
        steps: [
          {
            step: "Bloco 1",
            role: "Tensão compartilhada",
            direction:
              "Abrir com uma provocação transversal às três áreas: decisões profissionais melhores exigem profundidade, contexto e capacidade de questionar respostas prontas.",
            example:
              "Entre tendências rápidas e decisões que afetam pessoas e negócios, conteúdo aprofundado ajuda a separar repertório útil de resposta automática.",
          },
          {
            step: "Bloco 2",
            role: "O que está disponível agora",
            direction:
              "Apresentar objetivamente as três aulas liberadas, identificando palestrante, título oficial e área. Não mencionar grade, sessões, temas confirmados ou palestrantes de 2027.",
            example:
              "Ana Paula Pujol — Estratégias Nutricionais para Emagrecimento; Andreia Naves — Update na Suplementação de Carboidratos; Roberto Tranjan — Academias em Alta Potência: de corpo, mente e alma.",
          },
          {
            step: "Bloco 3",
            role: "Como escolher por onde começar",
            direction:
              "Orientar a escolha pela necessidade profissional sem comparar congressos: emagrecimento e reganho; carboidratos e performance; direção, alunos e equipe na academia.",
            example:
              "Você não precisa assistir em uma ordem específica: comece pela aula mais próxima do desafio que enfrenta hoje.",
          },
          {
            step: "Bloco 4",
            role: "Próximo passo",
            direction:
              "Explicar que um único cadastro libera as três aulas de 2026. Usar um botão principal para a LP das masterclasses, sem passar antes pela LP de Novidades.",
            example:
              "Libere gratuitamente as três masterclasses e escolha a primeira aula de acordo com o seu desafio profissional.",
          },
        ],
        cta: "Liberar as 3 masterclasses gratuitas",
        destinationLabel: "Landing page das masterclasses",
        destinationUrl: "https://masterclassconference.savagetgroup.com.br/",
        exclusion:
          "Não enviar esta versão a quem já converteu na LP das masterclasses; esse público deve continuar na sequência pós-cadastro, sem receber novamente um pedido para preencher o mesmo formulário.",
      },
    ],
    routing: [
      {
        condition:
          "Afinidade com Nutrição Estética, Nutrição Esportiva ou Gestão de Academias + ainda não converteu nas masterclasses",
        action: "Enviar o e-mail de 18/09 e direcionar para a LP das masterclasses.",
        reason:
          "Há uma aula real e aderente a cada uma dessas três frentes, todas identificadas como acervo de 2026.",
      },
      {
        condition: "Já converteu na LP das masterclasses",
        action: "Suprimir do disparo de aquisição e manter na sequência pós-masterclass.",
        reason:
          "Pedir um novo cadastro para a mesma isca cria atrito e duplica a mensagem.",
      },
      {
        condition:
          "Interesse exclusivo em SONAFE, Bodybuilding ou Certificação Internacional em Personal Training – WTTC",
        action:
          "Não enviar este e-mail apenas para preencher a régua; manter o contato no relacionamento compatível com a sua área.",
        reason:
          "As três masterclasses não representam essas áreas e a programação interna de 2027 não pode ser usada como substituto editorial.",
      },
    ],
    productionChecks: [
      "Montar uma lista com afinidade nas três áreas representadas pelas aulas e remover quem já converteu na LP das masterclasses.",
      "Usar um único botão principal para a LP das masterclasses e repetir o mesmo destino somente se necessário no fechamento.",
      "Adicionar UTM específica do disparo de 18/09 para separar seu desempenho dos e-mails anteriores.",
      "Conferir títulos, palestrantes e descrições nas próprias masterclasses de 2026 antes da aprovação final.",
      "Bloquear qualquer menção a programação, sessões, palestrantes confirmados ou temas de 2027 até autorização expressa de publicação.",
    ],
    fallback:
      "Se a segmentação por interesse não estiver disponível, limitar o envio a contatos que abriram ou clicaram nos e-mails das masterclasses e ainda não converteram. Não enviar toda a base, não redirecionar novamente para a LP de Novidades e não completar o e-mail com informações internas de 2027.",
    limits:
      "O e-mail não anuncia abertura, preço, lote ou data comercial. As três masterclasses são acervo de 2026 e não antecipam nem representam a programação de 2027. A programação recebida permanece como inteligência estratégica interna até o cliente informar que foi publicada.",
  },
};

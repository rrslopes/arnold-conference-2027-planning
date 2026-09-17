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
      "Produzir duas versões segmentadas, cada uma com um público, uma promessa editorial e um único destino.",
    rationale:
      "A Landing Page de Novidades continua sendo útil para quem ainda não se cadastrou, mas é redundante para quem já está na lista. As masterclasses são o próximo passo mais valioso somente para públicos compatíveis com as três aulas disponíveis. Como Nutrição Estética e SONAFE atendem profissões e necessidades diferentes, o disparo não deve tratá-las como escolhas concorrentes nem reuni-las em um comparativo.",
    versions: [
      {
        id: "nutricao-estetica",
        label: "Versão A · Nutrição Estética",
        audience:
          "Contatos com interesse identificado em Nutrição Estética que ainda não converteram na LP das masterclasses. Priorizar engajados recentes e participantes anteriores; excluir quem já liberou as aulas.",
        objective:
          "Usar a programação de 2027 para demonstrar amplitude e conectar essa expectativa a uma amostra real de profundidade disponível na aula de Ana Paula Pujol, gravada em 2026.",
        subjectDirection:
          "Dar destaque ao aprofundamento já visível em Nutrição Estética, sem anunciar venda. Exemplo de direção: ‘O que a programação de Nutrição Estética 2027 já permite antecipar’. A copy final deve passar por aprovação.",
        steps: [
          {
            step: "Bloco 1",
            role: "Reconhecimento do desafio",
            direction:
              "Abrir com uma tensão profissional concreta, e não com uma saudação institucional.",
            example:
              "Atender demandas estéticas exige diferenciar contextos metabólicos, composição corporal, saúde da pele e saúde da mulher antes de repetir uma conduta genérica.",
          },
          {
            step: "Bloco 2",
            role: "O que 2027 já revela",
            direction:
              "Organizar os territórios confirmados em grupos compreensíveis, sem despejar a grade completa no e-mail.",
            example:
              "Metabolismo e emagrecimento; composição corporal e hipertrofia; pele e fotoproteção; lipedema, saúde da mulher e diferentes contextos clínicos.",
          },
          {
            step: "Bloco 3",
            role: "Prova de profundidade disponível",
            direction:
              "Apresentar a aula de Ana Paula Pujol como amostra real da edição de 2026, deixando clara a diferença entre acervo e programação de 2027.",
            example:
              "A masterclass ‘Estratégias Nutricionais para Emagrecimento’ aprofunda platô e reganho de peso e mostra por que a análise pode precisar ir além da restrição calórica.",
          },
          {
            step: "Bloco 4",
            role: "Próximo passo",
            direction:
              "Explicar que um único cadastro libera a seleção completa com três aulas de 2026. O botão deve levar diretamente à isca, sem passar antes pela LP de novidades.",
            example:
              "Quem ainda não acessou pode liberar gratuitamente as três masterclasses e começar pela aula de Nutrição Estética.",
          },
        ],
        cta: "Liberar as 3 masterclasses gratuitas",
        destinationLabel: "Landing page das masterclasses",
        destinationUrl: "https://masterclassconference.savagetgroup.com.br/",
        exclusion:
          "Não enviar esta versão a quem já converteu na LP das masterclasses; esse público deve continuar na sequência pós-cadastro, sem receber novamente um pedido para preencher o mesmo formulário.",
      },
      {
        id: "sonafe",
        label: "Versão B · SONAFE",
        audience:
          "Fisioterapeutas e contatos com interesse identificado no SONAFE que ainda não estão cadastrados na LP de Novidades. Excluir quem já consta nessa lista.",
        objective:
          "Demonstrar a amplitude da programação provisória do SONAFE 2027 e convidar o fisioterapeuta a entrar na lista de novidades, porque ainda não existe uma isca específica e auditada para essa sala.",
        subjectDirection:
          "Destacar atualização profissional e os contextos confirmados, sem prometer protocolo ou venda. Exemplo de direção: ‘Prevenção, avaliação e retorno ao esporte: o que já aparece no SONAFE 2027’. A copy final deve passar por revisão técnica.",
        steps: [
          {
            step: "Bloco 1",
            role: "Contexto profissional",
            direction:
              "Abrir com a variedade de decisões presentes na fisioterapia esportiva, sem comparar o SONAFE com outra sala.",
            example:
              "Prevenção, avaliação, controle de carga, reabilitação e retorno ao esporte mudam conforme população, modalidade e demanda funcional.",
          },
          {
            step: "Bloco 2",
            role: "O que 2027 já revela",
            direction:
              "Selecionar grupos de temas confirmados; não transformar títulos de palestras em recomendações clínicas.",
            example:
              "Recursos terapêuticos, ativação muscular e carga; mulher e crianças no futebol; esporte paralímpico; concussão e Return to Play.",
          },
          {
            step: "Bloco 3",
            role: "Transparência sobre a oferta",
            direction:
              "Explicar que novas confirmações serão comunicadas progressivamente. Não associar ao SONAFE as masterclasses atuais, porque nenhuma das três aulas representa essa sala.",
            example:
              "A programação seguirá sendo atualizada conforme temas, profissionais e informações oficiais forem confirmados.",
          },
          {
            step: "Bloco 4",
            role: "Próximo passo",
            direction:
              "Convidar somente quem ainda não está na lista a cadastrar-se para acompanhar as atualizações e o aviso de abertura.",
            example:
              "Cadastre-se para receber as próximas confirmações do SONAFE e as informações oficiais sobre a abertura das inscrições.",
          },
        ],
        cta: "Quero acompanhar as novidades do SONAFE",
        destinationLabel: "Landing page geral de novidades",
        destinationUrl: "https://oferta.savagetgroup.com.br/conference-2027",
        exclusion:
          "Não reenviar esta versão a quem já se cadastrou na LP de Novidades. Até existir uma isca própria ou uma página institucional revisada, esse público deve receber relacionamento editorial sem novo pedido de cadastro.",
      },
    ],
    routing: [
      {
        condition:
          "Interesse em Nutrição Estética + ainda não converteu nas masterclasses",
        action: "Enviar a Versão A e direcionar para a LP das masterclasses.",
        reason:
          "A aula de Ana Paula Pujol é uma amostra real e aderente a esse público.",
      },
      {
        condition:
          "Interesse em SONAFE + ainda não se cadastrou na LP de Novidades",
        action: "Enviar a Versão B e direcionar para a LP de Novidades.",
        reason:
          "Ainda não existe isca própria do SONAFE; o cadastro é o próximo passo disponível.",
      },
      {
        condition: "Já converteu na LP das masterclasses",
        action: "Suprimir da Versão A e manter na sequência pós-masterclass.",
        reason:
          "Pedir um novo cadastro para a mesma isca cria atrito e duplica a mensagem.",
      },
      {
        condition:
          "Já está na LP de Novidades ou não possui interesse identificável nessas duas salas",
        action:
          "Não reenviar para o mesmo formulário; retirar deste disparo de aquisição.",
        reason:
          "Sem uma nova ação útil e aderente, o e-mail acrescentaria pressão, mas não avançaria a jornada.",
      },
    ],
    productionChecks: [
      "Criar duas listas ou ramificações no RD Station e aplicar as exclusões antes do disparo.",
      "Usar um único botão principal em cada versão e repetir o mesmo destino somente se necessário no fechamento.",
      "Adicionar UTMs diferentes para Nutrição Estética e SONAFE, sem misturar os resultados das duas versões.",
      "Revisar tecnicamente os agrupamentos de temas e conferir os títulos na programação vigente antes da aprovação final.",
      "Não usar as páginas específicas dos congressos como destino enquanto mantiverem preços, lotes, inscrições ou programação antiga sem revisão.",
    ],
    fallback:
      "Se a operação não conseguir produzir duas versões, escolher apenas uma das duas audiências como prioridade e usar um único destino coerente. Não combinar Nutrição Estética e SONAFE em um e-mail comparativo e não enviar toda a base novamente para a mesma LP.",
    limits:
      "O e-mail não anuncia abertura, preço, lote ou data comercial. A masterclass é uma amostra do acervo de 2026, não a programação de 2027. Os títulos do SONAFE organizam territórios de atualização e não podem virar protocolo ou orientação clínica.",
  },
};

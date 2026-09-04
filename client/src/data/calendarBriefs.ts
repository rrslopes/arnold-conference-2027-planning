export type ProductionBrief = {
  format: string;
  purpose: string;
  units: Array<{
    unit: string;
    role: string;
    content: string;
    source?: string;
  }>;
  note: string;
};

export const operationalBriefs: Record<string, ProductionBrief> = {
  "0901": {
    format: "Peça já programada pelo cliente",
    purpose: "Reativar o público de Educação Física com o território de desenvolvimento profissional do WTTC.",
    units: [
      { unit: "Bloco 1", role: "Pauta aprovada", content: "Recuperar o roteiro ou arquivo já aprovado pelo cliente; não criar uma abordagem paralela.", source: "Briefing interno do cliente" },
      { unit: "Bloco 2", role: "Contexto", content: "Identificar Cris Parente e o recorte de desenvolvimento profissional efetivamente aprovado.", source: "Material aprovado de Cris Parente" },
      { unit: "Bloco 3", role: "Desafio profissional", content: "Apresentar somente o desafio definido no material-base, sem acrescentar promessa curricular ao WTTC.", source: "Pauta aprovada" },
      { unit: "Bloco 4", role: "Fechamento", content: "Convidar à interação sobre carreira ou desenvolvimento profissional.", source: "CTA do calendário" },
    ],
    note: "Se a equipe externa não receber a pauta aprovada, o item deve voltar ao cliente antes da produção. Não preencher a lacuna com conteúdo inventado.",
  },
  "0903": {
    format: "Carrossel principal de 8 cards",
    purpose: "Apresentar os seis congressos por desafios profissionais concretos, sem virar uma lista institucional.",
    units: [
      { unit: "Card 1", role: "Abertura", content: "Explicar que o Arnold Conference reúne seis caminhos para desafios profissionais diferentes." },
      { unit: "Card 2", role: "Gestão de Academias", content: "Desafio: fortalecer gestão, retenção e crescimento sem ampliar a sobrecarga do dono.", source: "Proposta de valor de Gestão" },
      { unit: "Card 3", role: "WTTC", content: "Desafio: transformar conhecimento técnico em certificação com validade internacional, método, entrega, posicionamento e possibilidade de atuação fora do Brasil.", source: "Proposta de valor do WTTC" },
      { unit: "Card 4", role: "SONAFE", content: "Desafio: conectar prevenção, avaliação, reabilitação, equipe e retorno seguro ao esporte.", source: "Proposta de valor SONAFE" },
      { unit: "Card 5", role: "Nutrição Estética", content: "Desafio: diferenciar platô, reganho e demandas estéticas antes de repetir condutas genéricas.", source: "Proposta de valor de Nutrição Estética" },
      { unit: "Card 6", role: "Nutrição Esportiva", content: "Desafio: individualizar a estratégia em vez de seguir receita universal ou apelo de produto.", source: "Proposta de valor de Nutrição Esportiva" },
      { unit: "Card 7", role: "Bodybuilding", content: "Desafio: integrar treino, dieta, recuperação, saúde e preparação competitiva.", source: "Proposta de valor de Bodybuilding" },
      { unit: "Card 8", role: "Interação", content: "Pedir que a pessoa identifique qual desafio está mais próximo do seu momento." },
    ],
    note: "Se a entrega for Reel, usar os mesmos oito blocos na mesma ordem. A equipe decide a redação e a solução visual; o conteúdo não muda.",
  },
  "0904": {
    format: "Reel de 3 blocos, com um único corte",
    purpose: "Entregar uma ideia útil de uma masterclass e testar qual território desperta mais interesse.",
    units: [
      { unit: "Bloco 1", role: "Pergunta de contexto", content: "Apresentar a pergunta associada ao corte escolhido: platô, carboidrato ou força da academia.", source: "Uma das três opções de corte" },
      { unit: "Bloco 2", role: "Trecho principal", content: "Usar 25–45 segundos com raciocínio autossuficiente: problema, explicação e conclusão compreensível.", source: "Íntegra da masterclass selecionada" },
      { unit: "Bloco 3", role: "Interação", content: "Convidar a salvar e indicar qual dos três temas o público quer aprofundar." },
    ],
    note: "Escolher apenas uma das três opções. Sem trecho autossuficiente, usar o Reel narrado previsto na alternativa segura.",
  },
  "0906": {
    format: "Reel de 5 blocos curtos",
    purpose: "Antecipar as três aulas e fixar a data de liberação sem depender de falas completas.",
    units: [
      { unit: "Bloco 1", role: "Contexto", content: "Informar que três masterclasses completas serão liberadas em 08/09." },
      { unit: "Bloco 2", role: "Aula 1", content: "Ana Paula Pujol: título oficial + platô, reganho e estratégias além da restrição calórica.", source: "Cena de 4–6 segundos da aula" },
      { unit: "Bloco 3", role: "Aula 2", content: "Andreia Naves: título oficial + ciência, tecnologia e aplicação dos carboidratos.", source: "Cena de 4–6 segundos da aula" },
      { unit: "Bloco 4", role: "Aula 3", content: "Roberto Tranjan: título oficial + liderança, cultura e equilíbrio do negócio.", source: "Cena de 4–6 segundos da aula" },
      { unit: "Bloco 5", role: "Fechamento", content: "Reforçar 08/09 e orientar a acompanhar a liberação; usar LEMBRETE somente se a automação estiver ativa." },
    ],
    note: "Os três trechos entram na mesma peça. Não são alternativas. O áudio pode ser trilha com textos ou narração aprovada; falas incompletas não devem ser montadas como afirmações.",
  },
  "0908": {
    format: "Carrossel de 5 cards; Reel derivado dos mesmos blocos",
    purpose: "Lançar a seleção, explicar o valor das três aulas e levar para a landing page.",
    units: [
      { unit: "Card/Bloco 1", role: "Lançamento", content: "Informar que três masterclasses completas da edição de 2026 estão disponíveis gratuitamente." },
      { unit: "Card/Bloco 2", role: "Nutrição Estética", content: "Título oficial, Ana Paula Pujol e desafio: platô, reganho e abordagem além da restrição calórica." },
      { unit: "Card/Bloco 3", role: "Nutrição Esportiva", content: "Título oficial, Andreia Naves e desafio: planejar carboidratos considerando esforço, produto e tolerância." },
      { unit: "Card/Bloco 4", role: "Gestão", content: "Título oficial, Roberto Tranjan e desafio: equilibrar estrutura, estratégia, liderança e cultura." },
      { unit: "Card/Bloco 5", role: "Acesso", content: "Explicar que o mesmo cadastro libera as três aulas e orientar a comentar AULAS." },
    ],
    note: "Carrossel e Reel usam a mesma arquitetura. Não criar títulos alternativos para as aulas nem prometer conteúdos dos outros três congressos.",
  },
  "0910": {
    format: "Reel de 3 blocos, com um único corte",
    purpose: "Usar a ideia mais demandada na reativação para gerar acesso às aulas completas.",
    units: [
      { unit: "Bloco 1", role: "Problema", content: "Apresentar a pergunta correspondente ao corte escolhido." },
      { unit: "Bloco 2", role: "Explicação", content: "Usar 25–45 segundos da aula, com contexto suficiente e uma conclusão útil." },
      { unit: "Bloco 3", role: "Continuidade", content: "Relacionar o trecho à masterclass completa e orientar a comentar AULAS." },
    ],
    note: "Escolher uma opção com base nas respostas de 04/09. Não combinar falas diferentes no mesmo Reel.",
  },
  "0911": {
    format: "Carrossel de 6 cards",
    purpose: "Organizar as perguntas que vêm antes da escolha de um gel, sem transformar números em prescrição universal.",
    units: [
      { unit: "Card 1", role: "Capa", content: "Delimitar a decisão: o produto só pode ser avaliado depois do contexto do esforço e do atleta." },
      { unit: "Card 2", role: "Demanda", content: "Perguntar modalidade, intensidade, duração e demanda energética do treino ou competição." },
      { unit: "Card 3", role: "Tolerância", content: "Perguntar histórico e tolerância gastrointestinal; não pressupor que o produto funcionará igual para todos." },
      { unit: "Card 4", role: "Momento de uso", content: "Definir se a necessidade está antes, durante ou depois do esforço e qual problema se pretende resolver." },
      { unit: "Card 5", role: "Adaptação", content: "Verificar se o atleta já treinou a estratégia e se ela cabe na rotina real." },
      { unit: "Card 6", role: "Aprofundamento", content: "Relacionar as quatro perguntas à aula de Andreia Naves e orientar a comentar AULAS." },
    ],
    note: "O briefing define o conteúdo de cada card, mas não apresenta dose, produto recomendado ou prescrição.",
  },
  "0913": {
    format: "Reel narrado de 5 blocos",
    purpose: "Contrapor cópia de preparação e construção de estratégia sem ensinar protocolo de Bodybuilding.",
    units: [
      { unit: "Bloco 1", role: "Situação", content: "Apresentar o risco de copiar a preparação de outro atleta sem conhecer contexto, fase ou resposta individual." },
      { unit: "Bloco 2", role: "Treino", content: "Indicar que treino precisa responder ao atleta, ao objetivo, à fase e à evolução observada." },
      { unit: "Bloco 3", role: "Dieta", content: "Indicar que alimentação não pode ser separada da rotina, do objetivo e da resposta individual." },
      { unit: "Bloco 4", role: "Recuperação e saúde", content: "Mostrar que sono, recuperação e acompanhamento integram a preparação; não são detalhes posteriores." },
      { unit: "Bloco 5", role: "Interesse", content: "Convidar quem vive esse desafio a acompanhar Bodybuilding pela palavra BODY." },
    ],
    note: "Usar apenas princípios gerais aprovados. Não citar fármacos, doses, manipulações ou condutas específicas sem fonte e revisão técnica.",
  },
  "0914": {
    format: "Reel documental de 5 blocos",
    purpose: "Transformar a demanda real de 2026 em prova verificável, sem fabricar escassez.",
    units: [
      { unit: "Bloco 1", role: "Contexto", content: "Identificar que a evidência apresentada vem da procura pelo SONAFE em 2026." },
      { unit: "Bloco 2", role: "Prova 1", content: "Exibir mensagem real autorizada equivalente a ‘Ainda tem vaga?’, com dados pessoais ocultados.", source: "Print autorizado" },
      { unit: "Bloco 3", role: "Prova 2", content: "Exibir mensagem real autorizada equivalente a ‘Vai abrir nova turma?’, com dados pessoais ocultados.", source: "Print autorizado" },
      { unit: "Bloco 4", role: "Interpretação", content: "Explicar somente o fato aprovado: houve esgotamento e procura posterior; não projetar demanda de 2027." },
      { unit: "Bloco 5", role: "Continuidade", content: "Orientar a comentar FISIO para acompanhar novidades." },
    ],
    note: "Sem prints autorizados, não produzir a versão documental. Usar a alternativa segura com afirmação geral previamente aprovada.",
  },
  "0915": {
    format: "Carrossel de 8 cards; Reel com os mesmos 8 blocos",
    purpose: "Confirmar data e horário da abertura e ajudar cada perfil a reconhecer seu caminho.",
    units: [
      { unit: "Card/Bloco 1", role: "Data", content: "Informar que as vendas dos seis congressos abrem em 23/09, às 12h." },
      { unit: "Card/Bloco 2", role: "Gestão", content: "Perfil: lidera academia ou negócio e precisa fortalecer operação, cultura e crescimento." },
      { unit: "Card/Bloco 3", role: "WTTC", content: "Perfil: personal que busca certificação com validade internacional, método, carreira e possibilidade de atuação fora do Brasil." },
      { unit: "Card/Bloco 4", role: "SONAFE", content: "Perfil: fisioterapeuta ou equipe que atua com prevenção, avaliação, reabilitação e retorno ao esporte." },
      { unit: "Card/Bloco 5", role: "Nutrição Estética", content: "Perfil: profissional que lida com emagrecimento, composição e demandas estéticas complexas." },
      { unit: "Card/Bloco 6", role: "Nutrição Esportiva", content: "Perfil: profissional que decide sobre alimentação, saúde e desempenho esportivo." },
      { unit: "Card/Bloco 7", role: "Bodybuilding", content: "Perfil: profissional ou atleta que precisa integrar treino, dieta, recuperação e preparação." },
      { unit: "Card/Bloco 8", role: "Lembrete", content: "Repetir 23/09 às 12h e orientar a comentar LEMBRETE." },
    ],
    note: "A abordagem com seis perfis é a recomendação principal. Falas de especialistas só substituem essa peça se forem gravadas e aprovadas a tempo.",
  },
  "0917": {
    format: "Carrossel de 5 cards",
    purpose: "Diferenciar WTTC e Gestão de Academias sem sugerir que um substitui o outro.",
    units: [
      { unit: "Card 1", role: "Questão", content: "Apresentar a dúvida: o desafio está na carreira do personal, na gestão do negócio ou nos dois?" },
      { unit: "Card 2", role: "Prioridade WTTC", content: "Indicar WTTC quando o foco é certificação com validade internacional, método de trabalho, carreira e possibilidade de atuação fora do Brasil." },
      { unit: "Card 3", role: "Prioridade Gestão", content: "Indicar Gestão quando o foco é operação, liderança, cultura, retenção e crescimento da academia." },
      { unit: "Card 4", role: "Cruzamento", content: "Explicar que quem atua nos dois papéis pode ter interesses complementares, sem afirmar compatibilidade de horários." },
      { unit: "Card 5", role: "Próximo passo", content: "Orientar a salvar o comparativo e acompanhar a programação oficial." },
    ],
    note: "A complementaridade é temática. Não recomendar compra combinada ou agenda conjunta antes da programação oficial.",
  },
  "0919": {
    format: "Carrossel de 7 cards",
    purpose: "Mostrar que retorno ao esporte é uma cadeia de decisões coordenadas, não uma etapa isolada.",
    units: [
      { unit: "Card 1", role: "Capa", content: "Delimitar o tema: prevenção e decisões que sustentam um retorno mais seguro ao esporte." },
      { unit: "Card 2", role: "Ponto de partida", content: "Avaliar o atleta e definir o objetivo funcional da reabilitação." },
      { unit: "Card 3", role: "Carga", content: "Compreender as demandas do esporte e a carga que será retomada progressivamente." },
      { unit: "Card 4", role: "Equipe", content: "Alinhar fisioterapia, treinamento e demais profissionais envolvidos nas decisões." },
      { unit: "Card 5", role: "Resposta", content: "Monitorar resposta, recuperação e sinais que pedem ajuste de progressão." },
      { unit: "Card 6", role: "Prevenção e retorno sustentável", content: "Integrar prevenção de recorrências, preparação física, recuperação e saúde mental ao processo de retorno." },
      { unit: "Card 7", role: "Aprofundamento", content: "Apresentar SONAFE como território de atualização e orientar a comentar FISIO." },
    ],
    note: "Os cards organizam perguntas de decisão; não apresentam teste, critério de liberação ou protocolo clínico.",
  },
  "0921": {
    format: "Carrossel de 6 cards",
    purpose: "Usar três tensões reais da Nutrição Esportiva para demonstrar profundidade a 48 horas da abertura.",
    units: [
      { unit: "Card 1", role: "Contexto", content: "Informar que faltam 48 horas e que o recorte apresenta três decisões que exigem critério profissional." },
      { unit: "Card 2", role: "Evidência versus moda", content: "Explicar que novidade ou popularidade não substitui pergunta, evidência, contexto e objetivo do atleta.", source: "Andreia Naves + Amanda Brant" },
      { unit: "Card 3", role: "Estratégia individual versus receita pronta", content: "Mostrar que modalidade, duração, rotina, tolerância e histórico mudam a estratégia; a mesma solução não serve para todos.", source: "Andreia Naves + Bruno Zylber" },
      { unit: "Card 4", role: "Desempenho imediato versus saúde sustentável", content: "Apresentar a tensão entre resultado de curto prazo e sinais de baixa disponibilidade energética, recuperação ou risco à saúde.", source: "Daniel Coimbra" },
      { unit: "Card 5", role: "Síntese", content: "Conectar as três comparações: a decisão profissional precisa equilibrar evidência, individualidade, performance e saúde." },
      { unit: "Card 6", role: "Lembrete", content: "Reforçar a abertura em 23/09 às 12h e orientar a comentar LEMBRETE." },
    ],
    note: "As três comparações entram no mesmo carrossel. Os textos devem permanecer conceituais e ser revisados tecnicamente; não incluir dose, produto ou conduta.",
  },
  "0922": {
    format: "Reel de 4 blocos + sequência de Stories já detalhada",
    purpose: "Reunir as informações confirmadas da véspera e reduzir a incerteza antes da abertura.",
    units: [
      { unit: "Bloco 1", role: "Quando", content: "Vendas abrem amanhã, 23/09, às 12h." },
      { unit: "Bloco 2", role: "O que abre", content: "Os seis congressos estarão disponíveis; citar os seis nomes." },
      { unit: "Bloco 3", role: "Como se preparar", content: "Orientar a comparar o desafio profissional e escolher uma prioridade; incluir preço ou condição somente se aprovado." },
      { unit: "Bloco 4", role: "Próximo passo", content: "Convidar a comentar LEMBRETE ou usar o link dos Stories." },
    ],
    note: "O Reel usa apenas informações confirmadas. Os quatro Stories permanecem como desdobramento interativo separado.",
  },
  "0923b": {
    format: "Carrossel principal de 8 cards; Reel e Stories derivados",
    purpose: "Informar vendas abertas, permitir reconhecimento rápido e levar à página central de compra.",
    units: [
      { unit: "Card 1", role: "Abertura", content: "Informar que as vendas estão abertas e identificar primeiro lote somente se a condição estiver aprovada." },
      { unit: "Card 2", role: "Gestão de Academias", content: "Público: líderes de academias; foco: negócio, operação, liderança, cultura e crescimento." },
      { unit: "Card 3", role: "WTTC", content: "Público: personal trainers; foco: certificação com validade internacional, método, carreira e atuação também fora do Brasil." },
      { unit: "Card 4", role: "SONAFE", content: "Público: fisioterapeutas e equipes; foco: prevenção, avaliação, reabilitação e retorno ao esporte." },
      { unit: "Card 5", role: "Nutrição Estética", content: "Público: profissionais habilitados; foco: emagrecimento, composição e demandas estéticas complexas." },
      { unit: "Card 6", role: "Nutrição Esportiva", content: "Público: profissionais de saúde e desempenho; foco: nutrição, performance e decisões individualizadas." },
      { unit: "Card 7", role: "Bodybuilding", content: "Público: atletas e equipes; foco: treino, dieta, recuperação, saúde e competição." },
      { unit: "Card 8", role: "Compra", content: "Orientar a comentar LOTE ou acessar a página central de vendas." },
    ],
    note: "O Reel resume os oito blocos; os Stories informam abertura e link. Não substituir os perfis por programação ainda não confirmada.",
  },
  "0924": {
    format: "Carrossel de 8 cards",
    purpose: "Ajudar quem ainda não comprou a identificar o congresso mais próximo do seu objetivo.",
    units: [
      { unit: "Card 1", role: "Instrução", content: "Orientar a pessoa a escolher pelo desafio profissional, não apenas pelo nome do congresso." },
      { unit: "Card 2", role: "Gestão", content: "Se lidera academia e precisa fortalecer negócio, operação ou equipe: Gestão de Academias." },
      { unit: "Card 3", role: "WTTC", content: "Se busca certificação com validade internacional e atuação como personal no Brasil ou no exterior: WTTC." },
      { unit: "Card 4", role: "SONAFE", content: "Se atua com prevenção, avaliação, reabilitação e retorno ao esporte: SONAFE." },
      { unit: "Card 5", role: "Nutrição Estética", content: "Se trabalha com emagrecimento, estética e composição corporal: Nutrição Estética." },
      { unit: "Card 6", role: "Nutrição Esportiva", content: "Se trabalha com alimentação, saúde e desempenho esportivo: Nutrição Esportiva." },
      { unit: "Card 7", role: "Bodybuilding", content: "Se vive preparação, cultura competitiva e integração de treino e dieta: Bodybuilding." },
      { unit: "Card 8", role: "Decisão", content: "Explicar que a programação confirma a escolha final e orientar a comentar CONGRESSO." },
    ],
    note: "Não indicar compatibilidade entre congressos sem agenda oficial. O carrossel orienta por perfil e objetivo.",
  },
  "0925": {
    format: "Carrossel de 6 cards",
    purpose: "Demonstrar o tipo de raciocínio aprofundado já entregue em 2026, sem vender os temas como programação confirmada de 2027.",
    units: [
      { unit: "Card 1", role: "Enquadramento", content: "Apresentar três exemplos do nível de aprofundamento do acervo de Nutrição Estética de 2026." },
      { unit: "Card 2", role: "Critério comum", content: "Explicar que profundidade significa diferenciar cenários e investigar antes de repetir uma conduta genérica." },
      { unit: "Card 3", role: "Exemplo 1 — platô e reganho", content: "Apresentar a pergunta central: o que precisa ser investigado além da restrição calórica quando a resposta muda?", source: "Aula de Ana Paula Pujol, 2026" },
      { unit: "Card 4", role: "Exemplo 2 — demandas semelhantes", content: "Apresentar a necessidade de diferenciar celulite, lipedema e flacidez antes de tratá-las como a mesma queixa.", source: "Aula de Luisa Wolpe e Suellen Becher, 2026" },
      { unit: "Card 5", role: "Exemplo 3 — pele e ambiente", content: "Apresentar como ambiente e exposições ampliam a leitura sobre saúde da pele.", source: "Aula de Mika Yamaguchi, 2026" },
      { unit: "Card 6", role: "Conexão comercial", content: "Identificar explicitamente os três exemplos como acervo de 2026 e orientar a conhecer a edição de 2027 pela página de vendas." },
    ],
    note: "Os três temas entram no mesmo carrossel. Não afirmar que palestrantes ou assuntos estão confirmados na programação de 2027.",
  },
  "0926": {
    format: "Reel de 7 blocos + cinco Stories já detalhados",
    purpose: "Reduzir atrito de compra respondendo dúvidas reais com informações oficiais.",
    units: [
      { unit: "Bloco 1", role: "Contexto", content: "Informar que a equipe reuniu cinco dúvidas recebidas após a abertura." },
      { unit: "Bloco 2", role: "Inclusões", content: "Responder o que está incluído na inscrição usando a descrição oficial." },
      { unit: "Bloco 3", role: "Escolha", content: "Explicar a escolha pelos seis perfis e propostas de valor." },
      { unit: "Bloco 4", role: "Condições", content: "Apresentar preço, lote e pagamento somente com dados comerciais aprovados." },
      { unit: "Bloco 5", role: "Logística", content: "Apresentar acesso, local e logística somente com dados oficiais." },
      { unit: "Bloco 6", role: "Suporte", content: "Informar o canal oficial para dúvidas antes da compra." },
      { unit: "Bloco 7", role: "Retomada", content: "Orientar a retomar a inscrição ou falar com o atendimento." },
    ],
    note: "Se uma resposta ainda não estiver confirmada, retirar o bloco correspondente. Não completar informação comercial por inferência.",
  },
  "0927": {
    format: "Carrossel ou post de 5 blocos para feed",
    purpose: "Usar uma prova real para sustentar confiança e explicar os próximos passos da campanha.",
    units: [
      { unit: "Bloco 1", role: "Prova escolhida", content: "Selecionar uma única prova verificável: comentário autorizado, dúvida resolvida, depoimento anterior ou dado aprovado.", source: "Material autorizado" },
      { unit: "Bloco 2", role: "Origem", content: "Identificar de que edição ou momento veio a prova e preservar o contexto." },
      { unit: "Bloco 3", role: "O que ela demonstra", content: "Explicar somente o aspecto comprovado: interesse, dúvida resolvida ou valor percebido." },
      { unit: "Bloco 4", role: "Próximos conteúdos", content: "Informar que a campanha seguirá ajudando na escolha, programação e preparação para o evento." },
      { unit: "Bloco 5", role: "Ação", content: "Orientar a escolher o congresso e acessar a página central de vendas." },
    ],
    note: "Escolher apenas uma fonte de prova por peça. Sem prova autorizada, usar bastidores reais da equipe e explicar os próximos conteúdos.",
  },
};

export const optionModes: Record<string, "alternatives" | "inputs"> = {
  "0903": "inputs",
  "0904": "alternatives",
  "0906": "inputs",
  "0908": "inputs",
  "0910": "alternatives",
  "0911": "inputs",
  "0913": "inputs",
  "0914": "inputs",
  "0915": "alternatives",
  "0917": "inputs",
  "0919": "inputs",
  "0921": "inputs",
  "0923b": "alternatives",
  "0924": "inputs",
  "0925": "inputs",
  "0927": "alternatives",
};

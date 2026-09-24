import { octoberDestinations } from "./octoberSocialPlan";

const conferenceSupportEmail = "mailto:congresso@savagetgroup.com.br";

type SourceLink = {
  label: string;
  url: string;
  note: string;
};

type EmailSeed = {
  id: string;
  date: string;
  audience: string;
  objective: string;
  materials: string;
  cta: string;
  destination: string;
  destinationUrl: string;
  rule: string;
  subjectDirection: string;
  steps: Array<{ step: string; role: string; direction: string; example: string }>;
  checks: string[];
  fallback: string;
  limits: string;
  agencyResearch?: string[];
  proofGate?: string;
  sourceLinks?: SourceLink[];
};

export const emailOperationalGates = [
  {
    id: "d6",
    moment: "D-6 · antes do envio de 30/09",
    title: "Anúncio da data",
    access: "A agência consulta este gate aqui e no briefing de 30/09. O GO final depende da confirmação do cliente e da operação.",
    evidence: "Ticketeira, data e horário, páginas, checkout em homologação, condições públicas, regra SONAFE, tracking, UTMs e atendimento.",
    noGo: "Se algum item crítico não tiver evidência, cancelar o anúncio. Não improvisar nova data, destino ou condição.",
  },
  {
    id: "d2",
    moment: "D-2 · antes do envio de 04/10",
    title: "Lembrete segmentado",
    access: "A agência consulta este gate aqui e no briefing de 04/10. O disparo só existe para engajados identificáveis no CRM.",
    evidence: "D-6 ainda verde, clique no e-mail de 30/09 ou visita registrada à LP, frequência permitida, LP e UTM testadas e supressões aplicadas.",
    noGo: "Sem evento verificável ou com qualquer falha operacional, cancelar o envio. Não ampliar para toda a base.",
  },
  {
    id: "d0",
    moment: "D0 · antes do envio de 06/10",
    title: "Inscrições abertas",
    access: "A agência consulta este gate aqui e no briefing de abertura. Somente o responsável operacional pode registrar o GO.",
    evidence: "Compra-teste real em desktop e mobile, confirmação, conciliação, condições idênticas, regras SONAFE, UTM persistente, suporte e supressão de compradores.",
    noGo: "Se a compra não estiver comprovadamente funcional, cancelar o envio e toda afirmação de inscrições abertas.",
  },
  {
    id: "proof",
    moment: "Gate editorial · todos os envios",
    title: "Fonte, autorização e revisão",
    access: "A agência deve anexar as evidências na planilha operacional e seguir o campo Pesquisa e material bruto do briefing.",
    evidence: "Fonte primária, arquivo original, contexto, direitos, autorização e revisão técnica quando houver pessoa, fala, caso, credencial ou conteúdo clínico.",
    noGo: "Sem pacote completo, usar o fallback institucional previsto ou retirar a alegação. Nunca preencher por inferência.",
  },
] as const;

const emailSeeds: EmailSeed[] = [
  {
    id: "email-oct-announcement",
    date: "30/09",
    audience: "Base consentida, participantes anteriores e leads recentes; excluir inválidos, descadastros, contatos sem base legal e quem estiver coberto por mensagem equivalente.",
    objective: "Informar que as inscrições abrem em 06/10 e captar quem ainda não está na lista, sem antecipar a venda.",
    materials: "Data confirmada, nomes oficiais, LP de novidades, tracking e gate D-6 aprovados.",
    cta: "Acompanhar as informações até a abertura",
    destination: "Landing page geral de novidades",
    destinationUrl: octoberDestinations.news,
    rule: "Um único envio. Quem já está cadastrado pode receber a informação, mas não precisa preencher novamente.",
    subjectDirection: "Assunto direto: ‘As inscrições do Arnold Conference 2027 abrem em 06/10’. Não usar suspense ou benefício genérico.",
    steps: [
      { step: "Bloco 1", role: "Data", direction: "Informar 06/10 na primeira dobra.", example: "O leitor precisa entender a data antes de qualquer contextualização." },
      { step: "Bloco 2", role: "O que acontece", direction: "Explicar que os seis congressos abrirão inscrições, sem comparação ou ranking.", example: "Apresentar os seis nomes na ordem editorial: Nutrição Esportiva, Nutrição Estética, SONAFE, Gestão de Academias, Certificação Internacional em Personal Training – WTTC e Bodybuilding." },
      { step: "Bloco 3", role: "O que fazer agora", direction: "Orientar o cadastro de quem ainda não está na lista.", example: "Quem já se cadastrou não precisa repetir o formulário." },
      { step: "Bloco 4", role: "Próximo passo", direction: "Levar à LP de novidades com uma única chamada.", example: "Não apresentar checkout como aberto." },
    ],
    checks: ["Gate D-6 verde", "Data e nomes oficiais", "LP e UTM testadas", "Uma campanha e um CTA", "Sem preço, lote ou escassez"],
    fallback: "Se o gate D-6 falhar, cancelar o disparo; não anunciar nova data nem improvisar destino.",
    limits: "Não afirmar vendas abertas, não comparar produtos e não prometer lembrete individual sem automação.",
    proofGate: "O anúncio só é liberado com data, checkout em homologação, links, condições públicas, tracking, atendimento e regras comerciais validados.",
  },
  {
    id: "email-oct-reminder",
    date: "04/10",
    audience: "Somente contatos consentidos que clicaram no e-mail de 30/09 ou visitaram a LP de novidades, com evento verificável no CRM; excluir compradores, descadastros, contatos sem base legal, mensagem equivalente recente e cobertura por WhatsApp equivalente.",
    objective: "Reforçar que faltam dois dias para a abertura e recordar, por problemas profissionais concretos, por que cada público deve acompanhar 06/10.",
    materials: "Gate D-2, evento de engajamento, seis propostas de valor validadas, LP e UTM testadas.",
    cta: "Acompanhar a abertura em 06/10",
    destination: "Landing page geral de novidades",
    destinationUrl: octoberDestinations.news,
    rule: "Um único envio segmentado. Não ampliar para toda a base e não enviar em 05/10.",
    subjectDirection: "‘Faltam dois dias para a abertura das inscrições do Arnold Conference 2027’. A urgência é a data real; não usar ‘últimas vagas’ ou ‘lote limitado’.",
    steps: [
      { step: "Bloco 1", role: "Contagem real", direction: "Abrir informando que faltam dois dias e que as inscrições abrem em 06/10.", example: "A mensagem deve ser entendida imediatamente, sem suspense antes da data." },
      { step: "Bloco 2", role: "Problemas concretos", direction: "Apresentar, em uma linha por congresso, o problema profissional que cada sala aprofunda, começando por Nutrição Esportiva.", example: "Método e desempenho; avaliação em Nutrição Estética; prevenção e retorno no SONAFE; liderança e processos em Gestão; credencial internacional na certificação; preparação contextualizada em Bodybuilding." },
      { step: "Bloco 3", role: "O que está confirmado", direction: "Informar somente fatos liberados: data de abertura e seis congressos. Temas centrais de Nutrição Estética e SONAFE podem entrar seletivamente; nomes e grade completa ficam fora sem autorização específica.", example: "Não transformar confirmação interna em lançamento antecipado da programação." },
      { step: "Bloco 4", role: "Acompanhamento", direction: "Levar à LP de novidades e avisar que quem já está cadastrado não precisa preencher de novo.", example: "Um CTA principal; checkout ainda não é o destino." },
    ],
    checks: ["Gate D-2 verde", "Evento real no CRM", "Frequência e supressões", "LP e UTM testadas", "Sem preço ou escassez inventada"],
    fallback: "Sem evento verificável ou com qualquer falha no gate D-2, cancelar este envio. Preservar 30/09 e 06/10; não criar disparo em 05/10.",
    limits: "Não anunciar inscrições abertas, não revelar grade, horários ou palestrantes não autorizados e não usar lote, quantidade ou condição interna.",
    proofGate: "D-6 precisa continuar verde e o público deve ser formado por clique ou visita real. Sem evidência de engajamento, o e-mail não é disparado.",
  },
  {
    id: "email-oct-opening",
    date: "06/10",
    audience: "Base consentida elegível, leads qualificados e participantes anteriores; excluir compradores e pessoas cobertas pelo WhatsApp equivalente.",
    objective: "Informar vendas abertas e conduzir cada pessoa diretamente à página do congresso ligado à própria atuação.",
    materials: "Hub, páginas, checkout, condições públicas, FAQ, suporte, UTMs, compra-teste e conciliação aprovados.",
    cta: "Escolher meu congresso e fazer a inscrição",
    destination: "Hub oficial do Arnold Conference",
    destinationUrl: octoberDestinations.conferenceHub,
    rule: "Campanha única e autossuficiente. Compra confirmada remove o contato da comunicação comercial daquele produto.",
    subjectDirection: "Assunto direto: ‘Inscrições abertas para o Arnold Conference 2027’. Condição comercial somente se estiver publicada e idêntica no site e checkout.",
    steps: [
      { step: "Bloco 1", role: "Abertura", direction: "Informar que as inscrições estão abertas logo no início.", example: "Sem introdução conceitual antes da notícia comercial." },
      { step: "Bloco 2", role: "Seis situações", direction: "Apresentar uma situação profissional curta para cada congresso, sem ranking.", example: "Começar por Nutrição Esportiva e seguir a ordem oficial; Gestão e certificação permanecem independentes." },
      { step: "Bloco 3", role: "Adequação", direction: "Em cada rota, dizer para quem o congresso foi desenhado e qual problema ajuda a aprofundar.", example: "Não transformar os seis blocos em comparação." },
      { step: "Bloco 4", role: "Compra", direction: "Levar ao hub e às páginas específicas.", example: "Um único botão principal; condições permanecem na página oficial." },
    ],
    checks: ["Gate D0 aprovado", "Compra real em desktop e mobile", "Conciliação e UTM", "Compradores suprimidos", "Nome completo da certificação"],
    fallback: "Se o gate D0 falhar, cancelar. Não redirecionar público pronto para comprar à LP ou às masterclasses.",
    limits: "Não expor lotes internos, não usar ‘lote limitado’ ou ‘últimas vagas’ sem quantidade comprovada.",
    proofGate: "Compra-teste, confirmação, conciliação, igualdade de condições, regra SONAFE, tracking, suporte e supressões precisam estar verdes.",
  },
  {
    id: "email-oct-sports",
    date: "08/10",
    audience: "Não compradores com interesse mais forte em Nutrição Esportiva e frequência permitida.",
    objective: "Demonstrar como contexto, energia, função e método alteram a decisão no atendimento do atleta.",
    materials: "Página oficial e, se validado, acervo 2026 de Humberto Nicastro, Guilherme D. Dilda ou Ivan Lucas.",
    cta: "Conhecer Nutrição Esportiva e fazer a inscrição",
    destination: "Página oficial de Nutrição Esportiva",
    destinationUrl: octoberDestinations.sportsNutrition,
    rule: "Uma campanha específica; não confirmar programação ou palestrante 2027 a partir do acervo.",
    subjectDirection: "‘Nutrição Esportiva: método, contexto e função para decidir melhor’. Evitar frases genéricas que não mostram uma decisão concreta.",
    steps: [
      { step: "Bloco 1", role: "Cena", direction: "Mostrar o profissional diante de atletas com rotina, fase e demanda diferentes.", example: "Atleta amador não é elite em escala menor." },
      { step: "Bloco 2", role: "Três perguntas", direction: "Perguntar pela rotina real, pela relação entre energia, recuperação e função e pelo método de medida.", example: "Não diagnosticar nem prescrever." },
      { step: "Bloco 3", role: "Prova opcional", direction: "Usar acervo de 2026 somente com vídeo e fala conferidos.", example: "O texto precisa continuar compreensível sem o vídeo." },
      { step: "Bloco 4", role: "Compra", direction: "Apresentar a proposta da sala e levar à página.", example: "Um único botão." },
    ],
    checks: ["Segmento de Nutrição Esportiva", "Frequência", "Acervo identificado como 2026", "Revisão técnica", "Página e checkout"],
    fallback: "E-mail institucional com rotina, energia, função e método, sem pessoa ou citação.",
    limits: "Sem RED-S como autodiagnóstico, doses, suplementos, hidratação, carboidratos, GLP-1 ou promessa de performance.",
    agencyResearch: ["Conferir áudio e contexto de Humberto, Guilherme e Ivan", "Entregar fonte técnica para RED-S se o termo for usado", "Biografia, publicação ou foto somente com fonte e autorização"],
    proofGate: "Sem acesso ao original e revisão, retirar fala, termo diagnóstico e autoridade pessoal.",
    sourceLinks: [
      { label: "Íntegra — Ivan Lucas", url: octoberDestinations.ivan, note: "Acervo 2026; conferir o original antes de qualquer citação." },
      { label: "Íntegra — Humberto Nicastro e Guilherme D. Dilda", url: octoberDestinations.humbertoGuilherme, note: "Acervo 2026; não usar como confirmação de 2027." },
    ],
  },
  {
    id: "email-oct-aesthetic",
    date: "09/10",
    audience: "Não compradores com interesse mais forte em Nutrição Estética e frequência permitida.",
    objective: "Usar um tema confirmado — queda capilar além da ferritina — para mostrar por que um único marcador não encerra a investigação profissional.",
    materials: "Ementa autorizada ‘Queda capilar além da ferritina: mitocôndria, inflamação e metabolômica — Ozempic Hair Loss: mito ou realidade?’ e página oficial do congresso.",
    cta: "Conhecer Nutrição Estética e fazer a inscrição",
    destination: "Página oficial de Nutrição Estética",
    destinationUrl: octoberDestinations.aestheticNutrition,
    rule: "Uma campanha específica. Não misturar queda capilar, lipedema, performance e saúde da mulher na mesma mensagem.",
    subjectDirection: "‘Queda capilar: por que a ferritina não encerra a investigação?’. Não prometer diagnóstico, causa ou solução.",
    steps: [
      { step: "Bloco 1", role: "Pergunta real", direction: "Abrir com a pergunta profissional, sem inventar paciente ou caso clínico: quando há queda capilar, por que olhar somente a ferritina pode empobrecer a avaliação?", example: "Usar ‘situação ilustrativa’ e não apresentar resultado de paciente." },
      { step: "Bloco 2", role: "O que o tema amplia", direction: "Apresentar três frentes que o título confirmado coloca em debate: contexto metabólico, inflamação e o conjunto de sinais/metabólitos observado na avaliação. Formular perguntas; não explicar mecanismo como certeza.", example: "O que muda quando a investigação considera o contexto metabólico? O que ainda precisa ser perguntado além de um marcador isolado?" },
      { step: "Bloco 3", role: "Ponto controverso", direction: "Mencionar que o tema também discute queda capilar associada ao emagrecimento e ao uso de GLP-1, como pergunta científica ainda sujeita a análise; não afirmar causa nem conduta.", example: "O e-mail pode apresentar ‘mito ou realidade?’ como questão do programa, sem antecipar a resposta da palestra." },
      { step: "Bloco 4", role: "Compra", direction: "Conectar essa profundidade à sala de Nutrição Estética e levar à página oficial.", example: "Um CTA principal; sem grade completa ou outros temas no mesmo e-mail." },
    ],
    checks: ["Tema central autorizado", "Revisão clínica", "Página testada", "Nomes e materiais autorizados quando usados", "Compradores excluídos"],
    fallback: "E-mail temático sem pessoa, foto, caso ou citação, mantendo apenas a pergunta, as três frentes e o convite para a sala.",
    limits: "Sem diagnóstico, mecanismo apresentado como certeza, prescrição, exame recomendado, dose ou promessa estética/clínica.",
    agencyResearch: ["Se usar Dr. Leandro Lucerna ou Luísa Wolpe, confirmar papel, mini-bio, foto e autorização", "Não atribuir resposta ao tema antes de receber a ementa detalhada ou fala autorizada", "Entregar revisão clínica da redação"],
    proofGate: "A programação autoriza o tema central. Nomes, fotos, citações e conclusões clínicas dependem de pacote próprio de validação.",
  },
  {
    id: "email-oct-sonafe",
    date: "10/10",
    audience: "Não compradores com interesse mais forte em SONAFE e frequência permitida.",
    objective: "Mostrar, por uma situação concreta, por que a decisão na Fisioterapia Esportiva começa pelo contexto do atleta e não por uma técnica escolhida de antemão.",
    materials: "Programação definitiva SONAFE, temas centrais liberados e revisão técnica.",
    cta: "Conhecer o SONAFE e fazer a inscrição",
    destination: "Página oficial do SONAFE",
    destinationUrl: octoberDestinations.sonafe,
    rule: "Uma campanha segmentada; não revelar grade, horários ou palestrantes sem autorização específica.",
    subjectDirection: "‘Antes de decidir o caminho de retorno ao esporte, responda a estas quatro perguntas’. Não usar suspense clínico.",
    steps: [
      { step: "Bloco 1", role: "Cena concreta", direction: "Abrir com um atleta que quer voltar aos treinos depois de uma lesão. A mensagem não escolhe tratamento; mostra que a decisão exige contexto.", example: "Dois atletas podem relatar a mesma dor e ainda assim ter demandas esportivas, históricos e objetivos diferentes." },
      { step: "Bloco 2", role: "Quem e qual esporte", direction: "Explicar as duas primeiras perguntas: quem é o atleta — população, histórico e contexto — e o que sua modalidade exige — contato, mudança de direção, repetição, salto, força ou resistência.", example: "Não transformar exemplos de demanda em teste ou prescrição." },
      { step: "Bloco 3", role: "Fase e objetivo", direction: "Explicar as duas perguntas seguintes: em qual momento ele está — prevenção, avaliação, reabilitação ou transição para o retorno — e qual função precisa recuperar para voltar ao seu contexto esportivo.", example: "Não reduzir a decisão ao desaparecimento da dor nem prometer retorno seguro." },
      { step: "Bloco 4", role: "Aprofundamento", direction: "Conectar as quatro perguntas aos temas centrais do SONAFE: prevenção, avaliação, controle de carga, reabilitação e retorno ao esporte.", example: "Apresentar a sala e usar um único botão de inscrição; não listar a programação completa." },
    ],
    checks: ["Segmento SONAFE", "Temas liberados", "Revisão técnica", "Página e checkout", "Numeração oficial confirmada antes de publicar"],
    fallback: "Mensagem com a cena e as quatro perguntas, sem depoimento, nome, foto, caso real ou grade.",
    limits: "Sem protocolo, técnica indicada, exercício, progressão, carga, diagnóstico ou promessa de prevenção, recuperação ou retorno.",
    agencyResearch: ["Validar com fisioterapeuta esportivo se os exemplos de demanda estão corretos", "Se usar pessoa ou depoimento, entregar arquivo original, contexto e autorização", "Confirmar a numeração oficial do simpósio"],
    proofGate: "Os temas podem ser usados seletivamente. Pessoa, prova social, caso, legado ou citação exigem pacote próprio de validação.",
  },
  {
    id: "email-oct-management",
    date: "13/10",
    audience: "Não compradores com interesse mais forte em Gestão de Academias; excluir quem recebeu outro e-mail comercial nas 72 horas anteriores.",
    objective: "Usar uma fala real de 2026 para mostrar como processos, responsabilidades e indicadores reduzem o gargalo concentrado no proprietário.",
    materials: "Página oficial e ponto de busca de Américo José da Silva Filho, no acervo Arnold Conference 2026.",
    cta: "Conhecer Gestão de Academias e fazer minha inscrição",
    destination: "Página oficial de Gestão de Academias",
    destinationUrl: octoberDestinations.management,
    rule: "Uma campanha para o segmento de Gestão. Não prometer crescimento, faturamento ou operação independente.",
    subjectDirection: "‘Sua academia consegue avançar sem cada decisão voltar para o dono?’. Evitar promessa financeira ou de expansão.",
    steps: [
      { step: "Bloco 1", role: "Cena", direction: "Mostrar o proprietário que precisa aprovar contratações, corrigir exceções e decidir tudo antes que a equipe avance.", example: "A equipe até executa, mas cada exceção volta para uma única pessoa." },
      { step: "Bloco 2", role: "Consequência", direction: "Explicar que ampliar uma operação dependente do proprietário pode ampliar o próprio gargalo.", example: "Antes de crescer, perguntar quem decide, qual processo pode ser repetido e qual indicador mostra se a execução aconteceu." },
      { step: "Bloco 3", role: "Fala de 2026", direction: "Usar a fala em que Américo explica que, quando todos os processos estão na cabeça do dono, a academia depende dele até quando precisa se ausentar.", example: "Américo José da Silva Filho · 36:20–36:51 na transcrição automática do acervo 2026." },
      { step: "Bloco 4", role: "Compra", direction: "Apresentar Gestão de Academias como espaço de aprofundamento em liderança, processos e indicadores e levar à página.", example: "Um CTA principal; sem afirmar que Américo integra 2027." },
    ],
    checks: ["Interesse em Gestão confirmado", "Compradores excluídos", "Página testada", "Vídeo e corte conferidos", "Uma campanha e um CTA"],
    fallback: "E-mail institucional com a cena, três perguntas — quem decide, qual processo e qual indicador — e a proposta do congresso, sem pessoa ou citação.",
    limits: "Sem promessa financeira, expansão garantida, franquia, venda de empresa ou comparação com a certificação.",
    agencyResearch: ["Usar o trecho de 36:20–36:51 indicado na transcrição automática", "Entregar legenda fiel, entrada, saída, crédito e link da íntegra", "Retirar números de mercado e qualquer interpretação jurídica ou financeira"],
    proofGate: "O trecho foi conferido no audiovisual original. Sem revisão da legenda e direitos de uso, aplicar o fallback institucional.",
    sourceLinks: [
      { label: "Abrir íntegra — Américo José da Silva Filho", url: octoberDestinations.americo, note: "Acervo 2026 · usar o trecho de 36:20–36:51 indicado na transcrição automática." },
    ],
  },
  {
    id: "email-oct-wttc",
    date: "14/10",
    audience: "Não compradores com interesse mais forte na Certificação Internacional em Personal Training – WTTC e frequência permitida.",
    objective: "Conduzir o leitor da intenção de atuar fora do Brasil à verificação da credencial e, então, apresentar Cris Parente como coordenador confirmado.",
    materials: "Página oficial, confirmação da coordenação, documento de chancela e fontes primárias do alcance internacional.",
    cta: "Conhecer a Certificação Internacional em Personal Training – WTTC e fazer a inscrição",
    destination: "Página oficial da Certificação Internacional em Personal Training – WTTC",
    destinationUrl: octoberDestinations.wttc,
    rule: "Uma campanha específica. Sempre escrever o nome completo antes da sigla e não comparar com Gestão.",
    subjectDirection: "‘Quer atuar fora do Brasil? Veja o que precisa conferir antes de escolher uma certificação’. Não prometer emprego, licença ou equivalência.",
    steps: [
      { step: "Bloco 1", role: "Intenção", direction: "Abrir com o personal trainer que deseja ampliar a carreira internacional e transformar essa intenção em perguntas verificáveis.", example: "Experiência e vontade não respondem sozinhas o que uma credencial permite em outro país." },
      { step: "Bloco 2", role: "Quatro verificações", direction: "Explicar o que conferir: entidade e chancela, escopo do certificado, documentação exigida e regras profissionais do país de destino.", example: "Citar número de países somente com fonte primária atual e redação aprovada." },
      { step: "Bloco 3", role: "Quem coordena", direction: "Fazer a ponte: depois de entender a credencial, apresentar Cris Parente como coordenador confirmado e responsável pela condução da formação. Credenciais adicionais exigem fonte e autorização.", example: "Coordenação dá contexto sobre quem estrutura a formação; não substitui a checagem de regras locais nem garante emprego." },
      { step: "Bloco 4", role: "Decisão", direction: "Apresentar a Certificação Internacional em Personal Training – WTTC por extenso e levar à página oficial.", example: "Um CTA principal; sem comparação com outra sala." },
    ],
    checks: ["Nome completo antes da sigla", "Fonte da chancela", "Alcance internacional aprovado", "Coordenação de Cris confirmada", "Página e checkout"],
    fallback: "E-mail com quatro verificações e fontes institucionais, sem número de países, foto, prêmio, citação ou credencial adicional.",
    limits: "Sem emprego, renda, visto, licença ou equivalência automática; sem comparação com outra sala.",
    agencyResearch: ["Entregar fonte oficial atual para chancela, escopo e alcance internacional", "Confirmar a redação aprovada do papel de Cris Parente", "Comprovar qualquer cargo, prêmio, docência ou atuação internacional citado", "Obter autorização de nome, imagem, voz e citação"],
    proofGate: "Há divergência pública sobre o número de países. Não usar ‘35 países’ nem outro número até a fonte primária vigente confirmar número, escopo e data.",
    sourceLinks: [
      { label: "Perfil de referência — Cris Parente", url: octoberDestinations.crisSocial, note: "O perfil ajuda a localizar materiais; não substitui fontes primárias das credenciais." },
      { label: "Página oficial da certificação", url: octoberDestinations.wttc, note: "Conferir a redação vigente antes do disparo." },
    ],
  },
  {
    id: "email-oct-bodybuilding",
    date: "15/10",
    audience: "Não compradores com interesse mais forte em Bodybuilding e frequência permitida.",
    objective: "Mostrar por que uma referência de atleta de elite não deve ser copiada sem compreender pessoa, categoria, fase e recuperação.",
    materials: "Banco de materiais Bodybuilding e Reels públicos sobre organização do treino, aplicação da ciência e transferência de referências da elite.",
    cta: "Conhecer Bodybuilding e fazer a inscrição",
    destination: "Página oficial de Bodybuilding",
    destinationUrl: octoberDestinations.bodybuilding,
    rule: "Uma campanha específica; as fontes são experiências de 2026, não programação 2027 nem evidência universal.",
    subjectDirection: "‘Antes de copiar uma preparação, qual era o contexto?’. Não usar promessa de físico, título ou transformação.",
    steps: [
      { step: "Bloco 1", role: "Pergunta", direction: "Abrir com a diferença entre enxergar uma decisão de preparação e conhecer o contexto que a produziu.", example: "O mesmo treino visto no feed não mostra fase, categoria, histórico e capacidade de recuperação." },
      { step: "Bloco 2", role: "Experiência real", direction: "Usar o Reel de Ricardo Pannain sobre organização de volume, intensidade e recuperação apenas como experiência relatada de uma atleta de elite.", example: "Não publicar séries, cargas, divisão ou frequência como recomendação." },
      { step: "Bloco 3", role: "Filtro de aplicação", direction: "Organizar quatro perguntas: para quem, em qual categoria, em que fase e com qual resposta de recuperação.", example: "Ciência e experiência ajudam a formular decisões; nenhuma das duas autoriza copiar um protocolo sem contexto." },
      { step: "Bloco 4", role: "Compra", direction: "Apresentar Bodybuilding como espaço para aprofundar decisões de preparação e levar à página.", example: "Um CTA principal; sem repetir o tema de equipe multidisciplinar usado em 22/09." },
    ],
    checks: ["Segmento Bodybuilding", "Fontes e datas de 2026", "Direitos de reutilização", "Revisão de Educação Física", "Página testada"],
    fallback: "E-mail institucional com as quatro perguntas de contexto, sem nome, foto, citação ou Reel.",
    limits: "Sem protocolo, volume prescrito, carga, série, fármaco, dose, ciclo, dieta, manipulação ou promessa competitiva.",
    agencyResearch: ["Conferir os Reels originais, autoria, data, fala e contexto", "Obter direitos de reutilização e aprovação comercial", "Revisar qualquer afirmação técnica com profissional de Educação Física"],
    proofGate: "Sem direitos ou validação, usar a narrativa institucional. Não reutilizar o Reel de equipe multidisciplinar de 22/09.",
    sourceLinks: [
      { label: "Reel — organização do treino e recuperação", url: octoberDestinations.bodybuildingTraining, note: "Experiência relatada em caso de atleta de elite; não é prescrição." },
    ],
  },
  {
    id: "email-oct-recovery",
    date: "22/10",
    audience: "Somente contatos com checkout iniciado real, sem compra confirmada, sem WhatsApp equivalente, com consentimento e uma rota universal de retomada validada.",
    objective: "Recuperar uma inscrição iniciada com uma única mensagem que funcione para todos os congressos, sem personalizar o corpo pelo produto ou pelo motivo.",
    materials: "Evento conciliado, supressão de compradores, central oficial de inscrições ou suporte e links testados.",
    cta: "Retomar minha inscrição",
    destination: "Central oficial de inscrições do Arnold Conference",
    destinationUrl: octoberDestinations.conferenceHub,
    rule: "Uma mensagem por contato elegível. Compra, resolução, resposta negativa ou opt-out encerram o fluxo.",
    subjectDirection: "‘Sua inscrição foi iniciada, mas ainda não foi confirmada’. Não mencionar congresso, fase do abandono, preço ou problema técnico.",
    steps: [
      { step: "Bloco 1", role: "Estado real", direction: "Reconhecer apenas que uma inscrição foi iniciada e ainda não consta como confirmada.", example: "Não presumir cartão recusado, dúvida, indecisão ou erro no site." },
      { step: "Bloco 2", role: "Continuidade", direction: "Orientar a pessoa a retomar pela central oficial de inscrições e escolher novamente a rota correta, sem personalizar o corpo.", example: "A mensagem é idêntica para todos; não nomear congresso ou produto." },
      { step: "Bloco 3", role: "Ajuda", direction: "Se houver dificuldade, indicar que a página oficial reúne dúvidas frequentes e o canal validado de atendimento.", example: "Não pedir dados financeiros por resposta ao e-mail." },
      { step: "Bloco 4", role: "Ação", direction: "Usar um único botão para a central oficial de inscrições.", example: "Não oferecer outra sala, desconto ou urgência inventada." },
    ],
    checks: ["Evento real", "Sem compra", "Consentimento", "Central oficial testada", "Supressão de WhatsApp"],
    fallback: "Sem evento conciliado ou rota universal de retomada segura, não enviar.",
    limits: "Sem ‘última chance’, lote, desconto, urgência presumida, produto personalizado ou motivo inventado.",
    proofGate: "A recuperação só existe quando o evento real, a ausência de compra e o destino universal seguro puderem ser comprovados.",
  },
  {
    id: "email-oct-consideration",
    date: "27/10",
    audience: "Contatos de alta intenção com evento recente verificável, sem compra, sem checkout ativo, sem recuperação em curso, com consentimento e frequência permitida.",
    objective: "Oferecer ajuda objetiva para concluir a inscrição, sem exigir uma dúvida específica e sem personalizar o corpo por congresso.",
    materials: "FAQ público vigente, página institucional, atendimento confirmado, horário e links testados.",
    cta: "Consultar dúvidas frequentes e concluir minha inscrição",
    destination: "Dúvidas frequentes na página oficial do Arnold Conference",
    destinationUrl: octoberDestinations.conferenceHub,
    rule: "Uma única mensagem de serviço. Suprimir compradores, recuperação ativa e contato equivalente recente.",
    subjectDirection: "‘Como podemos te ajudar a concluir sua inscrição?’. Não usar pressão de fim de mês.",
    steps: [
      { step: "Bloco 1", role: "Acolhimento", direction: "Reconhecer que pode faltar uma informação para a decisão, sem presumir qual é.", example: "Não citar preço, programação, logística ou pagamento como se fossem a dúvida da pessoa." },
      { step: "Bloco 2", role: "FAQ", direction: "Explicar que a página oficial reúne respostas sobre inscrição, acesso à feira, certificados, credenciamento, múltiplos congressos e outras regras vigentes.", example: "Usar somente perguntas e respostas publicadas e atualizadas para 2027." },
      { step: "Bloco 3", role: "Atendimento", direction: "Se o FAQ não resolver, orientar o contato pelo canal oficial confirmado. Hoje foi localizado o e-mail congresso@savagetgroup.com.br; WhatsApp só entra após o cliente fornecer e validar o link oficial.", example: "Não solicitar dados financeiros por resposta aberta." },
      { step: "Bloco 4", role: "Conclusão", direction: "Levar ao FAQ na página oficial e permitir que a pessoa retome a inscrição pela rota correspondente.", example: "Um CTA principal; sem comparar congressos." },
    ],
    checks: ["Evento de alta intenção real", "FAQ atualizado para 2027", "Atendimento responsável confirmado", "Frequência e supressões", "Página testada"],
    fallback: "Se o FAQ não estiver atualizado ou o atendimento não estiver confirmado, cancelar o disparo. Não inventar WhatsApp, resposta ou destino.",
    limits: "Sem escassez, capacidade, palestrante, condição, personalização por congresso ou urgência de fim de mês.",
    agencyResearch: ["Revisar cada resposta do FAQ contra as regras de 2027", "Confirmar que congresso@savagetgroup.com.br continua responsável", "Inserir WhatsApp somente depois de receber URL oficial, horário e responsável", "Testar todos os links em desktop e mobile"],
    proofGate: "A página pública possui FAQ e informa congresso@savagetgroup.com.br. O cliente precisa confirmar que ambos estarão vigentes para 2027; não há WhatsApp oficial validado no material consultado.",
    sourceLinks: [
      { label: "Abrir página institucional e FAQ", url: octoberDestinations.conferenceHub, note: "Revisar o conteúdo antes do disparo; a página pode estar em transição." },
      { label: "Contato atualmente publicado", url: conferenceSupportEmail, note: "Confirmar que o endereço segue responsável pela edição de 2027." },
    ],
  },
];

export const octoberEmailBase = emailSeeds.map(({ destinationUrl: _destinationUrl, subjectDirection: _subjectDirection, steps: _steps, checks: _checks, fallback: _fallback, limits: _limits, agencyResearch: _agencyResearch, proofGate: _proofGate, sourceLinks: _sourceLinks, ...item }) => item);

export const octoberEmailBriefs = Object.fromEntries(
  emailSeeds.map(seed => [seed.id, {
    label: `Briefing detalhado · envio de ${seed.date}`,
    decision: seed.objective,
    rationale: `Este é um único envio para a audiência elegível. O conteúdo é autossuficiente e usa um CTA principal para ${seed.destination.toLowerCase()}. Não criar versões paralelas para o mesmo segmento.`,
    versions: [{
      id: seed.id.replace("email-oct-", "oct-"),
      label: "Versão única · campanha segmentada",
      audience: seed.audience,
      objective: seed.objective,
      subjectDirection: seed.subjectDirection,
      steps: seed.steps,
      cta: seed.cta,
      destinationLabel: seed.destination,
      destinationUrl: seed.destinationUrl,
      exclusion: seed.rule,
    }],
    routing: [
      { condition: "Contato atende aos critérios de elegibilidade e frequência", action: "Enviar esta única campanha.", reason: "A mensagem foi desenhada para o estágio e o produto identificados." },
      { condition: "Compra confirmada, opt-out, falta de consentimento ou mensagem equivalente recente", action: "Suprimir o envio.", reason: "Evita insistência, duplicação e comunicação fora do estágio real." },
      { condition: "Material, prova, página, revisão ou gate necessário está pendente", action: "Aplicar o fallback ou cancelar o slot.", reason: "A cadência não justifica informação incompleta ou autoridade inventada." },
    ],
    productionChecks: ["Produzir uma única versão do e-mail.", ...seed.checks],
    fallback: seed.fallback,
    limits: seed.limits,
    agencyResearch: seed.agencyResearch,
    proofGate: seed.proofGate,
    sourceLinks: seed.sourceLinks,
  }])
);

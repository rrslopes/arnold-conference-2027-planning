export type CutValidation = {
  id: string;
  speaker: string;
  sourceTitle: string;
  sourceUrl?: string;
  transcriptStatus: "Confirmado na transcrição" | "Tema confirmado; recorte reformulado";
  excerpt: string;
  location: string;
  productionNote: string;
  videoStatus: "Conferência no vídeo original pendente";
};

type CutAuditEntry = {
  validations: CutValidation[];
  overrides?: {
    origin?: string;
    idea?: string;
    optionLabel?: string;
    options?: string[];
    fallback?: string;
  };
};

const videoStatus = "Conferência no vídeo original pendente" as const;

const anaPlato: CutValidation = {
  id: "C01",
  speaker: "Ana Paula Pujol",
  sourceTitle: "Estratégias Nutricionais para Emagrecimento",
  sourceUrl: "https://www.youtube.com/watch?v=asItej-OIk8",
  transcriptStatus: "Confirmado na transcrição",
  excerpt: "Por que o paciente para de perder peso? ‘Ele está mentindo, ele não está seguindo a dieta’. Pode ser que sim, também, mas há um fator fisiológico envolvido, que é esse impulso biológico que bloqueia a perda de peso.",
  location: "Bloco aproximado 35:00–40:00, linha 165. A fonte de Ana Paula não possui timestamps nativos palavra a palavra.",
  productionNote: "Buscar essa sequência no bloco indicado e definir início e fim somente depois de assistir ao vídeo. Não usar a antiga formulação ‘falta de força de vontade’ como se fosse fala literal.",
  videoStatus,
};

const andreiaPreTreino: CutValidation = {
  id: "C02",
  speaker: "Andreia Naves",
  sourceTitle: "Update na Suplementação de Carboidratos: da Tecnologia à Ciência e Aplicação Prática",
  sourceUrl: "https://youtu.be/tAqcK_GgzD8",
  transcriptStatus: "Confirmado na transcrição",
  excerpt: "O que a gente entende como pré-treino, porque pré-treino, na verdade, já foi, tá desde lá das semanas que antecederam uma competição.",
  location: "15:18.9–15:27.6, linhas 320–323.",
  productionNote: "Conferir no vídeo o trecho de 15:18 a 15:35 para preservar a continuação sobre o pré-treino imediato e evitar uma frase interrompida.",
  videoStatus,
};

const robertoEstrutura: CutValidation = {
  id: "C03",
  speaker: "Roberto Tranjan",
  sourceTitle: "Academias em Alta Potência: de corpo, mente e alma",
  sourceUrl: "https://youtu.be/QSjVRVEvZMs",
  transcriptStatus: "Confirmado na transcrição",
  excerpt: "Se você continuar colocando toda essa força que você coloca no corpo, daqui a pouco a tua academia vai ter hérnia de disco. [...] Quem dá a direção é a mente.",
  location: "09:08.6–09:32.0, linhas 219–227.",
  productionNote: "Validar no vídeo se o intervalo de cerca de 23 segundos fica compreensível sozinho; se necessário, anteceder com uma identificação curta da metáfora corpo–mente–alma.",
  videoStatus,
};

const anaChamada: CutValidation = {
  id: "C04",
  speaker: "Ana Paula Pujol",
  sourceTitle: "Estratégias Nutricionais para Emagrecimento",
  sourceUrl: "https://www.youtube.com/watch?v=asItej-OIk8",
  transcriptStatus: "Confirmado na transcrição",
  excerpt: "A primeira delas é o efeito platô [...] O segundo é a prevenção de reganho, como que eu faço para esse paciente manter o peso reduzido por mais de um ano.",
  location: "Trecho inicial 00:00–29:58, linha 39; sem timestamp nativo exato.",
  productionNote: "Usar apenas como trecho curto de antecipação depois de localizar o ponto correspondente na íntegra.",
  videoStatus,
};

const andreiaCarboidrato: CutValidation = {
  id: "C05",
  speaker: "Andreia Naves",
  sourceTitle: "Update na Suplementação de Carboidratos: da Tecnologia à Ciência e Aplicação Prática",
  sourceUrl: "https://youtu.be/tAqcK_GgzD8",
  transcriptStatus: "Confirmado na transcrição",
  excerpt: "Quando a gente pensa dentro da nutrição, o carboidrato vai ser o rei.",
  location: "06:15.4–06:26 aproximadamente, linhas 109–113.",
  productionNote: "O tema existe em trecho curto. Conferir o vídeo e escolher uma frase que não fique dependente da metáfora anterior de treino e nutrição.",
  videoStatus,
};

const robertoTriade: CutValidation = {
  id: "C06",
  speaker: "Roberto Tranjan",
  sourceTitle: "Academias em Alta Potência: de corpo, mente e alma",
  sourceUrl: "https://youtu.be/QSjVRVEvZMs",
  transcriptStatus: "Confirmado na transcrição",
  excerpt: "A academia tem também alma, o espírito de time, de equipe [...] isso aqui tem o nome de tríade corpo, mente, alma, ou tríade CMA.",
  location: "08:15.1–08:38.2, linhas 203–208.",
  productionNote: "Trecho adequado para uma antecipação curta; conferir a passagem no vídeo e preservar a identificação de equipe e tríade.",
  videoStatus,
};

export const cutAuditByCalendarId: Record<string, CutAuditEntry> = {
  "0904": {
    validations: [anaPlato, andreiaPreTreino, robertoEstrutura],
    overrides: {
      origin: "Três possibilidades localizadas nas transcrições; recorte final ainda depende da conferência no vídeo",
      idea: "Escolher apenas uma das três falas auditadas abaixo. A transcrição confirma a existência textual; a equipe deve abrir a íntegra, conferir áudio e imagem e então definir 25–45 segundos com começo, desenvolvimento e conclusão.",
      optionLabel: "Cortes confirmados na transcrição — escolher um",
      options: [
        "Ana Paula Pujol: o platô pode envolver um ‘impulso biológico’ que bloqueia a perda de peso — bloco aproximado 35:00–40:00.",
        "Andreia Naves: o pré-treino começa nas semanas que antecedem a competição — conferir 15:18–15:35.",
        "Roberto Tranjan: a academia concentrada apenas no ‘corpo’ pode ter ‘hérnia de disco’; quem dá direção é a mente — conferir 09:08–09:32.",
      ],
    },
  },
  "0906": {
    validations: [anaChamada, andreiaCarboidrato, robertoTriade],
    overrides: {
      origin: "Montagem com três trechos temáticos localizados nas transcrições; cenas finais dependem de conferência no vídeo",
      optionLabel: "Trechos curtos confirmados na transcrição — usar os três",
      options: [
        "Ana Paula Pujol menciona efeito platô e prevenção de reganho no trecho inicial; localizar a passagem correspondente à linha 39.",
        "Andreia Naves afirma que, dentro da nutrição esportiva, ‘o carboidrato vai ser o rei’ — conferir 06:15–06:26.",
        "Roberto Tranjan relaciona alma ao espírito de equipe e apresenta a tríade corpo–mente–alma — conferir 08:15–08:38.",
      ],
    },
  },
  "0910": {
    validations: [anaPlato, andreiaPreTreino, robertoEstrutura],
    overrides: {
      origin: "Três possibilidades localizadas nas transcrições; usar a vencedora da escuta somente após conferir o vídeo",
      idea: "Selecionar a opção que recebeu maior interesse em 04/09 entre os três trechos auditados. A existência textual está confirmada; áudio, imagem, começo e fim precisam ser validados na íntegra antes da edição.",
      optionLabel: "Cortes confirmados na transcrição — escolher o mais demandado",
      options: [
        "Ana Paula Pujol: fator fisiológico e impulso biológico no efeito platô — bloco aproximado 35:00–40:00.",
        "Andreia Naves: o pré-treino começa nas semanas anteriores à competição — conferir 15:18–15:35.",
        "Roberto Tranjan: a metáfora da academia com ‘hérnia de disco’ e a mente como direção — conferir 09:08–09:32.",
      ],
    },
  },
  "0911": {
    validations: [{
      id: "C07",
      speaker: "Andreia Naves",
      sourceTitle: "Update na Suplementação de Carboidratos: da Tecnologia à Ciência e Aplicação Prática",
      sourceUrl: "https://youtu.be/tAqcK_GgzD8",
      transcriptStatus: "Confirmado na transcrição",
      excerpt: "Essa história [...] acima de 120 gramas por hora é, até agora, mais narrativa de marketing do que ciência sólida. Então cuidado com o marketing [...] com os géis cada vez mais concentrados.",
      location: "37:52.1–38:26 aproximadamente, linhas 905–919.",
      productionNote: "Se o corte substituir o carrossel, conferir no vídeo a passagem completa e manter a continuação sobre treinar intestino e músculo para não reduzir o argumento a uma frase de impacto.",
      videoStatus,
    }],
    overrides: {
      fallback: "Corte alternativo auditado na transcrição: Andreia Naves contrapõe doses acima de 120 g/h e géis concentrados à ciência e à adaptação fisiológica, em 37:52–38:26. Usar somente após conferir começo, fim, áudio e imagem no vídeo original.",
    },
  },
  "0921": {
    validations: [{
      id: "C08",
      speaker: "Andreia Naves",
      sourceTitle: "Update na Suplementação de Carboidratos: da Tecnologia à Ciência e Aplicação Prática",
      sourceUrl: "https://youtu.be/tAqcK_GgzD8",
      transcriptStatus: "Confirmado na transcrição",
      excerpt: "Acima de 120 gramas por hora é, até agora, mais narrativa de marketing do que ciência sólida.",
      location: "37:52.1–38:24, linhas 905–917.",
      productionNote: "Representa diretamente evidência versus narrativa de marketing; conferir no vídeo e preservar o contexto da dose discutida.",
      videoStatus,
    }, {
      id: "C09",
      speaker: "Bruno Zylber",
      sourceTitle: "Intervenções Microbiológicas no Atleta de Alto Rendimento",
      transcriptStatus: "Tema confirmado; recorte reformulado",
      excerpt: "Alvo errado: tratar exames de fezes, buscar normalizar um gráfico e seguir modismo genérico. [...] Alvo real: sustentar a alta performance, desenvolvimento individualizado [...].",
      location: "49:29.9–49:49.9, linhas 1359–1363.",
      productionNote: "A oposição ‘alvo errado/alvo real’ existe, mas a transcrição automática está truncada no final. Conferir o áudio antes de legendar e reformular o eixo como modismo genérico versus objetivo individualizado.",
      videoStatus,
    }, {
      id: "C10",
      speaker: "Daniel Coimbra",
      sourceTitle: "Caso Clínico: Estratégias Nutricionais em Corredores",
      transcriptStatus: "Tema confirmado; recorte reformulado",
      excerpt: "Meu cabelo cai, a minha libido tá no chão, eu não tenho força pra nada [...] mas eu me encaixei dentro dum padrão de beleza. O quanto isso vale?",
      location: "13:47.4–14:01.7, linhas 369–375.",
      productionNote: "Não apresentar como ‘desempenho imediato versus saúde sustentável’. O trecho real questiona o custo clínico de caber em um padrão de beleza; conferir o vídeo e usar esse enquadramento.",
      videoStatus,
    }],
    overrides: {
      fallback: "Há três buscas auditadas abaixo. Andreia sustenta ciência versus narrativa de marketing; Bruno exige conferência do áudio por truncamento textual; Daniel deve ser enquadrado como custo clínico de caber em um padrão de beleza. Nenhum corte está aprovado até a conferência no vídeo.",
    },
  },
  "0925": {
    validations: [{
      id: "C11",
      speaker: "Ana Paula Pujol",
      sourceTitle: "Estratégias Nutricionais para Emagrecimento",
      sourceUrl: "https://www.youtube.com/watch?v=asItej-OIk8",
      transcriptStatus: "Confirmado na transcrição",
      excerpt: "Nós precisamos de estratégias nutricionais para driblar o efeito platô [...] e para prevenir o reganho ponderal.",
      location: "Trecho inicial 00:00–29:58, linhas 49–51; sem timestamp nativo exato.",
      productionNote: "Localizar a passagem na íntegra e determinar o tempo real. A transcrição de Ana Paula tem intervalos aproximados, não marcação palavra a palavra.",
      videoStatus,
    }, {
      id: "C12",
      speaker: "Luisa Wolpe e Sullen Becher",
      sourceTitle: "Diferenças entre Celulite e Lipedema: Práticas Clínicas",
      transcriptStatus: "Confirmado na transcrição",
      excerpt: "A mulher pode, sim, ter a flacidez e a celulite. [...] Na flacidez, as irregularidades são lineares; na celulite, ovais ou em círculo.",
      location: "19:13.2–19:28.3, linhas 426–429.",
      productionNote: "Conferir a autoria da fala no vídeo e decidir se o corte tratará celulite versus flacidez. Não incluir lipedema neste recorte sem localizar uma passagem específica adicional.",
      videoStatus,
    }, {
      id: "C13",
      speaker: "Mika Yamaguchi",
      sourceTitle: "Impactos das mudanças climáticas na saúde sistêmica e na saúde da pele",
      transcriptStatus: "Confirmado na transcrição",
      excerpt: "Pensando no exposoma climático: poluição do ar [...] eventos extremos, incêndios florestais, tempestades de areia.",
      location: "13:47.5–14:04 aproximadamente, linhas 339–344.",
      productionNote: "Conferir no vídeo a continuidade até a relação com pele ou saúde; a enumeração sozinha pode precisar da frase seguinte para fechar o raciocínio.",
      videoStatus,
    }],
    overrides: {
      fallback: "Três cortes foram localizados nas transcrições e aparecem auditados abaixo. Escolher somente um depois de conferir a íntegra: platô/reganho com Ana Paula; celulite versus flacidez com Luisa/Sullen; exposoma climático com Mika.",
    },
  },
  "0927": {
    validations: [{
      id: "C14",
      speaker: "Gláucia Guarcello",
      sourceTitle: "Menos Forecast, Mais Foresight — ferramentas que ajudam líderes do fitness a inovar e decidir em tempos de incerteza",
      transcriptStatus: "Confirmado na transcrição",
      excerpt: "Baseado nos cenários, eu entendo as implicações pro meu negócio [...] Se esse cenário aqui acontecer, meu negócio fica de pé? [...] E eu vou revisando a minha estratégia pra ela ser à prova de mais cenários.",
      location: "41:38.1–42:04.0, linhas 935–943.",
      productionNote: "Conferir no vídeo original se o intervalo funciona sozinho e se os slides exigem contexto visual. Se necessário, abrir com lettering que explique ‘teste de cenários’ e preservar as duas perguntas sobre o negócio continuar de pé.",
      videoStatus,
    }],
    overrides: {
      fallback: "Se o trecho não funcionar sozinho depois da conferência no vídeo, usar o carrossel gráfico de seis cards. A transcrição sustenta o conceito; os exemplos de incerteza devem ser identificados como exercício editorial, não como fala literal de Gláucia ou previsão de mercado.",
    },
  },
};

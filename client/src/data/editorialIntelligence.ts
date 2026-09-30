export type ProgramSession = {
  time: string;
  speakers: string;
  title: string;
  materialStatus?: string;
  speakerAssets?: Array<{
    name: string;
    photo?: string;
    materialUrl?: string;
    social?: Array<{ label: string; url: string }>;
    note?: string;
  }>;
};

export type CongressProgram = {
  id: string;
  congress: string;
  status: "recebida" | "aguardando";
  statusLabel: string;
  date?: string;
  room?: string;
  source: string;
  sourceUrl?: string;
  assetSourceUrl?: string;
  note: string;
  sessions: ProgramSession[];
};

export type ConferenceCoordinator = {
  congressId: string;
  name: string;
  bio?: string;
  photo: string;
  social: Array<{ label: string; url: string }>;
  bioSource?: string;
};

export const confirmedProgramPublicationPolicy = {
  congresses: ["Nutrição Estética", "SONAFE — Simpósio de Fisioterapia Esportiva", "Nutrição Esportiva"],
  status: "Programações recebidas · divulgação de temas e nomes autorizada",
  allowed:
    "Os temas centrais podem ser usados em posts e e-mails quando melhorarem a jornada, o storytelling ou o avanço do público.",
  reserved:
    "Preservar para um lançamento próprio da programação: grade completa, sequência, horários, títulos integrais das sessões, composição completa de palestrantes e materiais ainda pendentes.",
  criterion:
    "Disponibilidade não cria obrigação editorial. Usar somente quando o tema tiver função clara na campanha e não substituir uma pauta mais forte.",
};

export const conferencePrograms2027: CongressProgram[] = [
  {
    id: "gestao",
    congress: "Gestão de Academias",
    status: "aguardando",
    statusLabel: "Aguardando programação 2027",
    source: "Programação e acervo de 2026 disponíveis como referência editorial",
    note: "Não converter os temas de 2026 em promessa da edição de 2027. Solicitar data, sala, horários, palestrantes, títulos e ementas assim que a grade avançar.",
    sessions: [],
  },
  {
    id: "wttc",
    congress: "Certificação Internacional em Personal Training – WTTC",
    status: "aguardando",
    statusLabel: "Aguardando programação 2027",
    source: "Conteúdo programático de 2026 disponível como referência",
    note: "A validade internacional é um diferencial central já confirmado: a certificação amplia a possibilidade de atuação profissional também fora do Brasil. A grade de 2027 ainda deverá confirmar módulos, docentes, entregas e os requisitos operacionais dessa mobilidade antes de pautas específicas.",
    sessions: [],
  },
  {
    id: "sonafe",
    congress: "SONAFE — Simpósio de Fisioterapia Esportiva",
    status: "recebida",
    statusLabel: "Programação 2027 recebida · temas e nomes liberados",
    date: "24 de abril de 2027",
    room: "Sala a confirmar",
    source: "Programação_Simposio_Sonafe_2027.xlsx · versão atualizada em 28/09/2026 (a anterior era de 18/09/2026)",
    sourceUrl: "https://docs.google.com/spreadsheets/d/150hh-unHEBioxo2sWwXElElFeZ2JNU75/edit?gid=59526583#gid=59526583",
    note: "Doze sessões, incluindo nove palestras em dupla e uma mesa-redonda. A versão de 28/09 acrescenta mini-CVs, pastas de foto e redes sociais de Larissa Pechincha, Giovana Steiner, Bruno Baroni e Fabricio Rapello: 19 dos 20 palestrantes das sessões têm materiais. Katherine Ferro: por orientação da planilha de 28/09, não divulgar por enquanto, nem na palestra com Bruno Baroni nem na mesa-redonda. A planilha divide o dia em três blocos; o bloco 2 usa o nome oficial da Copa do Mundo Feminina, que não entra nas artes (usar \"futebol feminino\"). Temas centrais e nomes podem ser divulgados, sem revelar a grade completa. O cliente confirmou a numeração oficial: 3º Simpósio (a planilha ainda diz 2º Simpósio).",
    sessions: [
      {
        time: "9h00",
        speakers: "Anderson José Santana",
        title: "Crioterapia no Esporte: novas perspectivas e caminhos",
        materialStatus: "Mini-CV, pasta de foto e Instagram recebidos.",
        speakerAssets: [{ name: "Anderson José Santana", materialUrl: "https://drive.google.com/drive/folders/1E7S4FFe3CtgJaDgTvx85vEbIsolZ967j?usp=drive_link", social: [{ label: "@anderson.oliveirafisio", url: "https://www.instagram.com/anderson.oliveirafisio/" }] }],
      },
      {
        time: "9h30",
        speakers: "Adriane Vanin",
        title: "Fotobiomodulação no Esporte: a luz no fim do túnel — evidências atuais",
        materialStatus: "Mini-CV, pasta de foto e redes sociais recebidos.",
        speakerAssets: [{ name: "Adriane Vanin", materialUrl: "https://drive.google.com/drive/folders/1wD2c42hok342BXtymdtZLp6y25fkm4Jw?usp=sharing", social: [{ label: "@adrianevanin", url: "https://www.instagram.com/adrianevanin/" }, { label: "@moveinsports", url: "https://www.instagram.com/moveinsports/" }] }],
      },
      {
        time: "10h00",
        speakers: "Leonardo Luiz Barretti Secchi e Priscila Alvarenga",
        title: "Ativação Muscular e Especificidade na Fisioterapia Esportiva. Por que não?",
        materialStatus: "Mini-CVs, pastas de foto e redes sociais dos dois palestrantes recebidos.",
        speakerAssets: [
          { name: "Leonardo Luiz Barretti Secchi", photo: "/manus-storage/leonardo-barretti_22460685.webp", materialUrl: "https://drive.google.com/drive/folders/1PvcMqmgKza4q4nDzG4670KCj290qXIw-?usp=drive_link", social: [{ label: "@fisio.leobarretti", url: "https://www.instagram.com/fisio.leobarretti/" }] },
          { name: "Priscila Alvarenga", materialUrl: "https://drive.google.com/drive/folders/1Lc-OlHic_mlIktpYW-jFb247Nn2WIibS?usp=drive_link", social: [{ label: "@prizcandidoalvarenga", url: "https://www.instagram.com/prizcandidoalvarenga/" }] },
        ],
      },
      {
        time: "10h30",
        speakers: "Paulo Ricardo Celestino Leite e Mariana Vido Corassini",
        title: "Controle de Carga nos MMSS: quando fazer o download ou upload?",
        materialStatus: "Mini-CVs, pastas de foto e redes sociais dos dois palestrantes recebidos.",
        speakerAssets: [
          { name: "Paulo Ricardo Celestino Leite", materialUrl: "https://drive.google.com/drive/folders/12OxnbkavM9TcW0rRhKh6RTVI8pVJ3pUp?usp=drive_link", social: [{ label: "@pauloleitefisio", url: "https://www.instagram.com/pauloleitefisio/" }] },
          { name: "Mariana Vido Corassini", materialUrl: "https://drive.google.com/drive/folders/1B_q9pMY_4TLs2_1g2qvl6oKi2vtm14DM?usp=drive_link", social: [{ label: "@ma_vido", url: "https://www.instagram.com/ma_vido/" }] },
        ],
      },
      {
        time: "11h00",
        speakers: "Marco Antônio Ferreira Alves e Cristina Alcantara",
        title: "Esportes paralímpicos: onde estamos após 10 anos do Rio 2016? O que falta mais?",
        materialStatus: "Mini-CVs, pastas de foto e redes sociais dos dois palestrantes recebidos.",
        speakerAssets: [
          { name: "Marco Antônio Ferreira Alves", materialUrl: "https://drive.google.com/drive/folders/1B3GUfD9wfLTAbQY3HObdkdm1jndDXU1-?usp=drive_link", social: [{ label: "@marquinho.fisio", url: "https://www.instagram.com/marquinho.fisio/" }] },
          { name: "Cristina Alcantara", materialUrl: "https://drive.google.com/drive/folders/14-sjIzy7jtTRTCqu8WAVSkq2Pnmq6H5t?usp=sharing", social: [{ label: "@crispaaalcantara", url: "https://www.instagram.com/crispaaalcantara/" }] },
        ],
      },
      {
        time: "14h00",
        speakers: "João Barboza e Larissa Pechincha",
        title: "Avaliação funcional do sistema musculoesquelético da mulher atleta de futebol",
        materialStatus: "Mini-CVs, pastas de foto e redes sociais dos dois palestrantes recebidos.",
        speakerAssets: [
          { name: "João Barboza", materialUrl: "https://drive.google.com/drive/folders/130fd-rnZW-0awcvQXMgIj_w2EsBfS8Sy?usp=drive_link", social: [{ label: "@profjoaobarboza", url: "https://www.instagram.com/profjoaobarboza/" }] },
          { name: "Larissa Pechincha", materialUrl: "https://drive.google.com/drive/folders/1AbiMNPjMzXh29S0GnbKSeQsrJrzhpXDO?usp=drive_link", social: [{ label: "@larissapechincha_", url: "https://www.instagram.com/larissapechincha_/" }] },
        ],
      },
      {
        time: "14h30",
        speakers: "Giovana Steiner e Rafael Ferrer",
        title: "Lesões nas crianças atletas de futebol",
        materialStatus: "Mini-CVs, pastas de foto e redes sociais dos dois palestrantes recebidos.",
        speakerAssets: [
          { name: "Giovana Steiner", materialUrl: "https://drive.google.com/drive/folders/1RirXqaRRbPFj1AKwgkMyzfPoPOhi-XL2?usp=drive_link", social: [{ label: "@giosteiner", url: "https://www.instagram.com/giosteiner/" }] },
          { name: "Rafael Ferrer", materialUrl: "https://drive.google.com/drive/folders/1kPP46qq5HUlvkHtdT6100Xm-Sbzld_EE?usp=drive_link", social: [{ label: "@orafaelferrer", url: "https://www.instagram.com/orafaelferrer/" }] },
        ],
      },
      {
        time: "15h00",
        speakers: "Bruno Baroni e Katherine Ferro",
        title: "Lesões de isquiotibiais no futebol feminino: considerações na avaliação e reabilitação da mulher atleta",
        materialStatus: "Mini-CV, pasta de foto e Instagram de Bruno Baroni recebidos. Katherine Ferro: não divulgar por enquanto, por orientação da planilha de 28/09.",
        speakerAssets: [
          { name: "Bruno Baroni", materialUrl: "https://drive.google.com/drive/folders/1uen6WG7nrYgH3zCu8X_3MW3lCDdQ-wxn?usp=drive_link", social: [{ label: "@bmbaroni", url: "https://www.instagram.com/bmbaroni/" }] },
          { name: "Katherine Ferro", note: "Não divulgar por enquanto (planilha de 28/09). Mini-CV, foto e rede social pendentes" },
        ],
      },
      {
        time: "15h30",
        speakers: "Fabricio Rapello e Jessica Fernandes",
        title: "Fatores intrínsecos e extrínsecos aplicados ao futebol de campo: o que a ciência sempre disse?",
        materialStatus: "Mini-CVs, pastas de foto e redes sociais dos dois palestrantes recebidos.",
        speakerAssets: [
          { name: "Fabricio Rapello", materialUrl: "https://drive.google.com/drive/folders/1Lfq5rTBkkbo_vfhB-Ge0En-9KfdVC12P?usp=drive_link", social: [{ label: "@fabriciorapello", url: "https://www.instagram.com/fabriciorapello/" }], note: "Grafia \"Rapello\" confirmada pelo Instagram, pelo currículo acadêmico e por publicações científicas (a planilha também traz \"Rapelo\")" },
          { name: "Jessica Fernandes", materialUrl: "https://drive.google.com/drive/folders/11iNmAxgwKwHOWfXfZMGjFz9iP9XXkIgn?usp=drive_link", social: [{ label: "@jefernandesfisio", url: "https://www.instagram.com/jefernandesfisio/" }] },
        ],
      },
      {
        time: "16h00",
        speakers: "Maria Eugênia Ortiz (Gegê) e Klever Shinji",
        title: "Mobilização miofascial: raciocínio clínico além da tensegridade aplicada ao quadril",
        materialStatus: "Mini-CVs e pastas de foto dos dois palestrantes recebidos; rede social informada somente para Klever.",
        speakerAssets: [
          { name: "Maria Eugênia Ortiz (Gegê)", materialUrl: "https://drive.google.com/drive/folders/1JC9VTrJWgpt7A3JPsyNNJMLzV7PqkRVb?usp=drive_link", note: "Mini-CV e pasta de foto recebidos; rede social não informada" },
          { name: "Klever Shinji", materialUrl: "https://drive.google.com/drive/folders/1YbYchFCakHekdO-2rRGOi-Iw0nBSlZZt?usp=drive_link", social: [{ label: "@klevershinji", url: "https://www.instagram.com/klevershinji/" }] },
        ],
      },
      {
        time: "16h30",
        speakers: "André Fujita e Bárbara Pocceschi",
        title: "Concussão no Esporte: onde estamos batendo a cabeça?",
        materialStatus: "Mini-CVs, pastas de foto e redes sociais dos dois palestrantes recebidos.",
        speakerAssets: [
          { name: "André Fujita", materialUrl: "https://drive.google.com/drive/folders/1vAfJU6izBnl94ZXhzm_7J_Z1uZAOiX-L?usp=drive_link", social: [{ label: "@andrefujita", url: "https://www.instagram.com/andrefujita/" }, { label: "@concussaobrasil", url: "https://www.instagram.com/concussaobrasil/" }] },
          { name: "Bárbara Pocceschi", materialUrl: "https://drive.google.com/drive/folders/1t67Crb4x_t5fEVeP-1pFMyV8tbn7D6Kl?usp=drive_link", social: [{ label: "@barbara.pocceschi", url: "https://www.instagram.com/barbara.pocceschi/" }] },
        ],
      },
      { time: "17h00–18h30", speakers: "Mariana Vido Corassini, Bárbara Pocceschi, Jessica Fernandes, Giovana Steiner, Maria Eugênia Ortiz (Gegê), Priscila Alvarenga, Katherine Ferro e João Barboza · Moderação: Bruno Baroni", title: "Mesa-redonda — Profissão Fisioterapeuta: da lesão ao Return to Play", materialStatus: "Katherine Ferro está na lista da planilha, mas não deve ser divulgada por enquanto." },
    ],
  },
  {
    id: "nutricao-estetica",
    congress: "Nutrição Estética",
    status: "recebida",
    statusLabel: "Programação 2027 recebida · temas e nomes liberados",
    date: "23 de abril de 2027",
    room: "Sala a confirmar",
    source: "Programação_Conference_NutriçãoEstética_2027.xlsx · versão atualizada na noite de 29/09/2026",
    sourceUrl: "https://docs.google.com/spreadsheets/d/1iHG54Dtw9X94F97Szq3xhf7CJjP7R8S9/edit?gid=1941859429#gid=1941859429",
    assetSourceUrl: "https://drive.google.com/drive/folders/1cbpsKRniKhToysrglTtyyCpQwPeHffcs?usp=drive_link",
    note: "Dez sessões; temas centrais e nomes podem ser divulgados seletivamente, sem revelar a grade completa. A versão de 18/09 acrescenta ementas em todas as sessões; a de 29/09 acrescenta pasta de foto e Instagram de Pedro Perim; a da noite de 29/09 traz os mesmos temas, nomes e títulos e acrescenta mini-CV, pasta de foto e Instagram do Dr. Leandro Lucena (a coluna de nomes da planilha ainda grafa \"Lucerna\"; o mini-CV e o Instagram confirmam \"Lucena\"). Os 17 palestrantes têm materiais. Formação de Luisa Wolpe conforme esta planilha: pós-graduada em Nutrição Clínica e mestre em Ciências da Saúde pela UFPR. Dez fotos inequivocamente identificadas no acervo já são exibidas; os demais links podem ser abertos para produção, mas não foram transformados em imagem sem verificação do arquivo.",
    sessions: [
      {
        time: "9h00",
        speakers: "Marília Lacerda",
        title: "Preparação metabólica para cirurgia plástica: reduzindo complicações e potencializando resultados",
        materialStatus: "Ementa, mini-CV, pasta de foto e Instagram recebidos.",
        speakerAssets: [{ name: "Marília Lacerda", photo: "/manus-storage/marilia-lacerda_ac73c731.webp", materialUrl: "https://drive.google.com/drive/folders/1Ob6vcT8rybwwPk0BFNV4FjL7VXljtXjA", social: [{ label: "@marilialacerda_", url: "https://www.instagram.com/marilialacerda_/" }] }],
      },
      {
        time: "9h40",
        speakers: "Gabriel Ximenes e Pedro Perim",
        title: "GLP-1 e Cirurgia Plástica: quem deve operar, quando operar e como preservar a massa muscular",
        materialStatus: "Ementa e materiais de Gabriel e Pedro recebidos.",
        speakerAssets: [
          { name: "Gabriel Ximenes", photo: "/manus-storage/gabriel-ximenes_6f58f713.webp", materialUrl: "https://drive.google.com/drive/folders/1E83ilqnxodL62bXf_WrviWue6YLnKW8N", social: [{ label: "@gabrieelximenes", url: "https://www.instagram.com/gabrieelximenes/" }] },
          { name: "Pedro Perim", materialUrl: "https://drive.google.com/drive/folders/1un3UBiobqIE5Lo1lNBh00yt3Uy8jt5ps?usp=drive_link", social: [{ label: "@pedroperim", url: "https://www.instagram.com/pedroperim/" }], note: "Pasta de foto e Instagram recebidos na planilha conferida em 29/09; imagem ainda não exibida sem conferência do arquivo" },
        ],
      },
      {
        time: "10h20",
        speakers: "Dr. Leandro Lucena e Luísa Wolpe",
        title: "Queda capilar além da ferritina: mitocôndria, inflamação e metabolômica — Ozempic Hair Loss: mito ou realidade?",
        materialStatus: "Ementa e materiais de Luísa e do Dr. Leandro Lucena recebidos (mini-CV, pasta de foto e Instagram dele chegaram na planilha da noite de 29/09).",
        speakerAssets: [
          { name: "Dr. Leandro Lucena", materialUrl: "https://drive.google.com/drive/folders/18wfC5L2Wn-L8YzPXuvBLxzI2YdgLBbQK?usp=drive_link", social: [{ label: "@drleandrolucena", url: "https://www.instagram.com/drleandrolucena/" }], note: "Médico da área capilar, pós-graduado em Transplante Capilar e Tricologia e professor de pós-graduação em transplante capilar (mini-CV da planilha da noite de 29/09); imagem ainda não exibida sem conferência do arquivo" },
          { name: "Luísa Wolpe", photo: "/manus-storage/luisa-wolpe_bbd86adc.webp", materialUrl: "https://drive.google.com/drive/folders/1-23eUUSb712ezjRSW85aP79A_sYRmR5z?usp=drive_link", social: [{ label: "@luwolpenutricionista", url: "https://www.instagram.com/luwolpenutricionista/" }] },
        ],
      },
      {
        time: "11h00",
        speakers: "Raquel Wolpe e Luísa Wolpe",
        title: "Lipedema 360°: da bioenergética ao tratamento físico",
        materialStatus: "Ementa, mini-CVs, pastas de foto e redes sociais das duas palestrantes recebidos.",
        speakerAssets: [
          { name: "Raquel Wolpe", materialUrl: "https://drive.google.com/drive/folders/1i0qOINSNMidV9hLQk3HTozdWSReN6rpJ?usp=drive_link", social: [{ label: "@raquelwolpefisio", url: "https://www.instagram.com/raquelwolpefisio/" }] },
          { name: "Luísa Wolpe", photo: "/manus-storage/luisa-wolpe_bbd86adc.webp", materialUrl: "https://drive.google.com/drive/folders/1-23eUUSb712ezjRSW85aP79A_sYRmR5z?usp=drive_link", social: [{ label: "@luwolpenutricionista", url: "https://www.instagram.com/luwolpenutricionista/" }] },
        ],
      },
      {
        time: "11h40",
        speakers: "Diogo Viana e Rodrigo Granzotti",
        title: "Impacto do uso de GLP-1 na resposta hormonal do paciente com lipedema",
        materialStatus: "Ementa, mini-CVs, pastas de foto e redes sociais dos dois palestrantes recebidos.",
        speakerAssets: [
          { name: "Diogo Viana", materialUrl: "https://drive.google.com/drive/folders/1FSxtY4fM_8zbzByWDeQh9xzqo2zCBZNB", social: [{ label: "@dr.diogoviana", url: "https://www.instagram.com/dr.diogoviana/" }], note: "Nova pasta atribuída a Diogo na planilha; imagem ainda não exibida sem conferência do arquivo" },
          { name: "Rodrigo Granzotti", materialUrl: "https://drive.google.com/drive/folders/1T4RCLogPkDy4qmRtIQIhNA8vXi1_3NvH?usp=drive_link", social: [{ label: "@rodrigo_nutricionista_", url: "https://www.instagram.com/rodrigo_nutricionista_/" }] },
        ],
      },
      {
        time: "14h00",
        speakers: "Suellen Becher, Dr. Vinicius Ortiz e Camila Barijan",
        title: "Estética e Nutrição Regenerativa: o futuro já começou",
        materialStatus: "Ementas, mini-CVs, pastas de foto e redes sociais dos três palestrantes recebidos.",
        speakerAssets: [
          { name: "Suellen Becher", photo: "/manus-storage/suellen-becher_4aba7087.webp", materialUrl: "https://drive.google.com/drive/folders/1LrCwiNQsChGfq1iP9gU0FKCjUt-TvZ0i", social: [{ label: "@suellenbecher", url: "https://www.instagram.com/suellenbecher/" }] },
          { name: "Dr. Vinicius Ortiz", photo: "/manus-storage/vinicius-ortiz_7859b087.webp", materialUrl: "https://drive.google.com/drive/folders/14xDoUMBjF7S00UeNJJvKxL13cieI_L4h", social: [{ label: "@drviniciusortiz", url: "https://www.instagram.com/drviniciusortiz/" }] },
          { name: "Camila Barijan", materialUrl: "https://drive.google.com/drive/folders/16QCckgExL-ML3oRqCB9WuI1h74noYsWI?usp=drive_link", social: [{ label: "@dracamilabarijanruiz", url: "https://www.instagram.com/dracamilabarijanruiz/" }] },
        ],
      },
      {
        time: "15h20",
        speakers: "Ana Paula Pujol",
        title: "Bioenergética Mitocondrial na Saúde da Mulher: implicações para metabolismo, envelhecimento e composição corporal",
        materialStatus: "Ementa, mini-CV, pasta de foto e Instagram recebidos.",
        speakerAssets: [{ name: "Ana Paula Pujol", photo: "/manus-storage/ana-paula-pujol_c9649a60.webp", materialUrl: "https://drive.google.com/drive/folders/1Ku_LPpWtnt8nji762YzGQnjopbWj2md2", social: [{ label: "@anapaulapujol", url: "https://www.instagram.com/anapaulapujol/" }] }],
      },
      {
        time: "16h00",
        speakers: "Andréia Naves",
        title: "Sistema Musculoesquelético e Longevidade: mobilidade, força e fáscia na saúde da mulher",
        materialStatus: "Ementa, mini-CV, pasta de foto e Instagram recebidos.",
        speakerAssets: [{ name: "Andréia Naves", photo: "/manus-storage/andreia-naves_fdd10266.webp", materialUrl: "https://drive.google.com/drive/folders/1a_jJtOn4Pux1oUpMLgXfFkvpLLnRcnZ9?usp=sharing", social: [{ label: "@andreia_naves", url: "https://www.instagram.com/andreia_naves/" }] }],
      },
      {
        time: "16h40",
        speakers: "Braian Cordeiro",
        title: "Metabolismo Invisível: o que a Calorimetria Indireta revela sobre a Estética Corporal",
        materialStatus: "Ementa, mini-CV, pasta de foto e Instagram recebidos.",
        speakerAssets: [{ name: "Braian Cordeiro", materialUrl: "https://drive.google.com/drive/folders/1bNJRIfRoWT1WAsvwYfRerfTK8mJToAID?usp=drive_link", social: [{ label: "@braiancordeiro", url: "https://www.instagram.com/braiancordeiro/" }] }],
      },
      {
        time: "17h20",
        speakers: "Faruk Kalil, Vanessa Erthal e Alessandra Pinheiro",
        title: "Performance Feminina e Estética de Alta Definição",
        materialStatus: "Ementas, mini-CVs, pastas de foto e redes sociais dos três palestrantes recebidos.",
        speakerAssets: [
          { name: "Faruk Kalil", photo: "/manus-storage/faruk-kalil_88627fd4.webp", materialUrl: "https://drive.google.com/drive/folders/1qDBLWCuIbVOpiQUpju4HFHlCXeNXYc5K", social: [{ label: "@prof.dr.farukkalil", url: "https://www.instagram.com/prof.dr.farukkalil/" }, { label: "@ekfprime", url: "https://www.instagram.com/ekfprime/" }] },
          { name: "Vanessa Erthal", photo: "/manus-storage/vanessa-erthal_5369a135.webp", materialUrl: "https://drive.google.com/drive/folders/1ohtvriD-Z1pDDMv1kS4jWmVKFJrjMMse", social: [{ label: "@vane_erthal", url: "https://www.instagram.com/vane_erthal/" }] },
          { name: "Alessandra Pinheiro", photo: "/manus-storage/alessandra-pinheiro_6e1e4de4.webp", materialUrl: "https://drive.google.com/drive/folders/1R2dRzR_-vHgPC8xATVOloC87TbKlagJg", social: [{ label: "@alessandrapinheiroifbbpro", url: "https://www.instagram.com/alessandrapinheiroifbbpro/" }] },
        ],
      },
    ],
  },
  {
    id: "nutricao-esportiva",
    congress: "Nutrição Esportiva",
    status: "recebida",
    statusLabel: "Programação 2027 recebida · temas e nomes liberados · ainda com espaços \"Em breve\"",
    date: "24 e 25 de abril de 2027",
    room: "Sala a confirmar",
    source: "Programação Nutrição Esportiva 2027 · planilha recebida do cliente em 25/09/2026",
    sourceUrl: "https://docs.google.com/spreadsheets/d/1WosiWfiABkEyGKTz2Lk6uaBi7HCUTNEu/edit",
    note: "Treze espaços na grade de dois dias, com cinco mesas-redondas. Ainda em definição: um horário no sábado (11h30), um horário no domingo (15h15) e dois palestrantes da mesa de proteínas. A planilha data o domingo como 26/04, mas o cabeçalho e o calendário indicam 25/04; usado 25/04. Títulos com erros de digitação foram corrigidos (Análogos, Prescrição, Planejamento, atuação do nutricionista). Materiais individuais identificados para 13 dos 23 palestrantes nomeados. Planilha conferida em 29/09: mesmos temas e nomes; o domingo continua datado como 26/04 e o Instagram de Paulo Mendes continua \"paulomendesmutri\". Temas centrais e nomes podem ser usados em posts e e-mails; grade completa, horários e títulos integrais não.",
    sessions: [
      {
        time: "Sáb 24/04 · 9h00–10h00",
        speakers: "Rosana Fortes (Strava), Marcos Paulo Reis (MPR Assessoria) e Andréia Naves · Moderação: Marcelo Quinn",
        title: "Mesa-redonda — O crescimento da corrida no Brasil",
        materialStatus: "Materiais de Andréia Naves e Marcelo Quinn recebidos; Rosana Fortes e Marcos Paulo Reis sem materiais individuais.",
        speakerAssets: [
          { name: "Rosana Fortes", note: "Mini-CV, foto e rede social pendentes" },
          { name: "Marcos Paulo Reis", note: "Mini-CV, foto e rede social pendentes" },
          { name: "Andréia Naves", photo: "/manus-storage/andreia-naves_fdd10266.webp", materialUrl: "https://drive.google.com/drive/folders/1a_jJtOn4Pux1oUpMLgXfFkvpLLnRcnZ9?usp=sharing", social: [{ label: "@andreia_naves", url: "https://www.instagram.com/andreia_naves/" }] },
          { name: "Marcelo Quinn", materialUrl: "https://drive.google.com/drive/folders/16CfOQH5R6b8mm6nDE8NkrJwJ94Jl1pCy?usp=sharing", social: [{ label: "@marceloquinn_", url: "https://www.instagram.com/marceloquinn_/" }, { label: "@qualitycastt", url: "https://www.instagram.com/qualitycastt/" }] },
        ],
      },
      {
        time: "Sáb 24/04 · 10h00–11h30",
        speakers: "Fernando Solera, Valden Capistrano e Petros",
        title: "Mesa-redonda — Intersecção entre doping e nutrição",
        materialStatus: "Temas das falas recebidos; mini-CVs, fotos e redes sociais pendentes.",
        speakerAssets: [
          { name: "Fernando Solera", note: "Mini-CV, foto e rede social pendentes" },
          { name: "Valden Capistrano", note: "Mini-CV, foto e rede social pendentes" },
          { name: "Petros", note: "Nome completo, mini-CV, foto e rede social pendentes" },
        ],
      },
      { time: "Sáb 24/04 · 11h30–12h30", speakers: "A definir", title: "Sessão em definição (\"Em breve\" na planilha)", materialStatus: "Aguardando palestrante e tema." },
      {
        time: "Sáb 24/04 · 14h00–15h30",
        speakers: "Dr. Ivan Lucas Picone, Ricardo Sodré e Fernanda Serpa",
        title: "Mesa-redonda — Análogos de GLP-1 e impacto na performance esportiva",
        materialStatus: "Descritivo, mini-CV, pasta de foto e Instagram de Ivan Lucas recebidos; Ricardo Sodré e Fernanda Serpa sem materiais individuais.",
        speakerAssets: [
          { name: "Dr. Ivan Lucas Picone", materialUrl: "https://drive.google.com/drive/folders/168VomvEAZtdl378VAfhA09APwvfMpXxi?usp=drive_link", social: [{ label: "@dr.ivanlucas", url: "https://www.instagram.com/dr.ivanlucas/" }] },
          { name: "Ricardo Sodré", note: "Mini-CV, foto e rede social pendentes" },
          { name: "Fernanda Serpa", note: "Mini-CV, foto e rede social pendentes" },
        ],
      },
      {
        time: "Sáb 24/04 · 15h30–16h00",
        speakers: "Diego Viana Gomes",
        title: "Uso de wearables na prática do nutricionista esportivo",
        materialStatus: "Mini-CV, pasta de foto e Instagram recebidos.",
        speakerAssets: [{ name: "Diego Viana Gomes", materialUrl: "https://drive.google.com/drive/folders/1fsOUN-m_wzeiy9A_oTQQne0iThgm0jqP?usp=drive_link", social: [{ label: "@doutordiegoviana", url: "https://www.instagram.com/doutordiegoviana/" }] }],
      },
      {
        time: "Sáb 24/04 · 16h00–17h30",
        speakers: "Roberta Carbonari, Rodrigo Lobo e Helvio Affonso (COB)",
        title: "Mesa-redonda — O futuro da tecnologia na prescrição do treinamento e do planejamento nutricional",
        materialStatus: "Descritivos e materiais de Rodrigo Lobo e Helvio Affonso recebidos; Roberta Carbonari sem materiais individuais.",
        speakerAssets: [
          { name: "Roberta Carbonari", note: "Mini-CV, foto e rede social pendentes" },
          { name: "Rodrigo Lobo", materialUrl: "https://drive.google.com/drive/folders/1jlH6DmPCrUtPalnVpJIE552cT2HoChxb?usp=drive_link", social: [{ label: "@rodrigolobo", url: "https://www.instagram.com/rodrigolobo/" }] },
          { name: "Helvio Affonso", materialUrl: "https://drive.google.com/drive/folders/1L2l8cbbdEzIdz-WiAx1O8eP_XOdzm0o6?usp=drive_link", social: [{ label: "@helvioaffonso", url: "https://www.instagram.com/helvioaffonso/" }] },
        ],
      },
      {
        time: "Sáb 24/04 · 17h30–18h10",
        speakers: "Murilo Pereira",
        title: "Novo consenso da avaliação intestinal e papel da nutrição na saúde gastrointestinal de atletas",
        materialStatus: "Descritivo, mini-CV, pasta de foto e Instagram recebidos.",
        speakerAssets: [{ name: "Murilo Pereira", materialUrl: "https://drive.google.com/drive/folders/190zZYUZrGEjwHj1eQwFzzVTFcO4vyIwi?usp=drive_link", social: [{ label: "@murilopereiraprofessor", url: "https://www.instagram.com/murilopereiraprofessor/" }] }],
      },
      {
        time: "Dom 25/04 · 9h00–10h00",
        speakers: "Adriano Cavalcanti",
        title: "Prática de monitoramento da glicemia por sensores e prescrição de carboidratos",
        materialStatus: "Descritivo, mini-CV, pasta de foto e Instagram recebidos.",
        speakerAssets: [{ name: "Adriano Cavalcanti Nóbrega", materialUrl: "https://drive.google.com/drive/folders/1skN2cR5wbZc26j3a_dRXoLLePk7ljU7y?usp=drive_link", social: [{ label: "@adrianocavalcantinobrega", url: "https://www.instagram.com/adrianocavalcantinobrega/" }] }],
      },
      {
        time: "Dom 25/04 · 10h00–11h30",
        speakers: "Danielli Mello e Andréia Naves",
        title: "Estratégias de avaliação da hidratação: das pesquisas para a aplicação ao mundo real",
        materialStatus: "Descritivo (com avaliação prática em um atleta, usando tecnologias vestíveis) e materiais das duas palestrantes recebidos.",
        speakerAssets: [
          { name: "Danielli Mello", materialUrl: "https://drive.google.com/drive/folders/12QdsL6HWBAF6h6brd4kk0FzmWb4QAhPa?usp=drive_link", social: [{ label: "@danielli.mello", url: "https://www.instagram.com/danielli.mello/" }] },
          { name: "Andréia Naves", photo: "/manus-storage/andreia-naves_fdd10266.webp", materialUrl: "https://drive.google.com/drive/folders/1a_jJtOn4Pux1oUpMLgXfFkvpLLnRcnZ9?usp=sharing", social: [{ label: "@andreia_naves", url: "https://www.instagram.com/andreia_naves/" }] },
        ],
      },
      {
        time: "Dom 25/04 · 11h30–12h30",
        speakers: "Paulo Mendes",
        title: "Estudo de caso: provas de longa distância e prática de nutrição e suplementação",
        materialStatus: "Mini-CV e pasta de foto recebidos; conferir o Instagram, que veio na planilha como \"paulomendesmutri\".",
        speakerAssets: [{ name: "Paulo Mendes", materialUrl: "https://drive.google.com/drive/folders/1DRaz430uYBTLxgE6rJ6_JNkVwwx_8fLw?usp=drive_link", note: "Instagram informado como \"paulomendesmutri\"; confirmar a grafia antes de marcar" }],
      },
      {
        time: "Dom 25/04 · 14h00–15h15",
        speakers: "Palestrante a definir, palestrante a definir e Kleidson Lobato",
        title: "Mesa-redonda — A demanda das proteínas para a prescrição e para a indústria",
        materialStatus: "Dois palestrantes ainda \"Em breve\" na planilha; Kleidson Lobato sem materiais individuais.",
        speakerAssets: [{ name: "Kleidson Lobato", note: "Mini-CV, foto e rede social pendentes" }],
      },
      { time: "Dom 25/04 · 15h15–16h00", speakers: "A definir", title: "Sessão em definição (\"Em breve\" na planilha)", materialStatus: "Aguardando palestrante e tema." },
      {
        time: "Dom 25/04 · 16h00–17h45",
        speakers: "Guilherme Rosa (Avaí FC), Amanda Brant (São Bernardo FC), Camila Mazetto (Ceará SC / Sub-17 feminino) e Marcela Mosconi (categorias de base da Seleção Feminina)",
        title: "Mesa-redonda — A atuação do nutricionista no futebol",
        materialStatus: "Descritivos e materiais de Guilherme Rosa, Amanda Brant e Camila Mazetto recebidos; Marcela Mosconi sem materiais individuais.",
        speakerAssets: [
          { name: "Guilherme Rosa", materialUrl: "https://drive.google.com/drive/folders/1FHyJYXaxMgigJyNgqxtB5KQHMkwxLOWS?usp=drive_link", social: [{ label: "@nutguirosa", url: "https://www.instagram.com/nutguirosa/" }] },
          { name: "Amanda Brant", materialUrl: "https://drive.google.com/drive/folders/1JgUiDZBdlQiZ5bwtivGlGNslBI5UbE4n?usp=drive_link", social: [{ label: "@aamandabrant", url: "https://www.instagram.com/aamandabrant/" }] },
          { name: "Camila Mazetto", materialUrl: "https://drive.google.com/drive/folders/15YRdz8UnY_LYV3ToJGFUWAW7Bi8WmKRU?usp=drive_link", social: [{ label: "@camilamazettonutri", url: "https://www.instagram.com/camilamazettonutri/" }] },
          { name: "Marcela Mosconi", note: "Mini-CV, foto e rede social pendentes" },
        ],
      },
    ],
  },
  {
    id: "bodybuilding",
    congress: "Bodybuilding",
    status: "aguardando",
    statusLabel: "Aguardando programação 2027",
    source: "Programação de 2026 disponível como referência temática",
    note: "Solicitar a grade de 2027 e matéria-prima dos palestrantes antes de prometer conteúdos sobre preparação, treino, nutrição, recuperação ou competição.",
    sessions: [],
  },
];

export const audienceAttractionAxes = [
  {
    id: "glp-cirurgia",
    congress: "Nutrição Estética",
    title: "GLP-1, cirurgia plástica e preservação de massa muscular",
    tension: "O emagrecimento medicamentoso muda o momento da cirurgia, a preparação metabólica e a proteção da massa muscular.",
    audience: "Nutricionistas clínicos e estéticos, profissionais ligados à cirurgia plástica e equipes que acompanham pacientes em uso de GLP-1.",
    sessions: "Preparação metabólica; GLP-1 e cirurgia plástica; calorimetria indireta.",
  },
  {
    id: "lipedema",
    congress: "Nutrição Estética",
    title: "Lipedema além do olhar exclusivamente estético",
    tension: "A dor central é diferenciar, avaliar e integrar metabolismo, bioenergética, hormônios e tratamento físico.",
    audience: "Nutricionistas, profissionais habilitados em estética e equipes multidisciplinares que atendem mulheres com suspeita ou diagnóstico de lipedema.",
    sessions: "Lipedema 360°; GLP-1 e resposta hormonal no lipedema.",
  },
  {
    id: "saude-mulher",
    congress: "Nutrição Estética",
    title: "Saúde da mulher, longevidade e composição corporal",
    tension: "Metabolismo, força, mobilidade, fáscia, envelhecimento e estética precisam ser tratados como uma jornada integrada.",
    audience: "Nutricionistas e profissionais de saúde que trabalham com mulheres adultas, envelhecimento saudável, força e composição corporal.",
    sessions: "Bioenergética mitocondrial; sistema musculoesquelético e longevidade; performance feminina.",
  },
  {
    id: "cabelo-pele",
    congress: "Nutrição Estética",
    title: "Queda capilar, pele e sinais que exigem investigação",
    tension: "Ferritina isolada e protocolos genéricos não explicam toda queda capilar nem todas as respostas da pele.",
    audience: "Profissionais de nutrição estética, saúde capilar, pele e acompanhamento de pacientes em emagrecimento.",
    sessions: "Queda capilar, mitocôndria, inflamação e metabolômica; nutrição regenerativa.",
  },
  {
    id: "regenerativa",
    congress: "Nutrição Estética",
    title: "Nutrição regenerativa e avaliação individualizada",
    tension: "O público procura critérios para decidir melhor, não mais um protocolo universal vendido como solução.",
    audience: "Nutricionistas e profissionais habilitados que desejam atualizar avaliação, raciocínio clínico e integração de condutas.",
    sessions: "Estética e nutrição regenerativa; bioenergética; calorimetria indireta.",
  },
  {
    id: "performance-feminina",
    congress: "Nutrição Estética",
    title: "Performance feminina e estética de alta definição",
    tension: "Definição corporal não pode ser reduzida a dieta, treino ou aparência sem considerar força, massa muscular, recuperação e saúde.",
    audience: "Nutricionistas esportivos e estéticos, treinadores e profissionais que acompanham mulheres em performance e composição corporal.",
    sessions: "Sistema musculoesquelético; calorimetria indireta; performance feminina e estética de alta definição.",
  },
  {
    id: "sonafe-avaliacao-recursos",
    congress: "SONAFE",
    title: "Avaliar antes de escolher o recurso",
    tension: "Crioterapia, fotobiomodulação, ativação muscular e mobilização miofascial perdem sentido quando aparecem antes da leitura do atleta, da modalidade e do objetivo.",
    audience: "Fisioterapeutas esportivos e equipes que precisam qualificar raciocínio clínico, avaliação e escolha contextualizada de recursos.",
    sessions: "Crioterapia; fotobiomodulação; ativação muscular e especificidade; mobilização miofascial.",
  },
  {
    id: "sonafe-carga-prevencao",
    congress: "SONAFE",
    title: "Carga, prevenção e fatores de risco",
    tension: "Prevenir não é apenas reagir à lesão: exige compreender carga, fatores intrínsecos e extrínsecos, fase esportiva e resposta individual.",
    audience: "Fisioterapeutas, preparadores e equipes multidisciplinares envolvidos em prevenção, monitoramento e progressão de atletas.",
    sessions: "Controle de carga nos membros superiores; fatores intrínsecos e extrínsecos no futebol.",
  },
  {
    id: "sonafe-futebol-feminino-base",
    congress: "SONAFE",
    title: "Futebol feminino e formação esportiva",
    tension: "Mulheres e crianças atletas exigem avaliação, prevenção e reabilitação que considerem contexto, desenvolvimento e demandas específicas do futebol.",
    audience: "Profissionais que atuam no futebol feminino, categorias de base, clubes, clínicas e projetos de desenvolvimento esportivo.",
    sessions: "Avaliação funcional da mulher atleta; lesões em crianças atletas; isquiotibiais no futebol feminino.",
  },
  {
    id: "sonafe-concussao-return-play",
    congress: "SONAFE",
    title: "Da lesão ao Return to Play",
    tension: "O retorno ao esporte exige decisões integradas, comunicação profissional e critérios que não terminam quando a dor diminui.",
    audience: "Fisioterapeutas esportivos, equipes clínicas e profissionais envolvidos em concussão, reabilitação e retorno ao jogo.",
    sessions: "Concussão no esporte; mesa-redonda Profissão Fisioterapeuta: da lesão ao Return to Play.",
  },
  {
    id: "esportiva-corrida-endurance",
    congress: "Nutrição Esportiva",
    title: "A corrida cresceu e o consultório mudou",
    tension: "O boom da corrida trouxe um novo paciente: amador, com provas longas, relógio no pulso e dúvidas sobre hidratação, carboidrato e suplementação.",
    audience: "Nutricionistas que atendem corredores, triatletas e praticantes de endurance, e assessorias esportivas.",
    sessions: "Mesa O crescimento da corrida no Brasil; estudo de caso em provas de longa distância; avaliação da hidratação.",
  },
  {
    id: "esportiva-doping-glp1",
    congress: "Nutrição Esportiva",
    title: "Doping, GLP-1 e os limites da performance",
    tension: "Onde termina o tratamento e começa a vantagem indevida? O nutricionista precisa entender o que é avaliado no atleta e o impacto das canetas de GLP-1 no esporte.",
    audience: "Nutricionistas e médicos que acompanham atletas de competição e pacientes em uso de GLP-1 que treinam.",
    sessions: "Mesa Intersecção entre doping e nutrição; mesa Análogos de GLP-1 e impacto na performance esportiva.",
  },
  {
    id: "esportiva-tecnologia-dados",
    congress: "Nutrição Esportiva",
    title: "Dados, sensores e tecnologia na prática do nutricionista esportivo",
    tension: "Wearables, sensores de glicose e biomarcadores de campo geram dados todos os dias; o desafio é interpretar sem extrapolar a evidência.",
    audience: "Nutricionistas esportivos, treinadores e equipes que monitoram carga, glicemia e recuperação.",
    sessions: "Wearables na prática do nutricionista; monitoramento da glicemia por sensores; mesa O futuro da tecnologia na prescrição do treinamento e do planejamento nutricional.",
  },
  {
    id: "esportiva-intestino-futebol",
    congress: "Nutrição Esportiva",
    title: "Intestino, futebol e a rotina de quem atende atletas",
    tension: "Da saúde gastrointestinal que limita o treino à rotina do nutricionista dentro de um clube, a sala discute a prática real do alto rendimento.",
    audience: "Nutricionistas que atuam ou querem atuar com atletas de clube, categorias de base e alto rendimento.",
    sessions: "Novo consenso da avaliação intestinal em atletas; mesa A atuação do nutricionista no futebol; mesa A demanda das proteínas para a prescrição e para a indústria.",
  },
];

export const conferenceCoordinators: ConferenceCoordinator[] = [
  {
    congressId: "nutricao-esportiva",
    name: "Andréia Naves",
    bio: "Diplomada pelo The Institute for Functional Medicine (USA); membro do Instituto Brasileiro de Nutrição Funcional; autora de livros em Nutrição Clínica e Esportiva Funcional e do Tratado de Nutrição Esportiva Funcional; CEO da Nutreex Clínica e da Experiência em Nutrição Esportiva de Excelência.",
    photo: "/manus-storage/andreia-naves_fdd10266.webp",
    social: [{ label: "@andreia_naves", url: "https://www.instagram.com/andreia_naves/" }],
  },
  {
    congressId: "nutricao-estetica",
    name: "Luisa Wolpe",
    bio: "Nutricionista, técnica em Estética Facial e Corporal, pós-graduada em Nutrição Clínica e mestre em Ciências da Saúde pela UFPR. Professora, coordenadora de pós-graduação, palestrante e mentora na área de Nutrição e Estética.",
    photo: "/manus-storage/luisa-wolpe_bbd86adc.webp",
    social: [{ label: "@luwolpenutricionista", url: "https://www.instagram.com/luwolpenutricionista/" }],
  },
  {
    congressId: "gestao",
    name: "Dudu Netto",
    bio: "Diretor Técnico e sócio da Bodytech Company, mestre em Ciência da Motricidade Humana e especialista em Ciência do Exercício. Atua em programas, inovação e estratégias para o mercado fitness.",
    photo: "/manus-storage/dudu-netto_304f80bf.webp",
    social: [{ label: "@nettodudu", url: "https://www.instagram.com/nettodudu/" }],
  },
  {
    congressId: "wttc",
    name: "Cris Parente",
    bio: "CEO da World Top Trainers Certification; eleito Melhor Personal Trainer do Mundo pelo American Council on Exercise; professor da pós-graduação em Personal Training da USP e professor formador na Comunidade Europeia.",
    photo: "/manus-storage/cris-parente_5188fbbf.webp",
    social: [
      { label: "@crisparente", url: "https://www.instagram.com/crisparente/" },
      { label: "@worldtoptrainers", url: "https://www.instagram.com/worldtoptrainers/" },
    ],
  },
  {
    congressId: "sonafe",
    name: "Leonardo Luiz Barretti Secchi",
    bio: "Fisioterapeuta, doutor em Fisioterapia pela UFSCar, mestre em Ciências da Saúde pela FMUSP e especialista em Reabilitação Aplicada ao Esporte pela UNIFESP/CETE. Membro da SONAFE/SP, Diretor Científico da SONAFE Brasil 2026–2027, docente e fisioterapeuta clínico.",
    bioSource: "Mini-CV complementado pela programação SONAFE 2027",
    photo: "/manus-storage/leonardo-barretti_22460685.webp",
    social: [{ label: "@fisio.leobarretti", url: "https://www.instagram.com/fisio.leobarretti/" }],
  },
  {
    congressId: "sonafe",
    name: "Rafael Fernandes Temoteo",
    bio: "Fisioterapeuta, mestre em Bioengenharia, especialista em Terapia Manual e Postural, coordenador de pós-graduação em Podoposturologia Clínica e Funcional, professor e presidente da Sociedade Nacional de Fisioterapia Esportiva e Atividade Física.",
    photo: "/manus-storage/rafael-temoteo_55ffba79.webp",
    social: [{ label: "@sonafebrasil", url: "https://www.instagram.com/sonafebrasil/" }],
  },
  {
    congressId: "bodybuilding",
    name: "Ricardo Pannain",
    photo: "/manus-storage/ricardo-pannain_a4e799c5.webp",
    social: [{ label: "@ricardopannain", url: "https://www.instagram.com/ricardopannain/" }],
  },
];

export const speakerContentRequests = [
  { stage: "Base editorial", item: "Ementa em 5 a 8 linhas e três aprendizados centrais", purpose: "Transformar o título em pauta sem inventar o conteúdo técnico." },
  { stage: "Dor do público", item: "Três perguntas frequentes, erros ou decisões difíceis que a palestra enfrenta", purpose: "Criar ganchos de campanha conectados à prática profissional." },
  { stage: "Prova técnica", item: "Referências, dados, slides e limites das alegações", purpose: "Evitar recomendações universais, simplificações e promessas clínicas indevidas." },
  { stage: "Ativos", item: "Minibiografia, foto, cargo, redes sociais e forma correta de crédito", purpose: "Produzir cards, páginas e marcações sem retrabalho de aprovação." },
  { stage: "Vídeo curto", item: "Resposta vertical de 30 a 60 segundos a uma pergunta previamente definida", purpose: "Gerar conteúdo original de 2027 sem depender apenas do acervo anterior." },
  { stage: "Reaproveitamento", item: "Uma frase-chave, um caso sem identificação e um ponto que não deve ser retirado de contexto", purpose: "Orientar Reels, carrosséis e e-mails com segurança editorial." },
  { stage: "Governança", item: "Responsável pela aprovação, prazo e autorização de uso", purpose: "Fechar o fluxo entre palestrante, coordenação, agência e cliente." },
];

export const nutritionAesthetic2026Priorities = [
  {
    priority: "Uso imediato",
    tone: "ready",
    title: "Luisa Wolpe e Suellen Becher — Diferenças entre Celulite e Lipedema",
    transcript: "Transcrição validada disponível",
    bridge: "Ponte direta com Lipedema 360° e apoio ao debate sobre GLP-1 no lipedema.",
    nextUse: "Já pode orientar carrossel comparativo, e-mail temático e seleção de corte; o Reel ainda exige conferência no vídeo original.",
  },
  {
    priority: "Transcrever primeiro",
    tone: "high",
    title: "Alessandra Feltre — GLP-1 e o Novo Rosto do Emagrecimento em Mulheres 40+",
    transcript: "Íntegra disponível · sem transcrição",
    bridge: "Ponte direta com GLP-1, cirurgia plástica, lipedema, saúde da mulher e preservação de massa muscular.",
    nextUse: "Maior prioridade para descobrir falas, critérios e perguntas que aqueçam três sessões de 2027.",
  },
  {
    priority: "Transcrever primeiro",
    tone: "high",
    title: "Alessandra Pinheiro — Glúteo: Dieta e Treino para Hipertrofia e Definição",
    transcript: "Íntegra disponível · sem transcrição",
    bridge: "Ponte direta com performance feminina, estética de alta definição, força e composição corporal.",
    nextUse: "Prioridade alta para pautas de atração; validar se a aula entrega critérios aplicáveis sem promessa estética universal.",
  },
  {
    priority: "Uso imediato",
    tone: "ready",
    title: "Ana Paula Pujol — Estratégias Nutricionais para Emagrecimento",
    transcript: "Transcrição consolidada disponível",
    bridge: "Base complementar para metabolismo, platô, bioenergética, calorimetria e composição corporal.",
    nextUse: "Pode orientar pautas agora, desde que a conexão com 2027 seja apresentada como continuidade temática e não como repetição de palestra.",
  },
  {
    priority: "Segunda onda",
    tone: "medium",
    title: "Raquel Wolpe e Camila Barijan — Como Melhorar a Pele de Atletas?",
    transcript: "Íntegra disponível · sem transcrição",
    bridge: "Conteúdo complementar para nutrição regenerativa, pele, performance e estética de alta definição.",
    nextUse: "Transcrever depois dos dois temas prioritários para procurar pontes específicas com a presença de Camila em 2027.",
  },
  {
    priority: "Segunda onda",
    tone: "medium",
    title: "Olívia Fernandes e Adam Abbas — Acne em Usuários de Hormônios Anabolizantes",
    transcript: "Íntegra disponível · sem transcrição",
    bridge: "Complemento para performance, estética de alta definição e limites de atuação multidisciplinar.",
    nextUse: "Útil como pauta especializada, mas não é eixo central da programação recebida de 2027.",
  },
  {
    priority: "Banco editorial",
    tone: "low",
    title: "Mika Yamaguchi — Mudanças Climáticas, Saúde Sistêmica e Pele",
    transcript: "Transcrição validada disponível",
    bridge: "Autoridade complementar para pele, ambiente e visão sistêmica; baixa aderência aos maiores gatilhos comerciais de 2027.",
    nextUse: "Aproveitar quando a pauta pedir diferenciação ou contexto; não precisa ocupar a frente da próxima campanha.",
  },
  {
    priority: "Banco editorial",
    tone: "low",
    title: "Fabricio Assini — Influência da Saúde Mental na Estética",
    transcript: "Íntegra disponível · sem transcrição",
    bridge: "Tema transversal de comportamento e adesão, mas sem correspondência direta com os títulos confirmados de 2027.",
    nextUse: "Transcrever depois das ondas prioritárias, caso a equipe queira uma pauta de humanização ou adesão.",
  },
];

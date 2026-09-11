# Validação da contingência sem data fixa

## Estado visual verificado

- **Desktop — hero e navegação:** o chip lateral apresenta “Data em confirmação” e o hero mostra “D-7 → D0 / Janela móvel / Data a confirmar”, sem exibir 23/09 ou horário comercial.
- **Desktop — Mídia Paga:** o módulo mantém quatro packs, zero peças exclusivas aprovadas e apresenta a janela D-7 a D0 como bloco operacional condicionado. O painel preserva a identidade Arnold e mantém boa hierarquia entre comando, gates e packs.
- **Mobile — hero:** o título, os dois CTAs e os cards iniciais permanecem legíveis em 390 px; o menu móvel continua acessível. Não foi identificada sobreposição ou corte de texto na primeira dobra.
- **Calendário — 15/09:** o briefing apresenta oito blocos completos, encerra com cadastro para novidades e exibe “Data em confirmação” no contexto da plataforma. O destino LEMBRETE aparece ligado à LP geral e LOTE permanece isolado como pendente.
- **Calendário — 18/09:** o carrossel está decupado em oito cards e a sequência contém apenas duas enquetes no dia — Gestão de Academias e WTTC — com respostas clicáveis explícitas.
- **Calendário — 23/09:** há uma única pauta multiformato de SONAFE. O conteúdo principal apresenta avaliação, carga, prevenção, integração e continuidade; os três Stories são apoio opcional dentro da mesma ativação, não publicações adicionais. A pauta exige revisão técnica e conduz à lista de novidades, sem preço, lote, checkout ou promessa de venda.
- **Referências audiovisuais:** as seis pautas dependentes de acervo exibem título oficial da íntegra de 2026, minutagem/faixa auditada, excerto, orientação de uso e status de conferência. Os links aparecem somente para as três masterclasses cujas URLs foram fornecidas.
- **Programação SONAFE 2027:** doze sessões exibidas em 24/04/2027; nove palestras preservam os dois palestrantes, e a mesa-redonda mantém participantes e moderação. O dashboard sinaliza a divergência entre “2º” e “3º Simpósio” encontrada nas fontes.
- **Coordenação científica:** sete coordenadores exibidos dentro da programação correspondente, com fotos otimizadas, mini-CV quando fornecido e perfis sociais. SONAFE apresenta Leonardo Luiz Barretti Secchi e Rafael Fernandes Temoteo; Ricardo Pannain mantém o aviso de mini-CV ausente.
- **Mobile:** a pauta única de 23/09 e o seletor SONAFE permanecem legíveis em 390 px; a seleção direta por URL permite revisar a sala sem interação prévia.

## Validação técnica concluída

- TypeScript sem erros.
- **166 testes aprovados** em 29 arquivos.
- Build de produção concluído.
- Avisos de build limitados às fontes servidas por `/manus-storage` e ao tamanho do bundle já existente; nenhum erro bloqueante.

## Estado da rodada

Validação concluída; versão pronta para checkpoint e revisão do cliente.

## Auditoria de duplicidade após a contingência

A comparação considerou título, promessa, argumento central, formato, fonte, CTA, público e sequência de Stories entre 31/08 e 27/09, além da janela móvel. Foram corrigidas três sobreposições comprovadas: 18/09 deixou de repetir os seis perfis e passou a demonstrar profundidade pelas programações recebidas; 22/09 deixou de repetir “copiar preparação” e passou a mostrar a equipe multidisciplinar relatada por Ricardo Pannain; 23/09 deixou de repetir avaliação/recovery e passou a explorar diferentes populações e modalidades da programação SONAFE. A pauta de 24/09 virou checklist de quatro critérios, e D-5 só ganha novo post se houver informação incremental aprovada. A sequência das masterclasses e os Stories segmentados de 18–20/09 foram mantidos por cumprirem progressão de funil e divisão de públicos, não duplicidade.

Validação final: TypeScript sem erros, **171 testes aprovados** em 30 arquivos, build concluído e nenhum erro recente em servidor, console ou rede.

## Clareza operacional de Objetivos e Validação

O painel agora explica que os KPIs detalhados permanecem nas áreas de origem e que cada objetivo recebe somente três registros: critério de sucesso, resultado observado e evidência com período e próximo ajuste. Cada um dos sete cards informa **o que preencher**, **como obter**, **quando atualizar**, exemplos específicos e a regra para marcar a etapa como validada. Os botões Atualizar, Limpar e Salvar para a equipe foram explicados no próprio painel. Uma nova validação exige os três campos preenchidos; registros anteriormente salvos permanecem preservados e podem ser desmarcados normalmente.

Validação final desta rodada: TypeScript sem erros, **176 testes aprovados** em 31 arquivos, build concluído, revisão desktop/mobile e nenhum erro recente em servidor, console ou rede.

## Correção de sobreposição no WhatsApp

O lettering “Alta intenção. Baixo ruído.” utilizava `position: sticky` como filho direto da seção inteira. Como o formulário de performance pertencia ao mesmo grid, o limite do sticky incluía também o painel branco e permitia que o título o atravessasse durante a rolagem. O bloco estratégico passou a ter um contêiner próprio, reunindo somente lettering, fluxo e regra; o formulário permanece fora desse limite. A composição inicial foi preservada, o sticky continua ativo apenas no trecho estratégico em desktop e é desativado abaixo de 860 px.

Validação final desta rodada: TypeScript sem erros, **179 testes aprovados** em 32 arquivos, build concluído, rolagem real verificada no formulário, revisão em desktop, tablet e mobile e nenhum erro recente em servidor, console ou rede.

## Logs

Após a navegação pelo hero, Mídia Paga, cards de 15/09, 18/09, 23/09, referências de corte e programação SONAFE, não foram encontrados erros no servidor, avisos ou erros no console do navegador, nem respostas HTTP 4xx/5xx nas requisições recentes.

## Sincronização manual da LP de masterclasses

Foi implantada uma integração servidor → servidor com o endpoint agregado do Lovable. A Central de Landing Pages agora permite escolher o período e usar **Sincronizar agora** sem expor o token ou transportar nome, e-mail e telefone. A resposta é validada por contrato estrito, cada aula é mapeada pelo slug, a taxa de conversão é recalculada internamente e a chave composta por origem, início e fim impede duplicidade.

A primeira sincronização real criou a fotografia de 01 a 11/09/2026. Uma segunda execução do mesmo período atualizou o registro, preservando o histórico com somente duas fotografias totais — a manual anterior e a automática. A interface identifica a origem Lovable, mostra a atualização do fornecedor, espectadores únicos, média assistida e sete origens agregadas. O índice de acessos à recompensa foi renomeado para esclarecer que eventos repetidos podem superar 100%.

Validação desta rodada: credencial aceita pelo endpoint, persistência idempotente confirmada no banco, TypeScript sem erros, **187 testes aprovados** em 35 arquivos, build concluído, revisão desktop/mobile e nenhum erro recente após a migração.

## Fuso da sincronização — Brasília

Às 23h40 de 10/09/2026 em Brasília, o servidor já operava em 11/09 UTC. O período padrão do botão usava o relógio local do navegador/servidor e avançava indevidamente para 11/09. O Lovable já devolvia `atualizado_em` como timestamp ISO UTC correto: `2026-09-11T02:43:04.681Z` corresponde a 10/09/2026 às 23:43 em Brasília e não deve receber deslocamento manual adicional.

A plataforma passou a tratar início e fim como datas civis de `America/Sao_Paulo`, mantendo a representação neutra ao meio-dia UTC apenas para persistência. Timestamps absolutos de atualização continuam armazenados em epoch e são exibidos explicitamente em Brasília. O limite dos campos e a validação do servidor bloqueiam 11/09 enquanto o dia civil vigente em Brasília ainda é 10/09, independentemente do fuso do navegador.

A fotografia correta de 01 a 10/09 foi sincronizada. Após confirmação do usuário, a fotografia incorreta de 01 a 11/09, criada durante o teste anterior, foi excluída pelo fluxo normal da plataforma. O banco ficou com duas fotografias: a automática de 01–10/09 e a manual histórica de 08–09/09.

Validação desta rodada: fronteira de 23h40 coberta por testes, **192 testes aprovados** em 37 arquivos, TypeScript sem erros, build concluído, banco conferido, revisão desktop/mobile e nenhum erro recente em servidor, console ou rede.

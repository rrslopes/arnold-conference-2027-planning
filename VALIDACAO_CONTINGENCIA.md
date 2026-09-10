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

## Logs

Após a navegação pelo hero, Mídia Paga, cards de 15/09, 18/09, 23/09, referências de corte e programação SONAFE, não foram encontrados erros no servidor, avisos ou erros no console do navegador, nem respostas HTTP 4xx/5xx nas requisições recentes.

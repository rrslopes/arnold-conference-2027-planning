# Validação da contingência sem data fixa

## Estado visual verificado

- **Desktop — hero e navegação:** o chip lateral apresenta “Data em confirmação” e o hero mostra “D-7 → D0 / Janela móvel / Data a confirmar”, sem exibir 23/09 ou horário comercial.
- **Desktop — Mídia Paga:** o módulo mantém quatro packs, zero peças exclusivas aprovadas e apresenta a janela D-7 a D0 como bloco operacional condicionado. O painel preserva a identidade Arnold e mantém boa hierarquia entre comando, gates e packs.
- **Mobile — hero:** o título, os dois CTAs e os cards iniciais permanecem legíveis em 390 px; o menu móvel continua acessível. Não foi identificada sobreposição ou corte de texto na primeira dobra.
- **Calendário — 15/09:** o briefing apresenta oito blocos completos, encerra com cadastro para novidades e exibe “Data em confirmação” no contexto da plataforma. O destino LEMBRETE aparece ligado à LP geral e LOTE permanece isolado como pendente.
- **Calendário — 18/09:** o carrossel está decupado em oito cards e a sequência contém apenas duas enquetes no dia — Gestão de Academias e WTTC — com respostas clicáveis explícitas.
- **Calendário — 23/09:** o conteúdo principal de SONAFE apresenta avaliação, carga, prevenção, integração e continuidade; exige revisão técnica e conduz à lista de novidades, sem preço, lote, checkout ou promessa de venda.

## Validação técnica concluída

- TypeScript sem erros.
- **161 testes aprovados** em 29 arquivos.
- Build de produção concluído.
- Avisos de build limitados às fontes servidas por `/manus-storage` e ao tamanho do bundle já existente; nenhum erro bloqueante.

## Pontos ainda a concluir antes do checkpoint

- Salvar o checkpoint contingencial.

## Logs

Após a navegação pelo hero, Mídia Paga e pelos cards de 15/09, 18/09 e 23/09, não foram encontrados erros no servidor, avisos ou erros no console do navegador, nem respostas HTTP 4xx/5xx nas requisições recentes.

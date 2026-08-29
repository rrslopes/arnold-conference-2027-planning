# Validação do fluxo editorial colaborativo

## Modelo e persistência

A tabela `calendar_workflow` armazena uma linha por pauta, com legenda, link HTTPS da arte, status e horário da última atualização. A rota de gravação é pública, como os demais painéis colaborativos, e não exige nem exibe nome de responsável.

O teste de integração salvou o registro em uma sessão anônima, leu e alterou em uma segunda sessão e confirmou a atualização na primeira. O identificador temporário `9999` foi removido ao final; consulta direta confirmou ausência de dados de QA.

## Estados

Os 16 estados estão organizados em seis grupos sequenciais: fila, produção inicial, aprovação do cliente, ajustes solicitados, finalização e publicado. Os rótulos e as cores distinguem explicitamente **Agência**, **Cliente** e **Social**, sem depender do nome de uma pessoa.

## Interface

Cada card apresenta um status resumido. Ao expandir, há textarea de legenda, campo de link, seletor agrupado, botão para abrir a arte, atualização manual e salvamento. A interface mostra alterações locais pendentes, confirmação de sincronização e data da última atualização compartilhada.

## Segurança e responsividade

O link pode ficar vazio, mas, quando informado, precisa começar por HTTPS. Protocolos inseguros e entradas inválidas são rejeitados no cliente e na API. Em 375 px, legenda, link, status e ações são empilhados em uma coluna; o menu móvel e os demais briefings permanecem intactos.

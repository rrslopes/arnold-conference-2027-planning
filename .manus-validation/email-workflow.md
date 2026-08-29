# Validação do fluxo de aprovação dos e-mails

- A seção de e-mail abre pelo menu lateral e preserva as três abas existentes.
- Os cards de campanha exibem o novo resumo “Aprovação do e-mail”, a descrição “Link da prévia e status compartilhados” e o estado inicial “Não foi feito”.
- O bloco aparece dentro do card do envio, abaixo da regra editorial, sem substituir público, objetivo, materiais e CTA.
- A leitura geral permanece coerente com a identidade visual da plataforma.
- Próxima verificação: abrir o bloco, inspecionar campo HTTPS, grupos de status, ações e versão móvel.

## Bloco expandido

O primeiro e-mail de campanha foi aberto no viewport desktop. O painel apresenta o campo de URL, o seletor “Status do e-mail”, os botões Atualizar e Salvar e a mensagem de primeiro registro. O estado “Não foi feito” aparece tanto no resumo fechado quanto no seletor aberto, e os controles ocupam a largura útil do card sem substituir o planejamento estratégico.

O campo usa entrada de URL com indicação `https://`, e Salvar permanece desabilitado enquanto não há mudança local. Os cards seguintes exibem o mesmo resumo fechado, evitando que os controles dominem visualmente a linha do tempo.

## Sequência das masterclasses

A aba de nutrição foi aberta no desktop e os sete e-mails apresentam o mesmo resumo de aprovação. O componente se adapta ao grid de três colunas e preserva o CTA, a condição de envio e a numeração da sequência. Assim, os nove e-mails de campanha e os sete e-mails de nutrição compartilham a mesma lógica de link e status, mas mantêm registros independentes.

## Persistência compartilhada

O teste de integração gravou link e status em uma sessão anônima, leu o registro em outra sessão, atualizou pela segunda sessão e confirmou o novo valor na primeira. O registro de QA usa identificador isolado e é removido ao final da suíte. A execução consolidada aprovou 61 testes em 14 arquivos.

## Mobile e integridade

A captura full-page em 375 × 812 confirma que a seção permanece navegável no breakpoint móvel, com cards empilhados e os resumos de aprovação contidos na largura disponível. A consulta final ao banco retornou zero registros com o prefixo de QA, confirmando que o teste não deixou dados temporários na operação real.

## Links diretos de revisão

O parâmetro `email-review=email-base-reativacao` abriu diretamente o primeiro e-mail de campanha no desktop. A captura confirma, no mesmo viewport, o resumo do estado “Não foi feito”, o campo de link para aprovação, o seletor de status e as ações Atualizar e Salvar. O card seguinte mantém seu resumo fechado, comprovando que a expansão é individual.

O parâmetro `email-review=email-nurture-imediato` selecionou automaticamente a aba “Sequência das masterclasses” e abriu o primeiro dos sete e-mails de nutrição. A captura desktop mostra o link, o seletor, Atualizar e Salvar dentro do primeiro card, enquanto os cards seguintes conservam o resumo fechado. Com isso, os dois fluxos foram inspecionados diretamente, e não apenas inferidos pelos testes estáticos.

As capturas móveis automatizadas não respeitaram a rolagem assíncrona nem a âncora interna e registraram apenas o topo da página. Por isso, elas não serão usadas como evidência dos cards; a validação móvel será repetida com captura dedicada após o carregamento e a rolagem do componente.

## Validação móvel dedicada

Uma sessão isolada do navegador foi configurada em 375 × 812, aguardou o carregamento e rolou diretamente até cada card. No primeiro e-mail de campanha, a captura confirma objetivo, CTA, resumo “Não foi feito”, campo de link, seletor, Atualizar, Salvar e mensagem de primeiro registro, todos dentro da largura móvel. No primeiro e-mail de nutrição, a captura confirma o mesmo conjunto de controles, com o segundo card começando abaixo e sem sobreposição. Assim, os nove e-mails de campanha e os sete de nutrição compartilham o mesmo componente responsivo validado em cada fluxo.

## Evidência final isolada

O modo de revisão por parâmetro passou a renderizar somente a seção de e-mail e um único envio. Em desktop, as capturas dos dois fluxos mostram simultaneamente o resumo “Não foi feito”, o link HTTPS, o seletor de status e as ações Abrir prévia, Atualizar e Salvar. O card de nutrição foi ampliado no modo de revisão para eliminar a compressão do grid de três colunas.

Em 375 × 812, o modo de revisão oculta apenas os elementos editoriais auxiliares e mantém integralmente o painel funcional. As duas capturas mostram os mesmos controles sem recorte, sobreposição ou rolagem horizontal. A experiência normal da plataforma permanece inalterada; esse foco é ativado somente por `email-review`.

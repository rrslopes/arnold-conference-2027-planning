# Validação do menu lateral

## Desktop expandido

O bloco “Sincronização ativa / Responsável” e o campo de nome não aparecem mais. O controle **Recolher** está visível no topo da navegação, com rótulo acessível e contraste suficiente.

## Desktop recolhido

Ao acionar o controle, o menu passa para 74 px, a área principal é ampliada e os dez ícones de navegação permanecem disponíveis. O controle muda para **Expandir** e cada item mantém nome acessível por `aria-label` e dica nativa.

## Persistência

O estado recolhido é guardado no navegador. A chave antiga do nome do responsável é removida ao carregar o layout; as gravações compartilhadas continuam anônimas.

## Expansão e mobile

O controle **Expandir** restaura a largura integral, os rótulos e o deslocamento original do conteúdo. Em 375 × 812 px, o controle desktop fica oculto e o cabeçalho móvel mantém o botão hambúrguer, a marca e o acesso à navegação sem alterações.

# Validação das interações do calendário

## Evidências visuais

- **02/09:** o card expandido apresenta sete Stories individuais; o primeiro está identificado como caixa de perguntas e resposta aberta; os seis seguintes são enquetes independentes, cada uma com pergunta e exatamente duas respostas clicáveis. A alternativa segura e o CTA aparecem em coluna separada.
- **05/09:** o card expandido apresenta sete Stories individuais; a caixa aberta precede seis enquetes por congresso, todas com duas respostas próprias. A alternativa de post estático permanece fora do roteiro.
- **12/09:** o card expandido apresenta contexto, duas enquetes com duas respostas cada e uma caixa aberta final. A alternativa de carrossel aparece separada da sequência.
- **16/09:** o card expandido apresenta uma caixa aberta e duas enquetes independentes sobre critérios de decisão, sem misturar as quatro respostas em um único componente. A alternativa de formulário curto está isolada.
- **18/09:** o card expandido apresenta oito Stories separados: um card de orientação, seis enquetes de identificação por congresso e um fechamento. Cada enquete exibe suas duas respostas clicáveis.
- **20/09:** o card expandido apresenta instrução inicial, seis enquetes de interesse independentes e fechamento com link; cada enquete preserva suas duas respostas e a recomendação alternativa fica fora do roteiro.
- **23/09 às 19h:** o card expandido apresenta cinco modelos individuais de pergunta e resposta para as primeiras horas de venda. Não há aparência de enquete nem mistura entre modelos; a alternativa de atendimento está separada.
- **07/09:** o card expandido apresenta um anúncio e três enquetes independentes, uma por masterclass, sempre com duas respostas clicáveis. A alternativa estática não se mistura ao roteiro.
- **09/09:** o card expandido apresenta uma orientação e três perfis com link. Os blocos estão identificados como “Perfil + link”, sem respostas clicáveis e sem aparência de enquete.
- **22/09:** o card expandido apresenta duas informações, uma enquete com duas respostas e um lembrete com link. Os quatro papéis aparecem identificados separadamente.
- **23/09 às 9h:** o card expandido apresenta confirmação, link para vendas e orientação pós-abertura em três Stories distintos, com horários explícitos e alternativa separada.
- **26/09:** o card expandido apresenta cinco modelos de pergunta e resposta, todos identificados como atendimento, sem respostas de enquete. A alternativa de carrossel de perguntas frequentes permanece separada.

## Evidências automatizadas e responsivas

- A suíte `server/planData.interactions.test.ts` verifica as 12 pautas com `storyCards`, a presença de exatamente duas respostas em todas as enquetes e a ausência de respostas fechadas nas caixas abertas.
- Em largura inferior a 620 px, `.story-answers` muda de duas colunas para uma coluna, mantendo as respostas legíveis e empilhadas.
- Capturas em desktop e em viewport móvel confirmam que os blocos mantêm hierarquia, contraste e separação entre roteiro, CTA e alternativa segura.

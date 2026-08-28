# Validação do painel de lotação

## Desktop — estado inicial

O painel de indicadores posiciona **“Lotação das seis salas”** imediatamente após o título da seção e antes dos demais KPIs. O estado inicial exibe vendas acumuladas iguais a zero, nenhuma das seis capacidades informadas, capacidade conhecida e vagas restantes indisponíveis, além da mensagem **“Aguardando capacidade”** no progresso geral.

Os seis congressos aparecem em cartões individuais com campo de capacidade, barra de progresso, vendidos, restantes e acesso aos lançamentos mensais. A camada de aquisição, relacionamento, vendas e eficiência permanece abaixo, identificada como visualização secundária.

## Cálculo em tempo real

Foi preenchida temporariamente, sem salvar, uma capacidade de 500 lugares para Gestão de Academias e vendas mensais de 100 em setembro e 50 em outubro. O painel atualizou imediatamente para **150 vendas acumuladas**, **30,0% de lotação** e **350 vagas restantes**. O resumo geral indicou uma das seis capacidades configuradas e usou somente essa capacidade conhecida no denominador.

## Persistência colaborativa

O teste de integração gravou capacidade e vendas mensais com um identificador exclusivo de QA, confirmou a leitura por uma segunda sessão anônima, verificou a autoria no histórico e removeu os registros temporários ao finalizar. Nenhum valor de teste foi escrito nos seis congressos reais.

## Mobile e integridade dos dados

A captura em 375 × 812 confirmou o empilhamento do cabeçalho, dos quatro números executivos, dos seis cartões e dos campos mensais em duas colunas. Não há corte lateral visível. Uma consulta final ao banco não retornou capacidade ou venda mensal para nenhum dos seis identificadores reais, confirmando que os valores usados na demonstração ficaram apenas no estado local do navegador.

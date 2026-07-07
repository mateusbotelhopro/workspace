# Visão do Produto — CRM de Tráfego + WhatsApp

## O problema

Quem roda tráfego pago com conversão no WhatsApp opera às cegas em dois pontos:

1. **Atribuição:** o lead chega no WhatsApp e ninguém sabe de qual campanha, conjunto ou anúncio ele veio. O gestor de tráfego otimiza por "conversas iniciadas", que é uma métrica fraca (inclui curioso, spam, lead desqualificado).
2. **Feedback pro algoritmo:** o Meta só sabe que a conversa começou. Ele não sabe quem virou lead qualificado nem quem comprou. Sem esse retorno, o algoritmo otimiza pra volume de conversa, não pra venda.

No meio disso ainda tem o problema operacional: as conversas ficam no celular do dono ou espalhadas entre atendentes, sem funil, sem follow-up, sem histórico.

## A solução

Um CRM onde:

- O lead **entra pelo WhatsApp já com a origem rastreada** (campanha → conjunto → anúncio).
- O time trabalha o lead num **pipeline kanban** com automações e follow-up.
- Cada avanço relevante do funil (lead qualificado, agendamento, venda) **vira evento enviado pro Meta via Conversions API**, com valor de compra quando houver, fechando o ciclo de otimização.
- Os relatórios mostram **ROAS real por anúncio**: investimento (via Marketing API) x receita registrada no CRM.

Em uma frase: **Kommo + Tintim num produto só.** O CRM conversacional do Kommo com a camada de atribuição e retorno de conversão do Tintim, nativa, sem precisar integrar duas ferramentas.

## Benchmark

### Kommo (ex-amoCRM) — o que aproveitar

- **Inbox unificado** de mensageiros (foco deles: WhatsApp, Instagram, Telegram). Nosso MVP: só WhatsApp, e bem feito.
- **Pipeline kanban** com múltiplos funis, campos customizados e valor por lead.
- **Digital pipeline:** automações disparadas por mudança de etapa (mandar mensagem, marcar tag, criar tarefa, notificar).
- **Salesbot:** construtor de chatbot visual. Fica pra fase avançada.
- **Mensagens rápidas / templates** por atendente.
- Multiusuário com permissões e distribuição de conversas.

O que o Kommo **não resolve bem**: atribuição de origem do lead de tráfego e envio de eventos pro Meta. É genérico, feito pro mundo todo, não pro fluxo brasileiro de tráfego + WhatsApp.

### Tintim — o que aproveitar

- **Rastreamento do clique ao WhatsApp:** captura do `ctwa_clid` (anúncios click-to-WhatsApp) e links rastreáveis pra tráfego de site/bio, resolvendo qual anúncio gerou cada conversa.
- **Conversions API:** envia eventos (lead, lead qualificado, compra com valor) de volta pro Meta pra melhorar a otimização das campanhas.
- **Relatório por anúncio:** leads, vendas e receita por campanha/conjunto/anúncio, cruzando com o investimento.
- **Notificações de venda** e marcação simples de qualificação direto na conversa.

O que o Tintim **não resolve**: ele não é CRM. Não tem pipeline de verdade, gestão de atendimento, tarefas, automação de funil. Ele rastreia e reporta; quem opera a venda precisa de outra ferramenta.

### A lacuna

Hoje o usuário paga Kommo (ou similar) **mais** Tintim e ainda precisa integrar os dois. A oportunidade é o produto único: o dado de atribuição nasce dentro do CRM e o evento de conversão sai do próprio pipeline (mover o card pra "Vendido" já dispara o Purchase pro Meta).

## Público-alvo

1. **Primeiro usuário: o próprio Mateus**, operando os clientes de tráfego da agência (dogfooding). Cada cliente vira um workspace.
2. **Gestores de tráfego e agências** que vendem pra clientes com atendimento no WhatsApp.
3. **Negócios locais e serviços** (clínicas, advogados, estética, educação) que anunciam no Meta e fecham no WhatsApp. A vertical jurídica da Botelho Marketing Jurídico é uma porta de entrada natural.

## Nome e domínio

**Leady** — leady.pro. "Lead" + terminação que soa como "ready" e funciona bem falado em português. O .pro reforça o público (gestor de tráfego profissional) e deixa o nome curto disponível.

## Posicionamento

"O CRM que mostra qual anúncio te dá venda, não só conversa." Diferencial: atribuição e retorno de conversão nativos, interface simples em português, feito pro fluxo de tráfego pago brasileiro.

## Modelo de negócio (hipótese inicial)

- SaaS por assinatura, plano por workspace (número de WhatsApp conectado + volume de conversas/usuários).
- Referências de preço no mercado: Kommo cobra por usuário/mês; Tintim cobra mensalidade por conta. Um preço combinado abaixo da soma dos dois já é competitivo.
- Fase inicial sem cobrança: uso interno na agência e 1 ou 2 clientes piloto.

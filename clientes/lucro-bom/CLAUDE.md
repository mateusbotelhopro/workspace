# Lucro Bom

## O que é
Empresa que vende plano de saúde e odontológico. Cliente da Mateus Botelho pra automação de atendimento no WhatsApp.

## Tipo
Cliente

## Escopo
Automação de atendimento via WhatsApp usando N8N + Evolution API, com IA conversacional respondendo os clientes.

## Produtos/Serviços (base de conhecimento do atendimento)
- Plano Médico e Odontológico Completo
- Pediatra e Clínico 24h em plantão
- Especialistas gratuitos e ilimitados
- Assistência Odontológica

## Contexto
- **2026-07-24: auditoria encontrou que o workflow de produção tinha sumido.** O CLAUDE.md apontava pro id `rWIqPmZdzzKUCiF0` como sendo o "Lucro Bom - Atendimento WhatsApp (Z-API + IA)", mas conferindo direto no n8n esse id hoje é um workflow arquivado/inativo com conteúdo de **outro cliente** (Integra Engenharia, manutenção de ar condicionado), só reaproveitando as credenciais nomeadas "Lucro Bom". Não achei rastro do workflow real (persona Pedro Paulo, roteiro de planos) nem no n8n nem no histórico do git — foi perdido ou sobrescrito. O único workflow ativo no n8n nessa conta ("CastilhoIA_Agendamentos", de outro cliente) também estava consumindo as credenciais OpenAI/Redis rotuladas "Lucro Bom".
- **Mesma auditoria: instância Z-API sem assinatura ativa.** Chamando o status da Z-API direto com as credenciais do Acessos.md, retornou "To continue sending a message, you must subscribe to this instance again" — bloqueia qualquer envio, independente de QR/webhook. Decisão do Mateus: **voltar pra Evolution API** em vez de reativar a Z-API.
- **A instância antiga da Evolution (`lucrobom`) também não existia mais no servidor** — só existia `Botelho`, que já tinha tido `device_removed` em 2026-07-22. Testamos por ela (mesmo número) pra validar a lógica do fluxo: primeiro teste não respondeu (bug de instância fixa no send, corrigido), segundo teste respondeu mas com status ERROR de entrega mesmo após reconectar via QR — decidimos não insistir nela.
- **2026-07-24: instância `lucrobom` criada do zero e conectada.** Confirmado com o Mateus: o número conectado é dedicado pra Lucro Bom (não é uso pessoal, mesmo sendo o mesmo WhatsApp que estava como "Botelho" antes — essa instância antiga sumiu da conta ao reconectar o número aqui). Webhook configurado apontando pra `https://webhook.kortexcompany.cloud/webhook/lucro-bom-whatsapp` com `webhookBase64: true` (necessário pro processamento de áudio/imagem no workflow).
- **2026-07-24: workflow reconstruído do zero** a partir do roteiro documentado abaixo, já usando Evolution API. Nome no n8n: `Lucro Bom - Atendimento WhatsApp (Evolution API + IA)`, id `GmZuyxqugyClPoYE`, arquivo em `n8n/lucro-bom-atendimento-whatsapp.json`. Estrutura: webhook → filtro fromMe → roteador por tipo de mensagem (texto/áudio/imagem, com transcrição/análise via OpenAI) → roteador por palavra-chave (respostas fixas sem IA) ou IA (Pedro Paulo, gpt-4o-mini) → checagem de handoff → envio via Evolution API. Estado (handoff e "aguardando cidade") fica em memória via `$getWorkflowStaticData`, sem Redis.
- **2026-07-24: primeiro teste rodou "com sucesso" mas não respondeu.** Causa: a instância `Botelho` (pessoal, já com webhook apontado pra esse fluxo desde antes) recebeu a mensagem de teste, mas o node de envio estava fixo mandando pra instância `lucrobom` — que ainda não existe — e como o node tem `continueRegularOutput`, o erro foi engolido e a execução apareceu como sucesso. Corrigido: o node "Enviar resposta (Evolution API)" agora usa dinamicamente `server_url`/`instance`/`apikey` do próprio payload recebido (mesmo padrão dos outros workflows desse n8n), em vez de um nome de instância fixo — funciona com qualquer instância que disparar o webhook, incluindo a `lucrobom` quando ela existir.
- **2026-07-24: segundo teste — mensagem foi enviada mas com status ERROR de entrega.** Conferi direto no histórico de mensagens da Evolution API: o bot respondeu ("Oi! Como posso te ajudar hoje?"), mas a entrega falhou. Causa: a mensagem de teste chegou com `key.remoteJid` no formato novo `@lid` do WhatsApp (ex: `30404107047007@lid`, endereçamento por device-id, não por número), e o Roteador estava montando o número de destino a partir desse valor — que não é um JID/telefone válido pra enviar. O JID de telefone real vem em `key.remoteJidAlt` (ex: `553171560883@s.whatsapp.net`). Corrigido: o node "Roteador" agora usa `remoteJidAlt` sempre que `remoteJid` termina em `@lid`.
- Credenciais reaproveitadas do n8n: `OpenAI - Lucro Bom` (openAiApi). O envio via Evolution não usa credencial fixa — pega `apikey`/`server_url`/`instance` do payload recebido.
- **Pendente pra ativar em produção (setup atual: instância + workflow "BotelhoIA"):**
  - [x] Instância Evolution conectada e webhook configurado
  - [x] Workflow ativo no N8N com a persona Pedro Paulo
  - [x] Roteador por palavra-chave (teleconsulta, dentista, dependentes, psicóloga) implementado, 2026-07-31
  - [x] Pausa real de 30 min após handoff implementada via Redis, 2026-07-31
  - [ ] Preencher o link do portal de teleconsulta + WhatsApp de agendamento de especialistas (hoje com placeholder `[PREENCHER]` no texto de resposta — ver Contexto 2026-07-31)
  - [ ] Testar os 3 tipos de mensagem (texto, áudio, imagem) e confirmar entrega de verdade (status diferente de ERROR) antes de considerar migrado
- **Handoff pra humano:** a IA escala sozinha — quando decide que precisa de atendente humano (cliente insatisfeito, pedido explícito, negociação/cancelamento, dúvida técnica sem certeza, ou dentista fora de Abre Campo), ela termina a resposta com um marcador interno (`[[HANDOFF]]`, nunca mostrado ao cliente) e o fluxo fica em silêncio pra esse telefone por 30 min. Implementado em memória (`$getWorkflowStaticData`), sem Redis.
- **2026-07-31: nova auditoria — o workflow de 07-24 foi abandonado, produção migrou pra um workflow/instância compartilhada chamada "BotelhoIA".** Conferido direto via API (N8N + Evolution) com as credenciais de `acessos.md`: o workflow antigo `Lucro Bom - Atendimento WhatsApp (Evolution API + IA)` (id `GmZuyxqugyClPoYE`) está inativo e arquivado desde 2026-07-27. A instância dedicada `lucrobom` não existe mais (404). **O setup real em produção hoje é outro**, confirmado pelo Mateus:
  - Instância Evolution: `BotelhoIA` (número 55 47 9267-0813, token `BF356BAE1768-42DF-B36C-A35A67A1CDAD`), webhook → `webhook.kortexcompany.cloud/webhook/BotelhoIA`
  - Workflow N8N: `BotelhoIA` (id `tJn24kuW6TRwCCFP`), **ativo**, última atualização 2026-07-31 — webhook path `BotelhoIA` (mesmo webhookId que antes pertencia ao workflow `CastilhoIA_Agendamentos`, de outro cliente — essa infra foi reaproveitada). O node "Atendente" já roda a persona Pedro Paulo/Lucro Bom com o system prompt certo, credenciais `OpenAI Botelho` e `Redis Botelho`.
  - **Gap encontrado no workflow ativo:** o system prompt do Pedro Paulo assume que teleconsulta/plantão/pediatra, dentista, dependentes e psicóloga "já são respondidas automaticamente antes de chegar até você" — mas esse workflow **não tem nenhum roteador por palavra-chave**, só webhook → filtro fromMe → tipo de mensagem → IA direto. Ou seja, o roteiro fixo documentado abaixo (link de teleconsulta, pergunta de cidade pro dentista, coleta de dados de dependentes) **não está implementado** nessa versão — tudo cai na IA, que vai inventar ou travar nesses casos.
  - **Gap 2:** o handoff (`[[HANDOFF]]`) só é removido do texto de saída (regex no node "Segmentos") — não encontrei lógica de pausa/silêncio de 30 min pro telefone depois do handoff (o `$getWorkflowStaticData` do workflow antigo não está presente aqui). Hoje o marcador só limpa o texto, não pausa o atendimento.
  - Nome do cliente e produtos ainda constam corretos no prompt; falta reconciliar isso com o roteiro fixo antes de considerar 100% migrado.
- **2026-07-31: gaps do workflow ativo corrigidos.** Atualizei o workflow `BotelhoIA` (id `tJn24kuW6TRwCCFP`) direto via API do N8N, mantendo tudo que já existia (batching/debounce de 8s, transcrição de áudio, análise de imagem, memória Redis do Atendente):
  - **Roteador por palavra-chave** inserido logo após o texto/áudio/imagem virar uma única mensagem combinada (node "messages"), antes de chegar no Atendente. Novo node de código "Roteador Palavra-Chave" classifica a mensagem por regex (teleconsulta/plantão/pediatra, dentista, dependentes, psicóloga, reset) e um Switch ("Switch Rotas") direciona pra resposta fixa correspondente ou, se nada bater, segue pro Atendente (IA) normalmente. Lógica testada isoladamente (11 casos, todos passaram) antes do deploy.
  - **Fluxo de cidade do dentista** implementado com estado em Redis (chave `cidade-{remoteJid}`, TTL 10 min): pergunta a cidade, se a resposta contém "abre campo" retorna o contato do Instituto Felipe Abreu, qualquer outra cidade aciona handoff pra consultor humano (mesma regra do roteiro, ainda sem lista completa de cidades).
  - **Pausa de handoff real** implementada via Redis (chave `handoff-{remoteJid}`, TTL 30 min = 1800s): um node novo ("Detecta Handoff") verifica se a resposta do Atendente contém `[[HANDOFF]]` e, se sim, seta essa chave. No início do fluxo, antes de qualquer processamento, um gate novo ("Get Handoff" + "Handoff Ativo?") checa essa chave e, se ativa, o fluxo termina em silêncio sem responder — nenhuma mensagem chega no cliente enquanto o handoff estiver ativo.
  - **Comando de reset** implementado: mensagens batendo no regex de reset limpam o estado "aguardando cidade" e respondem confirmando o recomeço, tem prioridade sobre qualquer outro roteamento.
  - **Bug do `@lid` corrigido também aqui** (o mesmo problema documentado em 2026-07-24 pro workflow antigo estava presente nesse também): o node "Responde texto" agora usa `key.remoteJidAlt` como número de destino sempre que `key.remoteJid` vem no formato `@lid` (endereçamento por device-id, não é JID de telefone válido).
  - **Conteúdo ainda com placeholder** (pendente, ver checklist acima): link do portal de teleconsulta, WhatsApp de agendamento de especialistas. O texto da psicóloga ficou só com a confirmação de retorno (sem link, igual já estava documentado como pendência).
  - **Gap de verificação:** consegui validar a estrutura do grafo (sem conexões quebradas), confirmar via API que o workflow subiu ativo com os nós novos, e testar a lógica do roteador isoladamente fora do n8n. Não consegui inspecionar o log de execução real dentro do n8n pra confirmar que uma mensagem de teste percorreu o caminho esperado — a API key atual (`claude-code-lucro-bom`) não tem escopo pra ler `/executions` (retorna 403). Recomendo abrir o n8n e olhar a última execução do workflow `BotelhoIA` pra confirmar visualmente, ou gerar uma API key nova com escopo de execução se quiser que eu confira isso da próxima vez.
- Histórico Z-API (abandonado 2026-07-24): chip dedicado foi comprado e credenciais criadas, mas a instância nunca saiu do estado "precisa assinar novamente" — decisão foi voltar pra Evolution API em vez de resolver a assinatura.
- Histórico Evolution API v1 (resolvido, mantido só como referência): instância `lucrobom` original teve dois `device_removed` em 2026-07-15 por número compartilhado, e um bug de webhook em 2026-07-16 (`webhookByEvents` vs `byEvents`). Essa instância não existe mais — a nova precisa ser criada do zero.
- Prazo/orçamento: a definir
- Acessos (servidor, APIs, senhas): `clientes/lucro-bom/acessos.md` (gitignored, nunca commitar)

## Roteiro de atendimento (IA)
Persona: **Pedro Paulo**, atendente humanizado da Lucro Bom — nunca se identifica como IA/robô, tom natural de WhatsApp.

Respostas prontas (fixas, disparadas por palavra-chave, sem passar pela IA):
- **Consulta online 24h / plantão / clínico geral / pediatra** → envia link do portal de teleconsulta + instrução de senha (6 primeiros dígitos do CPF + "L") + WhatsApp de agendamento com especialistas
- **Dentista** → pergunta a cidade; se for Abre Campo, responde com Instituto Felipe Abreu (+55 31 98556-0521); outras cidades → encaminha pra consultor humano (ainda não temos lista completa de cidades)
- **Dependentes/familiares** → pede nome completo, CPF, empresa + dados dos dependentes (nome, CPF, nascimento, WhatsApp)
- **Psicóloga** → hoje só confirma que vai retornar com detalhes (falta o link — pendente)

Perguntas fora desse roteiro caem na IA (gpt-4o-mini) com o prompt do Pedro Paulo, usando a lista de produtos da Lucro Bom como base.

Implementado no workflow `BotelhoIA` desde 2026-07-31 (ver Contexto).

**Pendências:**

- [ ] Link do portal de teleconsulta + WhatsApp de agendamento de especialistas (hoje com placeholder no texto)
- [ ] Link/texto da resposta de psicóloga
- [ ] Lista completa de cidades atendidas por dentista (hoje só Abre Campo)

**Comando de reset:** o cliente pode mandar "resetar", "reset", "limpar conversa", "esquecer conversa", "começar de novo" ou "recomeçar" pra limpar o estado de espera (ex: se o bot estava esperando a cidade do dentista). Não é memória de conversa real — o fluxo não guarda histórico entre mensagens, cada uma é tratada isolada pela IA; o único estado que existe é esse "aguardando cidade" com TTL de 10 min

## Arquivos importantes
- (será preenchido conforme o projeto avança)

## Regras específicas
- (será preenchido conforme o projeto avança)

## Contato
- (a definir)

## Entregas
- [x] Configurar N8N
- [x] Reconstruir o fluxo de atendimento com IA (webhook → N8N → IA → resposta), 2026-07-24
- [x] Instância Evolution dedicada conectada e workflow ativo em produção (setup "BotelhoIA", 2026-07-31)
- [x] Roteiro fixo por palavra-chave e pausa de handoff implementados no workflow ativo, 2026-07-31
- [ ] Preencher conteúdo pendente (link teleconsulta, WhatsApp especialistas, texto psicóloga) e confirmar visualmente no n8n que a execução percorre o caminho esperado (ver gap de verificação em Contexto 2026-07-31)
- [ ] Definir base de conhecimento completa do atendimento (planos, coberturas, preços, carência etc.)

# Tarefas — Lucro Bom

## A fazer
- [ ] **Bloqueio prioritário:** conseguir número dedicado (chip exclusivo) pra instância `lucrobom` — o número atual é usado no dia a dia no WhatsApp do celular, e isso causa quedas recorrentes por conflito de dispositivo vinculado (`device_removed`, já caiu 2x no mesmo dia)
- [ ] Conseguir link/texto da resposta de psicóloga
- [ ] Levantar lista completa de cidades atendidas por dentista (hoje só Abre Campo)
- [ ] Responder manualmente o contato "553171560883" (pushName "Mateus Botelho") que ficou com mensagens sem resposta por causa do bug do @lid + quedas de conexão

## Em andamento
- [ ]

## Feito
- [x] Configurar Evolution API (servidor + instância + número conectado — instância `lucrobom`, status open)
- [x] Configurar N8N (login, API key)
- [x] Montar fluxo de atendimento com IA (webhook Evolution → N8N → IA/roteiro fixo → resposta)
- [x] Roteiro de atendimento do Pedro Paulo (consulta online, dentista, dependentes, psicóloga parcial)
- [x] Testar e ativar o workflow no N8N
- [x] Configurar o webhook da instância Evolution (`lucrobom`) apontando pro N8N
- [x] 2026-07-15: diagnosticar e corrigir queda do agente (instância desconectada por `device_removed`, reconectada via QR code)
- [x] 2026-07-15: corrigidos 4 bugs no workflow n8n (publicado e testado): retry + continueOnFail nos nós de OpenAI/Whisper/Visão/Evolution (falha não derruba mais a execução em silêncio); expiração de 10min + cancelamento do estado "aguardando cidade" quando chega uma pergunta não relacionada; mensagens de imagem agora passam pelo roteiro de intenção antes de cair na IA de visão; deduplicação de mensagem por ID pra evitar resposta duplicada em reenvio de webhook. Backup do workflow em `clientes/Lucro Bom/n8n/lucro-bom-atendimento-whatsapp.json`

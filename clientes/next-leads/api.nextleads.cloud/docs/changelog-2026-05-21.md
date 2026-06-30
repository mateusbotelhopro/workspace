# Changelog — 2026-05-21

Sessão de auditoria, sincronização e correções do Next Leads.

---

## Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `CLAUDE.md` | Documentação do projeto para Claude Code (arquitetura, comandos, quirks) |
| `deploy.py` | Script Python para deploy automático via SSH/SFTP (paramiko) |
| `.claude/settings.json` | Permissões do Claude Code para executar o deploy |
| `docs/clientes-sdr.md` | Tabela completa de clientes e SDRs responsáveis |

---

## Correções de código

### `app/src/modules/queue/message.processor.ts`
- **Antes:** `const axios = require('axios')` dentro do método `handle()` (executado a cada mensagem)
- **Depois:** `import axios from 'axios'` no topo do arquivo (import estático)

### `app/src/modules/response-sla/response-sla.service.ts`
- **Antes:** Alertas SLA (30min/60min) enviados apenas para o grupo geral
- **Depois:** Alertas enviados para o **SDR individual** E para o **grupo geral**
- Status salvo no WhatsappLog: `sla_30min` / `sla_60min` (para dedup)

### `app/src/modules/stats/stats.controller.ts`
- **Antes:** Contagem SLA filtrava só `sla_30_sent` / `sla_60_sent` → resultado: 0
- **Depois:** Filtra ambos os formatos: `['sla_30min', 'sla_30_sent']` e `['sla_60min', 'sla_60_sent']`
- Aplicado no overview global e nos stats por SDR

### `app/src/modules/stats/dashboard.controller.ts`
- Mesma correção de contagem SLA dupla aplicada ao dashboard HTML

---

## Correções no banco de dados (produção)

### SDRs renomeados
| ID | De | Para |
|----|----|----|
| (Dayane original) | `Dayane` | `Day` |
| (Day Beltrameew) | `Day Beltrameew` | `Dayane` |

### clientName corrigido
| LinkedinAccount | De | Para |
|---|---|---|
| Jose Luiz (todas as contas) | `Next Leads` | `Jose Luiz` |

---

## Deploy realizado

```
python deploy.py        # sync + rebuild
python deploy.py --full # forçado após encoding fix
```

Container `nextleads_api` reconstruído e estável. Última linha de log confirmada:
```
[Nest] LOG [NestApplication] Nest application successfully started
```

---

## Pendências

- [ ] Adicionar contas LinkedIn da planilha Google Sheets (acesso necessário do gestor)
- [ ] Trocar senha do servidor root@72.60.243.27 (segurança)
- [ ] Mover secrets do docker-compose.yml para arquivo `.env` (segurança)

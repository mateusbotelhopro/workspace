## Visão geral

Redesign do Gestor Kelvin para virar um painel executivo completo. O admin abre o sistema e vê **tudo numa tela só**: faturamento do mês, previsão dos próximos 3 meses, inadimplência, despesas, lucro, tarefas pendentes e atividade recente. Cada cliente vira um "perfil 360º" com dados cadastrais completos (PF/PJ), arquivos, senhas criptografadas e histórico.

---

## 1. Novo Dashboard Executivo (`/dashboard`)

Tela única, densa, com tudo que importa:

```text
┌─────────────────────────────────────────────────────────────┐
│  KPIs (4 cards)                                              │
│  [Faturamento mês] [A receber] [Despesas] [Lucro líquido]   │
├──────────────────────────────┬──────────────────────────────┤
│  Gráfico: Receita vs Despesa │  Previsão próx. 3 meses      │
│  (últimos 6 meses)            │  (barras + total esperado)  │
├──────────────────────────────┼──────────────────────────────┤
│  Inadimplência                │  Tarefas críticas            │
│  - Vencidos hoje              │  - Atrasadas (vermelho)      │
│  - A vencer 7 dias            │  - Vencendo hoje             │
├──────────────────────────────┴──────────────────────────────┤
│  Atividade recente (timeline) | Top clientes por receita     │
└──────────────────────────────────────────────────────────────┘
```

Cores semânticas (memória do projeto): verde = positivo/concluído, vermelho = vencido/negativo, cinza = em andamento, laranja = destaque/CTA.

---

## 2. Clientes 360º (`/clientes/$id`)

Cadastro expandido com abas:

- **Dados** — tipo (PF/PJ), CPF/CNPJ, razão social, nome fantasia, IE, endereço completo (CEP, rua, número, complemento, bairro, cidade, UF), email, telefone(s), site, contato responsável, observações.
- **Contrato** — valor mensal, dia de vencimento, data de início, status, tags/segmento.
- **Financeiro** — pagamentos do cliente, próximo vencimento, total recebido, inadimplência.
- **Arquivos** — upload de contratos, briefings, criativos, comprovantes (Cloud Storage, bucket privado por usuário).
- **Cofre de senhas** — credenciais (Meta Ads, Google Ads, redes sociais, hospedagem etc.) com label, login, senha, URL e notas. **Criptografia AES-GCM no servidor** com chave mestra do app; o cliente vê só após autenticar e clicar em "revelar".
- **Atividade** — histórico do cliente (já existe via `activities`).

---

## 3. Financeiro completo (`/financeiro`)

Duas abas no topo:

- **Receitas** — pagamentos (já existe), filtros por mês/status/cliente, marcar como pago.
- **Despesas** — nova tabela `expenses`. Campos: descrição, categoria (ferramentas, anúncios, salários, impostos, outros), valor, data, recorrente (sim/não, mensal), comprovante (arquivo).

Resumo no topo: receita do mês, despesa do mês, lucro, margem %.

---

## 4. Previsibilidade (`/previsao`)

- Tabela: próximos 6 meses × (receita prevista, despesas previstas recorrentes, lucro esperado).
- Receita prevista = soma de `contract_value` de clientes ativos.
- Despesa prevista = soma de despesas marcadas como recorrentes.
- Gráfico de linha: tendência de lucro projetado.

---

## 5. Mudanças de banco

Novas tabelas / colunas (todas com RLS por `user_id`):

**`clients`** — adicionar colunas:
- `client_type` (`pf` | `pj`), `document` (CPF/CNPJ), `legal_name`, `trade_name`, `state_registration`, `email`, `website`, `contact_person`, `address_zip`, `address_street`, `address_number`, `address_complement`, `address_district`, `address_city`, `address_state`, `notes`, `segment`, `start_date`.

**`expenses`** — nova tabela:
- `description`, `category`, `amount`, `expense_date`, `is_recurring`, `recurrence_day`, `notes`, `receipt_url`.

**`client_files`** — metadados de arquivos:
- `client_id`, `name`, `category`, `storage_path`, `size`, `mime_type`.

**`client_credentials`** — cofre de senhas:
- `client_id`, `label`, `username`, `password_encrypted` (bytea), `iv` (bytea), `url`, `notes`.

**Storage bucket privado** `client-files` — RLS: só o dono (`user_id` do path) lê/escreve.

---

## 6. Segurança do cofre de senhas

- Chave mestra `VAULT_MASTER_KEY` (32 bytes base64) guardada em **secret runtime**.
- Criptografia **AES-256-GCM** dentro de uma `createServerFn` com `requireSupabaseAuth` — o cliente **nunca** recebe a chave.
- Endpoints: `saveCredential`, `listCredentials` (sem senha), `revealCredential` (retorna senha em texto, exige sessão válida).
- Senha nunca trafega em logs nem fica no estado do React além do momento de exibir.

---

## 7. Navegação

Sidebar lateral colapsável (substitui o header atual) com:
Dashboard · Clientes · Financeiro · Previsão · Tarefas · Histórico

Tema laranja/preto mantido. Toggle light/dark mantido.

---

## Detalhes técnicos

- Stack: TanStack Start + Supabase (Lovable Cloud) + shadcn + Recharts (já instalado para gráficos).
- Server functions (`createServerFn` + `requireSupabaseAuth`) para: agregações do dashboard, previsão, criptografia do cofre, upload assinado de arquivos.
- Storage: bucket `client-files` privado, paths `{user_id}/{client_id}/{filename}`.
- Migrations em ordem: alter `clients` → criar `expenses` → criar `client_files` → criar `client_credentials` → criar bucket + policies.
- Vou pedir o secret `VAULT_MASTER_KEY` antes de implementar o cofre.
- Todos os valores monetários em `numeric(12,2)`.

---

## Ordem de execução

1. Migrations (banco + bucket + policies).
2. Pedir `VAULT_MASTER_KEY`.
3. Server functions: dashboard agregado, previsão, despesas, cofre, upload.
4. Sidebar nova + rota `/clientes/$id` com abas.
5. Dashboard executivo + página de despesas + página de previsão.
6. Atualizar formulário de cliente com todos os campos novos.

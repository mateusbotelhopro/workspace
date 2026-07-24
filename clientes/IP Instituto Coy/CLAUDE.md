# IP Instituto Coy

Esse CLAUDE.md existe porque essa pasta às vezes é aberta **separada**, direto como workspace no Claude Code (não dentro do BotelhoOS completo). Por isso ele precisa se bastar: além do contexto deste cliente, ele também aponta de volta pro contexto geral do negócio, caso o Claude precise ler.

---

## Quem é esse cliente

- **Nome:** Instituto Coy
- **Segmento:** instituto de ensino/mentoria em odontologia estética (Método Coy — Lentes em Resina Composta), público-alvo são profissionais da área (dentistas, biomédicos etc.)
- **Responsáveis técnicos / instrutores:**
  - Roberto Correia — CRO 128214SP
  - Thaís Lima — CRO 149420SP
- **Início do trabalho:** 2026-06-22

## Serviços contratados

- [x] Site / blog / SaaS / aplicativo — landing page (página de vendas para lançamento)

## Escopo do trabalho

Desenvolvimento de uma landing page única, no estilo de página de vendas de lançamento, para a Mentoria em Lentes de Resina Composta do Instituto Coy (Método Coy). Sem prazo definido ainda. Sem stack/ferramenta definida ainda — decidir conforme o projeto avançar (código customizado ou no-code/low-code).

Mateus vai enviando as informações (oferta, copy, depoimentos, fotos) ao longo da conversa — usar e abusar do material visual que eles têm.

## Acessos e contas conectadas

*(preencher conforme for configurando — IDs de conta, não credenciais/senhas)*

- Instituto Coy Marketing - MF — login: institutocoyacademy@gmail.com (senha guardada fora do repositório, em gerenciador de senha)
- Domínio/hospedagem: [a definir]
- Outros: [a definir]

## Tom de voz deste cliente

[a definir — se não houver exceção, segue o padrão do sistema em `_contexto/preferencias.md`]

## Identidade visual

Marca própria recebida — logo em duas versões em `imagens/logo/`:
- `logo-preto.jpeg` — versão preta sobre fundo branco
- `logo-dourado.jpeg` — versão dourada sobre fundo branco

Os originais só existem em JPEG (fundo branco sólido, sem transparência). Em `site/imagens/logo/` foram geradas versões `.png` com fundo removido (transparência real) — são as usadas no header/footer/páginas do site pra evitar a caixa branca atrás da logo em fundo escuro. Se precisar da logo sem fundo em outro material, usar essas PNGs como base.

Paleta sugerida pela marca: dourado + preto/branco, estilo clean/premium. Confirmar com o cliente se há paleta de cores e fonte oficial definidas, ou se cabe definir junto na landing page.

Demais materiais visuais em `imagens/`:
- `imagens/fotos/` — fotos dos instrutores (Roberto Correia, Thaís Lima) pra usar na página
- `imagens/depoimentos/` — prints de depoimentos de alunas em grupos de mentoria (WhatsApp), pra usar como prova social

## Tarefas

Tarefas desse cliente ficam em [tarefas.md](../../tarefas/ip-instituto-coy.md).

## Estratégia e histórico

[a definir]

---

## Contexto do sistema principal

Essa pasta vive dentro do BotelhoOS (`c:\Users\mateu\Desktop\BotelhoOS`). Se for aberta como workspace separado, esses arquivos do sistema principal continuam valendo e devem ser lidos quando relevante:

- `../../_contexto/empresa.md` — quem presta o serviço, como o negócio funciona
- `../../_contexto/preferencias.md` — tom de voz e estilo padrão (a menos que sobrescrito acima)
- `../../_contexto/estrategia.md` — foco atual e prioridades do negócio como um todo
- `../../marca/design-guide.md` — identidade visual padrão pra tarefas visuais
- `../../templates/ferramentas/catalogo.md` — APIs e ferramentas disponíveis (Google Ads, Meta Ads, WhatsApp, N8N etc.)

Se esses caminhos não existirem (pasta movida ou copiada pra fora do BotelhoOS), ignorar e trabalhar só com o que está documentado aqui.

## Regras

- Skills disponíveis em `.claude/skills/` ou `.claude/commands/` do sistema principal continuam valendo mesmo abrindo essa pasta separada, contanto que a estrutura de pastas relativa seja preservada.
- Não inventar dados de conta, métrica ou histórico — perguntar ou deixar `[a definir]`.
- Atualizar este arquivo quando houver mudança de escopo, prazo, stack ou direção estratégica relevante.

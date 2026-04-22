# 📊 Task Matrix & RACI — Sanitation News Intelligence Platform

**RACI Legend:**
- **R** = Responsible (faz o trabalho)
- **A** = Accountable (aprova, final call)
- **C** = Consulted (dá input)
- **I** = Informed (fica sabendo)

---

## 🏗️ Fase 1: Design & Setup (Semana 1-2)

| Tarefa | PMO | Claude Code #1 | Claude Code #2 | Breno | Status | Notas |
|--------|-----|----------------|----------------|-------|--------|-------|
| Revisar schema 19 campos | R | C | C | **A** | ✅ | Breno aprova antes de codificar |
| Validar estrutura GitHub | R | C | C | **A** | ✅ | Confirmado |
| Definir taxonomies.json | R | C | C | **A** | 📋 | **ACTION:** Você completa e aprova |
| Definir sources.json (RSS/sites) | R | C | I | **A** | 📋 | **ACTION:** Breno decide quais fontes priorizar |
| Definir keywords.json | R | C | I | **A** | 📋 | **ACTION:** Palavras-chave por país/empresa |
| Gerar Prompt #1 (Dashboard) | **R** | — | — | A | ⏳ | PMO escreve após Breno aprovar schema |
| Gerar Prompt #2 (Processor) | **R** | — | — | A | ⏳ | PMO escreve após Breno aprovar schema |

---

## 🖥️ Fase 2: Backend (Semana 3-4)

| Tarefa | PMO | Claude Code #1 | Claude Code #2 | Breno | Status | Notas |
|--------|-----|----------------|----------------|-------|--------|-------|
| **Sprint 2.1: Fetchers** |
| Implementar `fetch_rss()` | — | **R** | — | C | ⏳ | RSS parser + requests |
| Implementar `fetch_web_scrape()` | — | **R** | — | C | ⏳ | BeautifulSoup + target sites |
| Implementar `fetch_api()` | — | **R** | — | C | ⏳ | NewsAPI, GNews, MediaStack |
| Teste com 5 URLs reais | — | **R** | — | A | ⏳ | Claude Code #1 valida parsing |
| **Sprint 2.2: Dedup & Classify** |
| Implementar `check_url_exists()` | — | **R** | — | I | ⏳ | Índice de URLs |
| Implementar `classify_tema_1()` | — | **R** | — | C | ⏳ | Lógica + keywords lookup |
| Implementar `estimate_impacto()` | — | **R** | — | C | ⏳ | Heurístico baseado em tema |
| Teste com 20 artigos fictícios | — | **R** | — | A | ⏳ | Validar classificação |
| **Sprint 2.3: Processor + Logging** |
| Integrar todos os fetchers | — | **R** | — | I | ⏳ | Orquestração |
| Gerar `resumo_executivo` (Claude API) | — | **R** | — | C | ⏳ | Chamada à API dentro do processor |
| Append a news.jsonl | — | **R** | — | I | ⏳ | Garantir append-only |
| Implementar logging (TXT diário) | — | **R** | — | I | ⏳ | Formato estruturado |
| Teste dry-run | — | **R** | — | **A** | ⏳ | Breno valida antes de produção |
| **Deliverables & QA** |
| Code review + aprovação | **R** | C | — | A | ⏳ | PMO revisa antes de integração |

---

## 🎨 Fase 3: Frontend (Semana 4-5)

| Tarefa | PMO | Claude Code #1 | Claude Code #2 | Breno | Status | Notas |
|--------|-----|----------------|----------------|-------|--------|-------|
| **Sprint 3.1: Base + Data Loading** |
| HTML estrutura (navbar, 3 abas) | — | — | **R** | A | ⏳ | UX inicial |
| Carregar news.jsonl via fetch() | — | — | **R** | C | ⏳ | Raw GitHub URL |
| Parser JSONL robusto | — | — | **R** | C | ⏳ | Trata edge cases |
| Renderizar cards | — | — | **R** | C | ⏳ | Layout inicial |
| Teste com dados GitHub | — | — | **R** | A | ⏳ | Claude Code #2 valida |
| **Sprint 3.2: Filtros & Search** |
| Dropdowns dinâmicos (país, empresa, tema) | — | — | **R** | C | ⏳ | Populados do JSON |
| Full-text search (titulo + descricao) | — | — | **R** | C | ⏳ | Case-insensitive |
| Apply filters → re-render | — | — | **R** | C | ⏳ | Lógica de AND/OR? |
| Teste com 5+ filtros combinados | — | — | **R** | A | ⏳ | Validação |
| **Sprint 3.3: Analytics & Charts** |
| Chart.js: Temas ao longo do tempo | — | — | **R** | C | ⏳ | Últimos 30 dias |
| Chart.js: Distribuição por país | — | — | **R** | C | ⏳ | Pie/bar chart |
| Chart.js: Sentimento over time | — | — | **R** | C | ⏳ | Area chart |
| Chart.js: Top companies | — | — | **R** | C | ⏳ | Bar chart |
| Teste com 100+ artigos | — | — | **R** | A | ⏳ | Performance check |
| **Deliverables & QA** |
| Responsiveness test (375px, 768px, 1024px) | **R** | — | C | A | ⏳ | PMO valida mobile |
| Code review + aprovação | **R** | — | C | A | ⏳ | PMO revisa antes de integração |

---

## 🔗 Fase 4: Integration & QA (Semana 5-6)

| Tarefa | PMO | Claude Code #1 | Claude Code #2 | Breno | Status | Notas |
|--------|-----|----------------|----------------|-------|--------|-------|
| **Sprint 4.1: E2E Test** |
| Rodar processor localmente | — | **R** | — | A | ⏳ | Claude Code #1 exec |
| Validar news.jsonl gerado | **R** | C | — | A | ⏳ | PMO spot-check dados |
| Carregar dashboard com dados reais | — | — | **R** | A | ⏳ | Claude Code #2 testa |
| Verificar todos filtros | — | — | **R** | A | ⏳ | End-to-end |
| Teste com diferentes qtd de dados | **R** | C | C | A | ⏳ | 10, 50, 100, 500 artigos |
| **Sprint 4.2: Performance & Polish** |
| Profile carregamento JSONL | **R** | C | C | A | ⏳ | Medir tempo |
| Otimizar se necessário | — | C | **R** | A | ⏳ | Lazy load? Paginação? |
| UX refinement (filtros, cards) | — | — | **R** | A | ⏳ | Polish |
| Manual review de 5+ classificações | **R** | C | — | **A** | ⏳ | Breno valida qualidade tema_1 |
| **Sprint 4.3: Deployment & Docs** |
| GitHub Actions workflow (ou manual schedule) | — | **R** | — | A | ⏳ | CI/CD ou local trigger |
| README.md (setup + uso) | **R** | C | C | A | ⏳ | PMO coordena |
| Documentação de cada pasta | — | **R** | **R** | I | ⏳ | Claude Code instances documentam seus outputs |
| Handoff & treinamento (você) | **R** | C | C | — | ⏳ | Como operar sozinho |
| **Final QA & Go-Live** |
| 0 erros críticos não tratados | **R** | C | C | **A** | ⏳ | Breno aprova produção |
| Processor roda sem intervenção | — | **R** | — | A | ⏳ | 1ª execução real |
| Dashboard sempre atualizado | — | — | **R** | A | ⏳ | Atualizando 9 AM |

---

## 📋 Decisões Pendentes (Breno)

### Críticas (Bloqueia design)
- [ ] Taxonomies.json exato (enum values para tema_1, tipo_evento, etc)
- [ ] Sources.json: quais RSS feeds entram no escopo inicial?
- [ ] Keywords.json: como estruturar (por país? por empresa)?

### Importantes (Afeta arquitetura)
- [ ] Dashboard hospedagem: local (você abre HTML file) vs GitHub Pages?
- [ ] Alertas do processor: quer notificação se falhar (email/webhook)?
- [ ] Período de retenção de dados: forever append ou limpar dados antigos?

### Nice-to-have (Fase 2)
- [ ] Você quer exportar dados (PDF/CSV)?
- [ ] Você quer compartilhar dashboard com alguém?
- [ ] Você quer análise por setor (água vs esgoto vs energia)?

---

## 🎯 Pontos de Aprovação (Gate Reviews)

### Gate 1: Schema & Config (FIM DE SEMANA 1)
**Breno valida:**
- ✅ Schema 19 campos definido
- ✅ taxonomies.json pronto
- ✅ sources.json listando fontes
- ✅ keywords.json estruturado

**Outcome:** PMO gera prompts para Claude Code #1 & #2

### Gate 2: Backend MVP (FIM DE SEMANA 3)
**Breno valida:**
- ✅ Processor roda localmente sem erros
- ✅ 10+ artigos em news.jsonl
- ✅ Deduplicação funciona (zero duplicatas)
- ✅ Classificações fazem sentido

**Outcome:** Claude Code #1 pronto para produção

### Gate 3: Frontend MVP (FIM DE SEMANA 4)
**Breno valida:**
- ✅ Dashboard carrega dados do GitHub
- ✅ Filtros funcionam (país, empresa, tema)
- ✅ Responsivo (testado mobile)
- ✅ Charts renderizam sem erro

**Outcome:** Claude Code #2 pronto para integração

### Gate 4: E2E (FIM DE SEMANA 5)
**Breno valida:**
- ✅ Processor roda 9 AM → news.jsonl atualizado
- ✅ Dashboard reflete novos dados <5 minutos depois
- ✅ Todos filtros + buscas funcionam
- ✅ 0 erros no log

**Outcome:** Go-live aprovado

---

## 📞 Check-in Cadence

| When | Who | Format | Topic |
|------|-----|--------|-------|
| Segunda 9 AM | PMO + CC#1 | Async | Backend progress (logs, issues) |
| Quarta 9 AM | PMO + CC#2 | Async | Frontend progress (UX, data) |
| Sexta 2 PM | PMO + CC#1 + CC#2 + Breno | Chat | Weekly sync + blockers |

---

## 🚩 Risk Log

| ID | Risk | Owner | Mitigation | Status |
|----|------|-------|-----------|--------|
| R1 | Fetcher falha silenciosamente | CC#1 | Logging detalhado + email alert | 📋 |
| R2 | Duplicatas passam por dedup | CC#1 | Unit test com URLs conhecidas | 📋 |
| R3 | Dashboard carrega lentamente (1000+ artigos) | CC#2 | Lazy load ou paginação | 📋 |
| R4 | GitHub raw URL indisponível | PMO | Fallback localStorage cache | 📋 |
| R5 | Classificação tema_1 errada | CC#1 | Manual review periódica | 📋 |

---

**Versão:** 1.0  
**Data:** 2026-04-20  
**Próxima atualização:** Quando Breno der feedback

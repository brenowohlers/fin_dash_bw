# 📋 PMO Playbook — Sanitation News Intelligence Platform

**Project Owner:** Breno  
**Start Date:** 2026-04-20  
**Target Completion:** 2026-06-05 (6 weeks)  
**Status:** Design Phase ✓ | Development Phase → | Deployment Phase

---

## 🎯 Vision

Plataforma centralizada para monitoramento, coleta, classificação e análise de notícias do setor de saneamento (água, esgoto, energia, resíduos) cobrindo Brasil (nacional + SP + MG), Argentina, e perspectiva global/LatAm. Dashboard interativo alimentado por pipeline automatizado que roda diariamente às 9 AM BRT.

---

## 📊 Arquitetura de Alto Nível

```
Fontes (RSS + Web + APIs)
        ↓
Claude Code #1: Daily Processor (9 AM, todos os dias)
  ├─ Fetch de todas as fontes
  ├─ Deduplicação por URL
  ├─ Auto-classificação (tema_1, impacto)
  ├─ Geração de resumo_executivo (Claude API)
  └─ Append a news.jsonl + log diário
        ↓
GitHub Repository (source of truth)
  ├─ data/news.jsonl (append-only)
  ├─ logs/YYYY-MM-DD.txt (auditoria diária)
  └─ config/ (fontes, taxonomias, palavras-chave)
        ↓
Claude Code #2: Dashboard Builder (manual ou CI/CD)
  ├─ Lê news.jsonl via raw GitHub URL
  ├─ Renderiza HTML com filtros/buscas
  └─ Charts/analytics (Chart.js)
        ↓
Browser (User browsing)
  └─ Dashboard interativo com 3 abas: Today | Search | Analytics
```

---

## 🏗️ Governança & Responsabilidades

### PMO (Você)
- ✅ Validar alinhamento de requisitos entre os dois Claude Code instances
- ✅ Revisar estrutura do schema antes de qualquer codificação
- ✅ Aprovar mudanças de escopo ou campos
- ✅ Gerar prompts consolidados para cada fase
- ✅ Manter este playbook atualizado

### Claude Code #1: Daily Processor
**Role:** Backend intelligence engine  
**Responsável por:**
- Implementar fetchers (RSS, web scraping, APIs)
- Deduplicação robusta por URL
- Auto-classificação (tema_1, impacto, tom) com lógica clara
- Geração de resumo_executivo via Claude API
- Logging estruturado (erros, contagem, performance)
- Commits automáticos ao GitHub (dados + logs)

**Outputs:**
- `data/news.jsonl` (atualizado diariamente)
- `logs/YYYY-MM-DD.txt` (auditoria)
- `data/news-dedup.json` (índice de URLs processadas)

### Claude Code #2: Dashboard Builder
**Role:** Frontend visualization layer  
**Responsável por:**
- Ler `news.jsonl` via raw GitHub URL
- Parser robusto de JSONL (uma linha = um objeto)
- Filtros interativos (país, empresa, tema, impacto, tom, data)
- Busca full-text em titulo + descricao
- Renderização de cards com links diretos
- Gráficos Chart.js (temas ao longo do tempo, países, sentimento, empresas top)
- UX responsiva (desktop + mobile friendly)

**Outputs:**
- `dashboard/index.html`
- `dashboard/assets/app.js` + `style.css`

---

## 📐 Schema Definitivo (19 campos)

Todos os campos YYYY-MM-DD para datas, ISO8601 para timestamps. Arrays como JSON. Strings sem quebra de linha.

| # | Campo | Tipo | Obrigatório | Notas & Exemplos |
|----|-------|------|-----------|------------------|
| 1 | `data` | YYYY-MM-DD | ✓ | Data do fato principal. Ex: `2026-04-09` |
| 2 | `data_coleta` | ISO8601 | ✓ | Quando foi adicionado à base. Ex: `2026-04-09T08:32:59-03:00` |
| 3 | `pais` | string | ✓ | `Brasil`, `Argentina`, `Global`, `LatAm` |
| 4 | `estado_provincia` | string | ✗ | BR: `SP`, `MG`; AR: `Buenos Aires`, etc. |
| 5 | `empresa` | string[] | ✗ | Array JSON. Ex: `["Sabesp", "Aegea"]` — sem limite de um |
| 6 | `tema_1` | enum | ✓ | Valores: `economico`, `regulatorio`, `politico`, `juridico`, `operacional`, `social`, `ambiental`, `governanca` |
| 7 | `tema_2` | enum | ✗ | Mesmo enum que `tema_1`, opcional |
| 8 | `setor` | string | ✗ | `agua`, `esgoto`, `energia`, `residuos`, `multisservico` |
| 9 | `tipo_evento` | string | ✓ | `ma`, `ipo`, `regulacao`, `operacao`, `projeto-lei`, `acordo`, `desastre`, `decisao-judicial`, `announcement`, `noticia` |
| 10 | `titulo` | string | ✓ | Sem quebra de linha. Ex: `Copasa anuncia investimento de R$ 500M em infraestrutura` |
| 11 | `veiculo` | string | ✓ | Ex: `Valor Econômico`, `G1`, `El Clarín`, `Reuters` |
| 12 | `tipo_fonte` | enum | ✓ | `oficial`, `grande_midia`, `midia_local`, `stakeholder` |
| 13 | `descricao` | string | ✓ | 1-2 frases, factual, sem opinião. Ex: `A Copasa abriu consulta pública sobre revisão tarifária 2026-2029.` |
| 14 | `resumo_executivo` | string | ✓ | 2-4 frases, analítico, explica por que importa. Ex: `Revisão pode impactar rentabilidade e atrair investidores internacionais...` |
| 15 | `link` | URL | ✓ | Link completo da matéria. Ex: `https://valor.globo.com/...` |
| 16 | `tags` | string[] | ✗ | Array JSON. Ex: `["privatizacao", "wacc", "bh"]` |
| 17 | `impacto` | enum | ✓ | `alto`, `medio`, `baixo` — baseado em materialidade |
| 18 | `tom` | enum | ✓ | `positivo`, `negativo`, `neutro`, `misto` — para setor/empresas |
| 19 | `status_revisao` | enum | ✓ | `novo`, `revisado`, `consolidado` — padrão: `novo` |

### Exemplo de linha JSONL:
```json
{"data":"2026-04-09","data_coleta":"2026-04-09T08:32:59-03:00","pais":"Brasil","estado_provincia":"MG","empresa":["Copasa"],"tema_1":"regulatorio","tema_2":"economico","setor":"agua","tipo_evento":"regulacao","titulo":"Arsae abre consulta pública para revisão tarifária da Copasa 2026-2029","veiculo":"Diário do Comércio","tipo_fonte":"midia_local","descricao":"Arsae-MG abriu consulta pública com prazo de 30 dias para discussão dos parâmetros da revisão tarifária da Copasa para o ciclo 2026-2029.","resumo_executivo":"Avanço na agenda regulatória aumenta previsibilidade. Revisão tarifária é crítica para receita e percepção de investidores; consulta pública sinaliza processo transparente.","link":"https://diario-do-comercio.com/...","tags":["revisao-tarifaria","wacc","arsae","minas-gerais"],"impacto":"alto","tom":"positivo","status_revisao":"novo"}
```

---

## 📁 Estrutura GitHub

```
sanitation-news-intelligence/
│
├── data/
│   ├── news.jsonl                    # Append-only database
│   ├── news-dedup.json               # Índice de URLs (para dedup)
│   └── SCHEMA.md                     # Este schema em MD
│
├── logs/
│   ├── 2026-04-20.txt                # Daily log (o que foi feito, erros, stats)
│   ├── 2026-04-21.txt
│   └── README.md                     # Como ler os logs
│
├── config/
│   ├── sources.json                  # Lista de RSS feeds, sites, APIs
│   ├── keywords.json                 # Palavras-chave por país/empresa
│   ├── taxonomies.json               # Valores enumerados (tema_1, impacto, etc)
│   └── README.md
│
├── dashboard/
│   ├── index.html                    # Dashboard principal
│   ├── assets/
│   │   ├── app.js                    # Lógica de filtros, buscas, gráficos
│   │   └── style.css                 # Styling
│   └── README.md
│
├── claude-code/
│   ├── processor.py                  # Main runner (9 AM diariamente)
│   ├── fetchers.py                   # RSS, web scraping, APIs
│   ├── classifier.py                 # Auto-classificação (tema_1, impacto, etc)
│   ├── dedup.py                      # Deduplicação por URL
│   ├── requirements.txt              # Dependencies (requests, bs4, etc)
│   └── README.md
│
├── .github/
│   └── workflows/
│       └── daily-run.yml             # CI/CD trigger (opcional)
│
└── README.md                         # Overview do projeto

```

---

## 🎬 Fases de Desenvolvimento

### **Fase 1: Design & Setup (Semana 1-2)**
**Status:** ✅ Completo (você está aqui)

**Deliverables:**
- ✅ Schema final com 19 campos
- ✅ Arquitetura de alto nível aprovada
- ✅ Este PMO Playbook
- 📋 **Próximo:** Gerar prompts específicos para Claude Code #1 e #2

**Checklist:**
- [ ] Schema.md revisado por você e aprovado
- [ ] sources.json com RSS/sites/APIs preenchido
- [ ] keywords.json definido (palavras-chave por país/empresa)
- [ ] taxonomies.json com valores enumerados

---

### **Fase 2: Backend Development (Semana 3-4)**
**Claude Code #1 Focus**

**Sprints:**
1. **Sprint 2.1:** Fetchers básicos (RSS + web scraping)
   - Implementar `fetch_rss()` (requests + feedparser)
   - Implementar `fetch_web_scrape()` (BeautifulSoup)
   - Parse articles para estrutura padrão (titulo, descricao, link, veiculo, pais, empresa)
   - ✓ Teste com 5 URLs reais

2. **Sprint 2.2:** Deduplicação + classifição
   - Implementar `check_url_exists()` + `add_to_index()`
   - Implementar `classify_tema_1()` (lógica baseada em keywords + Claude API lightweight call)
   - Implementar `estimate_impacto()` (heurístico)
   - ✓ Teste com 20 artigos fictícios

3. **Sprint 2.3:** Daily processor + logging
   - Integrar todos os fetchers + dedup + classifier
   - Gerar `resumo_executivo` via Claude API (`claude-opus-4-6`)
   - Append a news.jsonl + commit
   - Logging estruturado (YYYY-MM-DD.txt)
   - ✓ Teste com dry-run (não escrever em produção)

**Deliverables:**
- `processor.py` + `fetchers.py` + `classifier.py` + `dedup.py`
- `requirements.txt` com deps (requests, feedparser, beautifulsoup4, anthropic)
- 1º rodada de dados no news.jsonl (~50 artigos iniciais)
- Logs diários funcionando

**Exit Criteria:**
- Processor roda sem erros
- Deduplicação funciona (não há duplicatas)
- Classificação é consistente (tema_1 faz sentido)
- Logs são legíveis e informativos

---

### **Fase 3: Frontend Development (Semana 4-5)**
**Claude Code #2 Focus**

**Sprints:**
1. **Sprint 3.1:** Dashboard base + carregamento de dados
   - HTML estrutura (navbar, 3 abas: Today, Search, Analytics)
   - Carregamento de news.jsonl via fetch() → URL raw GitHub
   - Parser JSONL robusto (trata linhas vazias, encoding)
   - Render cards com titulo, descricao, link, data, tema, impacto
   - ✓ Teste com dados do GitHub

2. **Sprint 3.2:** Filtros + buscas
   - Select dropdowns para: país, empresa, tema_1, impacto, tom, data range
   - Full-text search (titulo + descricao)
   - Apply filters → re-render tabela
   - ✓ Teste com 5+ filtros combinados

3. **Sprint 3.3:** Analytics + gráficos
   - Chart.js: Temas ao longo do tempo (últimos 30 dias)
   - Chart.js: Distribuição por país (pie/bar)
   - Chart.js: Sentimento over time (area chart)
   - Top mentioned companies (bar chart)
   - ✓ Teste com 100+ artigos

**Deliverables:**
- `index.html` + `app.js` + `style.css`
- Dashboard com 3 abas funcionando
- Filtros + buscas interativas
- 4 gráficos Chart.js

**Exit Criteria:**
- Dashboard carrega dados do GitHub em <3s
- Filtros funcionam sem lag
- Mobile responsivo (testado em 375px, 768px, 1024px)
- Gráficos renderizam corretamente com 50+ artigos

---

### **Fase 4: Integration & QA (Semana 5-6)**
**PMO + Claude Code #1 + #2**

**Sprints:**
1. **Sprint 4.1:** End-to-end test
   - Rodar processor.py localmente
   - Validar news.jsonl gerado
   - Carregar dashboard com dados reais
   - Verificar todos os filtros
   - Testar com diferentes quantidade de dados

2. **Sprint 4.2:** Performance + refinement
   - Otimizar parser JSONL (se carregamento > 5s)
   - Cache em localStorage para news.jsonl (opcional)
   - Refinar UX de filtros (usability test yourself)
   - Revisar classificações (5+ articles manual check)

3. **Sprint 4.3:** Deployment + automation
   - GitHub Actions `.github/workflows/daily-run.yml` OU local schedule
   - Documentação final (README.md de cada pasta)
   - Handoff para você usar

**Deliverables:**
- Tudo funcionando end-to-end
- Documentação completa
- Prompt consolidado para manutenção futura

**Exit Criteria:**
- Processor roda diariamente sem intervenção
- Dashboard sempre atualizado (próximo de 9 AM)
- 0 erros não tratados
- Você consegue operar sozinho

---

## 🔧 Diretrizes de Codificação

### Claude Code #1 (Backend)
1. **Modularidade:** Cada tipo de fonte em função separada (`fetch_rss`, `fetch_web_scrape`, `fetch_api`)
2. **Robustez:** Try-catch em tudo; log erros sem parar
3. **Deduplicação:** Sempre verificar URL antes de processar
4. **Logging:** Mensagens claras com timestamp (HH:MM:SS)
5. **JSON:** Usar `json.dumps(..., ensure_ascii=False)` para acentos
6. **Append-only:** NUNCA sobrescrever `news.jsonl`; apenas append

### Claude Code #2 (Frontend)
1. **Browser compat:** Testar em Chrome, Firefox, Safari
2. **Performance:** Limite a renderização de cards (~500 visíveis com scroll)
3. **Accessibility:** ARIA labels, keyboard navigation
4. **Responsiveness:** Mobile first (375px → 1440px)
5. **Dark mode:** Use CSS vars (já provided pelo host)
6. **No dependencies além de Chart.js:** Vanilla JS quando possível

---

## 📝 Taxonomias Definidas

### `tema_1` (valores permitidos)
```
economico, regulatorio, politico, juridico, operacional, social, ambiental, governanca
```

### `tipo_evento` (valores permitidos)
```
ma (mergers & acquisitions)
ipo (initial public offering)
regulacao (revisão tarifária, marco legal, etc)
operacao (obras, faltas de água, etc)
projeto-lei (tramitação política)
acordo (autocomposição, parcerias, etc)
desastre (crises, acidentes)
decisao-judicial (TCE, MP, tribunal)
announcement (comunicados corporativos)
noticia (genérico)
```

### `tipo_fonte` (valores permitidos)
```
oficial (governo, órgão regulador, companhia RI, CVM, B3)
grande_midia (Valor, G1, Folha, El Clarín, Reuters, Bloomberg)
midia_local (jornais regionais, portais locais)
stakeholder (sindicatos, associações, movimentos sociais, MP em manifestação pública)
```

### `impacto` (valores permitidos)
```
alto (alterar cronograma privatização, valuation, regulação, contrato material, percepção mercado)
medio (relevante mas não transformacional; afeta frente específica)
baixo (informativo; não altera leitura do caso significativamente)
```

### `tom` (valores permitidos)
```
positivo (reduz risco, melhora previsibilidade, cria oportunidade)
negativo (aumenta risco, piora percepção, cria entrave)
neutro (informativo, sem implicação direcional clara)
misto (vetores positivos E negativos relevantes ao mesmo tempo)
```

---

## 📊 Fontes Sugeridas (Config)

### RSS Feeds
- **Brasil & São Paulo:** Valor Econômico, G1, Folha, Estadão, Diário do Comércio
- **MG & COPASA:** Agência Minas (se tiver RSS), Portal de Notícias MG
- **Argentina:** El Clarín, El Cronista, Ámbito Financiero
- **Global/Latam:** Reuters, Bloomberg, GWI (se disponível)

### Web Scraping (sites-alvo)
- Arsae-MG website (notícias)
- Prefeitura de Belo Horizonte (imprensa)
- Sabesp RI (comunicados)
- COPASA RI (comunicados)
- AySA website

### APIs (gratuitos)
- NewsAPI.org (free tier: 100 req/dia)
- GNews API (free: 10 req/dia)
- MediaStack (free: 100 req/dia)

---

## ✅ Checklist de Revisão (Antes de gerar prompts finais)

### Schema & Requisitos
- [ ] 19 campos finalizados? Você quer fazer última alteração agora?
- [ ] Taxonomias (enum values) aprovadas?
- [ ] Exemplos de JSONL fazem sentido?

### Infraestrutura
- [ ] GitHub repo URL definida? (ex: `github.com/seu-usuario/sanitation-news-intelligence`)
- [ ] Você tem credenciais prontas para GitHub (SSH key ou token)?
- [ ] Credenciais para APIs (NewsAPI, etc) prontas?

### Escopo de Fontes
- [ ] RSS feeds priorizados? (quais primeiros?)
- [ ] Sites para scraping aprovados?
- [ ] Palavras-chave por país/empresa definidas?

### Expectativas de Saída
- [ ] Você quer logs diários em TXT ou outro formato?
- [ ] Dashboard hospedado onde? (GitHub Pages? você acessa via raw URL localmente?)
- [ ] Frequência de atualização final: 9 AM BRT todos os dias?

---

## 🚀 Próximos Passos (Quando você disser "PRONTO")

1. **Consolidar PMO feedback:** Você revisa este playbook, faz alterações, aprova.
2. **Gerar Prompt #1 (Claude Code - Dashboard Builder):** Instruções para construir o HTML dashboard + app.js
3. **Gerar Prompt #2 (Claude Code - Daily Processor):** Instruções para implementar o backend (fetchers, classifier, processor)
4. **Entregar ambos os prompts:** Você manda para Claude Code rodar

---

## 📞 Comunicação & Escalação

**Se houve mudança de requisito:**
- Atualize este playbook
- Reavalie fases afetadas
- Notifique ambos Claude Code instances

**Se um Claude Code quer validação:**
- Compartilhe o snippet comigo (PMO)
- Eu valido contra este playbook
- Aprovo ou sugiro ajuste

**Se surge edge case não previsto:**
- Documente no playbook
- Envie para Breno (você) decidir

---

## 📌 Notas de Projeto

### Decisões Tomadas
- **Format:** JSONL (1 objeto JSON por linha) para append-only com zero risco de corrupção
- **Dashboard:** HTML vanilla + Chart.js (sem framework pesado)
- **Processor:** Rodando diariamente, não real-time
- **Storage:** GitHub como source of truth (versionado, auditado)

### Riscos Identificados & Mitigações
| Risco | Impacto | Mitigation |
|-------|--------|-----------|
| Duplicatas de URL não detectadas | Dados sujos | Dedup robusto + log de warns |
| Processor falha silenciosamente | Data gap | Logging detalhado + alert automático |
| Dashboard carrega lentamente (muitos artigos) | UX ruim | Lazy loading ou paginação |
| Classificação incorreta (tema_1) | Analytics enviesada | Manual review periódica + feedback loop |
| GitHub raw URL indisponível | Dashboard quebra | Fallback local cache (localStorage) |

### Dívida Técnica (Para depois)
- [ ] Cache client-side de news.jsonl (localStorage)
- [ ] Paginação de resultados (se >1000 artigos)
- [ ] Full-text search otimizado (Algolia? ou ficar com JS?)
- [ ] Alertas de erro do processor (email ou webhook)
- [ ] Dashboard hospedado via GitHub Pages

---

**Última revisão:** 2026-04-20  
**Próxima revisão:** Quando você disser que quer ajustar algo  
**Mantido por:** PMO (Breno guidance)

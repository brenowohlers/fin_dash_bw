# 🎯 Sumário Executivo — Sanitation News Intelligence Platform

**Data:** 2026-04-20  
**Status:** Design Phase ✅ Complete → Ready for Development Phase  
**Próximo:** Aprovação de requisitos + Geração de prompts Claude Code

---

## ✅ O Que Está Pronto

### 1. **Visão & Arquitetura**
- ✅ Platform vision definida (3 regiões + 9 empresas + fontes múltiplas)
- ✅ Arquitetura de alto nível aprovada (Backend → GitHub → Frontend)
- ✅ Dois Claude Code instances identificados (Processor + Dashboard)
- ✅ Fluxo de dados mapeado (9 AM trigger → JSONL append → Live dashboard)

### 2. **Schema de Dados**
- ✅ 19 campos finalizados (redução modesta vs COPASA, mais flexível)
- ✅ Taxonomias definidas (tema_1, tipo_evento, tipo_fonte, impacto, tom)
- ✅ Exemplo JSONL validado
- ✅ Regras de preenchimento claras

### 3. **Estrutura de Governança**
- ✅ PMO Playbook (139 linhas de diretrizes)
- ✅ Task Matrix RACI (quem faz o quê em cada fase)
- ✅ Weekly Check-in Template (para rastrear progresso)
- ✅ Coordination Guidelines (contrato Backend ↔ Frontend)
- ✅ Roadmap de 6 semanas (4 fases claras)

### 4. **Infraestrutura Definida**
- ✅ GitHub repo structure (data/, logs/, config/, dashboard/, claude-code/)
- ✅ Daily processor schedule (9 AM BRT, todos os dias)
- ✅ Dashboard hosting (HTML raw access via GitHub)
- ✅ CI/CD ready (GitHub Actions template preparado)

---

## 📋 O Que Você Precisa Fazer AGORA

### Crítico (Bloqueia desenvolvimento)

#### 1. **Finalizar taxonomies.json** 
**O quê:** Enum values exatos para cada campo classificação  
**Exemplo:**
```json
{
  "tema_1": ["economico", "regulatorio", "politico", "juridico", "operacional", "social", "ambiental", "governanca"],
  "tipo_evento": ["ma", "ipo", "regulacao", "operacao", "projeto-lei", "acordo", "desastre", "decisao-judicial", "announcement", "noticia"],
  "tipo_fonte": ["oficial", "grande_midia", "midia_local", "stakeholder"],
  "impacto": ["alto", "medio", "baixo"],
  "tom": ["positivo", "negativo", "neutro", "misto"],
  "status_revisao": ["novo", "revisado", "consolidado"]
}
```
**Por quê:** Backend e Frontend precisam desses valores exatos para validação e dropdowns  
**Quem faz:** Você (Breno)  
**Prazo:** Antes de sexta (2026-04-24) para que PMO gere prompts

#### 2. **Definir sources.json (RSS + Web + APIs)**
**O quê:** Lista priorizada de fontes a monitorar  
**Decisões necessárias:**
- Quais RSS feeds entram no escopo inicial? (sugestão: 5-10 principais)
- Quais sites fazer web scraping? (sugestão: Arsae-MG, PBH, RI das empresas)
- Quais APIs usar? (sugestão: NewsAPI free tier)

**Exemplo:**
```json
{
  "rss_feeds": [
    { "name": "Valor Econômico", "url": "https://valor.globo.com/rss", "countries": ["Brasil"], "priority": 1 },
    { "name": "G1", "url": "https://g1.globo.com/rss", "countries": ["Brasil"], "priority": 2 }
  ],
  "scrape_targets": [
    { "name": "Arsae-MG", "url": "https://arsae.mg.gov.br/", "css_selector": ".noticia", "priority": 1 }
  ],
  "api_sources": [
    { "name": "NewsAPI", "key": "[ENV_VAR]", "query_template": "sanitation", "priority": 1 }
  ]
}
```
**Por quê:** Backend precisa saber onde buscar dados  
**Quem faz:** Você (validar com PMO)  
**Prazo:** Antes de sexta

#### 3. **Validar palavras-chave (keywords.json)**
**O quê:** Palavras-chave por país/empresa para classificação inteligente  
**Exemplo:**
```json
{
  "Brasil": {
    "geral": ["saneamento", "agua", "esgoto", "tarifa", "privatizacao"],
    "Sabesp": ["sabesp", "saneamento sp", "agua sao paulo", "rio tiete"],
    "Copasa": ["copasa", "agua minas", "belo horizonte", "arsae"]
  },
  "Argentina": {
    "AySA": ["aysa", "agua buenos aires", "ente agua"]
  }
}
```
**Por quê:** Melhora qualidade de classificação (tema_1, empresa matching)  
**Quem faz:** Você (Breno) em colaboração com PMO  
**Prazo:** Antes de sexta

---

### Importante (Afeta arquitetura)

#### 4. **Confirmar Dashboard Hosting**
**Decisão:** Como você quer acessar o dashboard?

- **Opção A (Recomendada):** Você abre HTML localmente → Dashboard lê news.jsonl via raw GitHub URL
  - Pros: Zero servidor, zero custo, super simples
  - Cons: Precisa ter internet, GitHub raw URL deve estar disponível
  
- **Opção B:** Deploy em GitHub Pages (`username.github.io/sanitation-news-intelligence`)
  - Pros: URL fixa, compartilhável
  - Cons: Um passo extra de deploy

**Você prefere:** [A / B]

#### 5. **Notificação de Erros do Processor**
**Decisão:** Como você quer saber se o processor falha?

- **Opção A (Simples):** Só verificar logs diários (logs/YYYY-MM-DD.txt)
- **Opção B:** Email com resumo diário (sucesso/falha)
- **Opção C:** Webhook para Slack/Discord

**Você prefere:** [A / B / C]

---

### Nice-to-have (Fase 2)

- [ ] Exportar dados (CSV/PDF)
- [ ] Compartilhar dashboard com team
- [ ] Análise por setor (água vs esgoto vs energia)
- [ ] Dashboard compartilhado em URL pública

---

## 📊 Documentos Gerados (Seu Projeto)

Salvos em `/home/claude/`:

1. **SANITATION_NEWS_PMO_PLAYBOOK.md** (139 linhas)
   - Visão, arquitetura, fases, diretrizes, checklist

2. **SANITATION_NEWS_TASK_MATRIX.md** (195 linhas)
   - RACI matrix, tarefas por fase, gate reviews, decisions pending

3. **SANITATION_NEWS_WEEKLY_TEMPLATE.md** (150 linhas)
   - Template para sync semanal com Claude Code instances

4. **SANITATION_NEWS_COORDINATION_GUIDELINES.md** (280 linhas)
   - Contrato Backend ↔ Frontend, interface JSONL, troubleshooting

**Total:** ~760 linhas de documentação de projeto pronta para você usar

---

## 🎬 Próximos Passos (Timeline)

### ✅ **Fase 0: Requirements Finalization (Esta semana)**
- [ ] Você completa taxonomies.json
- [ ] Você define sources.json
- [ ] Você valida keywords.json
- [ ] Você responde decisões de hosting + alertas
- [ ] **Entrada:** Semana 1, segunda 9 AM

### 🟡 **Fase 1.5: PMO Generates Prompts (Sexta)**
- [ ] PMO consolida seus inputs acima
- [ ] PMO gera **Prompt #1 (Dashboard Builder)** — instruções para Claude Code #2
- [ ] PMO gera **Prompt #2 (Daily Processor)** — instruções para Claude Code #1
- [ ] **Saída:** Sexta fim do dia, prompts prontos

### 🟠 **Fase 2: Backend Development (Semana 2-3)**
- [ ] Você envia Prompt #2 para Claude Code #1
- [ ] Claude Code #1 implementa processor.py + fetchers.py
- [ ] Você revisa código, testa, aprova (Gate 1)
- [ ] **Saída:** 10+ artigos em news.jsonl, sem erros

### 🟠 **Fase 3: Frontend Development (Semana 3-4)**
- [ ] Você envia Prompt #1 para Claude Code #2
- [ ] Claude Code #2 implementa dashboard HTML + app.js
- [ ] Você revisa código, testa, aprova (Gate 2)
- [ ] **Saída:** Dashboard funcional, carrega dados do GitHub

### 🟠 **Fase 4: Integration & QA (Semana 5-6)**
- [ ] Ambos Claude Code instances rodaram juntos
- [ ] E2E test: dados novos aparecem no dashboard <5 min (Gate 3)
- [ ] Deploy + documentação final
- [ ] **Saída:** Sistema ao vivo, processor roda diariamente

---

## 🎯 Gate Reviews (Seu Checklist)

### Gate 1: Schema & Config (Sexta 2026-04-24)
- [ ] taxonomies.json finalizado
- [ ] sources.json priorizado
- [ ] keywords.json validado
- [ ] Decisões de hosting + alertas confirmadas

**Outcome:** PMO gera prompts finais

### Gate 2: Backend MVP (28-04)
- [ ] processor.py roda localmente sem erros
- [ ] 10+ artigos em news.jsonl (estrutura correta)
- [ ] Zero duplicatas
- [ ] Classificações fazem sentido (5+ manual check)

**Outcome:** Claude Code #1 → Produção

### Gate 3: Frontend MVP (01-05)
- [ ] Dashboard carrega news.jsonl do GitHub
- [ ] Filtros funcionam (país, empresa, tema, impacto)
- [ ] Responsivo (mobile + desktop)
- [ ] Gráficos renderizam

**Outcome:** Claude Code #2 → Produção

### Gate 4: E2E (05-05)
- [ ] Backend + Frontend rodaram juntos
- [ ] Processor 9 AM → dados aparecem no dashboard <5 min
- [ ] 0 erros não tratados
- [ ] Você consegue operar sozinho

**Outcome:** Go-live aprovado

---

## 📞 Como Usar Este Playbook

### Para você (Breno)
1. **Leia** SANITATION_NEWS_PMO_PLAYBOOK.md (visão geral)
2. **Preencha** as decisões críticas acima (taxonomies, sources, keywords)
3. **Aguarde** PMO gerar prompts (sexta)
4. **Envie** prompts para Claude Code instances (segunda)
5. **Use** SANITATION_NEWS_WEEKLY_TEMPLATE.md para acompanhar progresso

### Para Claude Code #1 (Backend)
1. **Receba** Prompt #2 (gerado por PMO)
2. **Leia** SANITATION_NEWS_COORDINATION_GUIDELINES.md (interface)
3. **Implemente** processor.py + fetchers.py + classifier.py
4. **Teste** com dados reais
5. **Gate review** com PMO antes de produção

### Para Claude Code #2 (Frontend)
1. **Receba** Prompt #1 (gerado por PMO)
2. **Leia** SANITATION_NEWS_COORDINATION_GUIDELINES.md (interface)
3. **Implemente** dashboard HTML + app.js
4. **Teste** carregando dados do GitHub
5. **Gate review** com PMO antes de produção

---

## 🚀 Seus Inputs Necessários (Forma Checklist)

```
CRÍTICO (Sexta 24-04):
- [ ] taxonomies.json (enum values exatos)
- [ ] sources.json (RSS feeds, sites, APIs priorizados)
- [ ] keywords.json (palavras-chave por país/empresa)
- [ ] Dashboard hosting: Local OR GitHub Pages?
- [ ] Alertas do processor: Logs apenas OR Email OR Webhook?

CONFIRMAR:
- [ ] GitHub username para repo URL
- [ ] Timezone (BRT = UTC-3, correto?)
- [ ] Você quer rodar processor localmente via CLI ou CI/CD (GitHub Actions)?

OPCIONAL (Fase 2+):
- [ ] Exportar dados? (CSV/PDF)
- [ ] Compartilhar dashboard?
- [ ] Analisar por setor?
```

---

## 💡 Resumo: Você Está Aqui

**Hoje (20-04):**
- ✅ Design completo
- ✅ Governança em lugar
- ✅ Documentação pronta
- 📋 Esperando SEUS inputs (taxonomies, sources, keywords)

**Sexta (24-04):**
- 📋 PMO gera prompts consolidados

**Segunda (27-04):**
- 🚀 Você envia prompts para Claude Code #1 e #2
- 🚀 Desenvolvimento começa

**05-05:**
- 🎉 Sistema ao vivo

---

## ❓ Dúvidas?

Releia qualquer documento acima ou tire dúvida comigo (PMO). A ideia é que tudo seja auto-explicativo, mas estarei aqui para clarificar.

---

**Next Action:** Você envia respostas às decisões críticas acima → PMO gera Prompt #1 & #2 → Pronto para Claude Code!

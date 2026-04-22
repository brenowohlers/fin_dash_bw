# 📑 INDEX: Sanitation News Intelligence Platform — Complete Package

**Criado:** 2026-04-20  
**Status:** Gate 1 Complete ✅ → Ready for Prompt Generation  
**Total de arquivos:** 10 (7 documentos + 3 configs)  
**Total de linhas:** ~1500 linhas de documentação + configs

---

## 📚 Documentos de Governança (7 arquivos)

### 1. **SANITATION_NEWS_PMO_PLAYBOOK.md** (18 KB)
**O quê:** Blueprint completo do projeto  
**Contém:**
- Visão e arquitetura
- Schema 19 campos
- Roadmap 6 semanas (4 fases)
- Diretrizes de codificação
- Checklist de validação

**Quando ler:** Primeira vez para entender o projeto inteiro  
**Link:** `SANITATION_NEWS_PMO_PLAYBOOK.md`

---

### 2. **SANITATION_NEWS_TASK_MATRIX.md** (8.7 KB)
**O quê:** Quem faz o quê em cada fase (RACI matrix)  
**Contém:**
- Tarefas por fase com responsabilidades
- Gates de aprovação (4 gates)
- Decisões pendentes (checklist)
- Risk log
- Check-in cadence

**Quando ler:** Para entender divisão de trabalho  
**Link:** `SANITATION_NEWS_TASK_MATRIX.md`

---

### 3. **SANITATION_NEWS_COORDINATION_GUIDELINES.md** (12 KB)
**O quê:** Contrato Backend ↔ Frontend via GitHub  
**Contém:**
- Interface JSONL (formato + regras)
- Fluxo de dados diário
- Enumerações compartilhadas
- Validation & error handling
- Troubleshooting guide
- Deployment checklist

**Quando ler:** Claude Code #1 & #2 devem ler ANTES de codificar  
**Link:** `SANITATION_NEWS_COORDINATION_GUIDELINES.md`

---

### 4. **GITHUB_STRATEGY.md** (9.9 KB)
**O quê:** Como estruturar repo + publicar dashboard  
**Contém:**
- Estrutura de pasta GitHub
- Dashboard: Opção 1 (Local HTML) vs Opção 2 (GitHub Pages)
- Processor: GitHub Actions (automático) vs Local (manual)
- Fluxo completo (exemplo)
- Secrets & credenciais
- Operação diária

**Quando ler:** Antes de criar o repo GitHub  
**Link:** `GITHUB_STRATEGY.md`

---

### 5. **SANITATION_NEWS_WEEKLY_TEMPLATE.md** (3.9 KB)
**O quê:** Template para semanal sync meetings  
**Contém:**
- Backend progress checklist
- Frontend progress checklist
- Integration points
- Blockers
- Action items

**Quando usar:** Toda sexta para acompanhar progresso  
**Link:** `SANITATION_NEWS_WEEKLY_TEMPLATE.md`

---

### 6. **SANITATION_NEWS_EXECUTIVE_SUMMARY.md** (11 KB)
**O quê:** Status atual + seus próximos passos  
**Contém:**
- O que está pronto
- O que você precisa fazer
- Decisões críticas (respondidas ✅)
- Próximos passos com timeline
- Como usar o playbook

**Quando ler:** Agora, para entender onde estamos  
**Link:** `SANITATION_NEWS_EXECUTIVE_SUMMARY.md`

---

### 7. **GATE_1_SIGN_OFF.md** (7.6 KB) ← **READ FIRST**
**O quê:** Confirmação de que Design & Setup está 100% completo  
**Contém:**
- Todas as decisões críticas tomadas ✅
- Deliverables gerados
- Schema final confirmado
- Architecture confirmada
- Handoff checklist para Claude Code
- Go-live timeline

**Quando ler:** AGORA (confirme tudo, aprove, diga "Gate 1 Approved")  
**Link:** `GATE_1_SIGN_OFF.md`

---

## ⚙️ Configuration Files (3 arquivos)

### 1. **config_taxonomies.json** (981 bytes)
**O quê:** Enum values para todos os campos classification  
**Contém:**
- tema_1: 8 valores
- tema_2: 8 valores
- tipo_evento: 11 valores
- tipo_fonte: 4 valores
- setor: 5 valores
- pais: 4 valores
- impacto: 3 valores
- tom: 4 valores
- status_revisao: 3 valores

**Uso:** Backend & Frontend ambos leem este arquivo para validação  
**Link:** `config_taxonomies.json`

---

### 2. **config_sources.json** (3.7 KB)
**O quê:** 17 fontes de notícias estruturadas  
**Contém:**
- 4 RSS feeds (Valor, G1, Diário do Comércio, Reuters)
- 8 web scraping targets (Arsae, Sabesp RI, Copasa RI, Aegea RI, BRK RI, AySA, Sanepar, Igua)
- 2 API sources (NewsAPI, GNews)
- Priority levels + keywords por fonte

**Uso:** Backend (Processor) lê este arquivo para saber onde buscar dados  
**Link:** `config_sources.json`

---

### 3. **config_keywords.json** (3.6 KB)
**O quê:** Palavras-chave para classificação smart  
**Contém:**
- By Country: Brasil (6 states), Argentina, Global, LatAm
- By Company: Sabesp, Copasa, Aegea, BRK, Sanepar, Igua, AySA + international
- By Theme: Privatização, Regulação, Operação, Ambiental, Jurídico, Social
- Tags separadas por contexto

**Uso:** Backend usa para melhorar classificação (tema_1, empresa detection)  
**Link:** `config_keywords.json`

---

## 📋 Quick Navigation by Role

### Para VOCÊ (Breno) — PMO
**Leia PRIMEIRO:**
1. ✅ `GATE_1_SIGN_OFF.md` — Confirme que tudo está pronto
2. 📖 `SANITATION_NEWS_EXECUTIVE_SUMMARY.md` — Entenda status
3. 📖 `SANITATION_NEWS_PMO_PLAYBOOK.md` — Visão geral

**Use SEMANALMENTE:**
- `SANITATION_NEWS_WEEKLY_TEMPLATE.md` — Sync meeting template
- `SANITATION_NEWS_TASK_MATRIX.md` — Rastrear progresso

**Quando precisar:**
- `GITHUB_STRATEGY.md` — Setup do repo
- `SANITATION_NEWS_COORDINATION_GUIDELINES.md` — Troubleshooting

---

### Para Claude Code #1 (Daily Processor)
**Leia PRIMEIRO:**
1. 📖 `SANITATION_NEWS_COORDINATION_GUIDELINES.md` — Entenda interface
2. ⚙️ `config_taxonomies.json` — Enum values
3. ⚙️ `config_sources.json` — Onde buscar dados
4. ⚙️ `config_keywords.json` — Palavras-chave para classificação

**Depois receba:** Prompt #2 (gerado por PMO)

---

### Para Claude Code #2 (Dashboard Builder)
**Leia PRIMEIRO:**
1. 📖 `SANITATION_NEWS_COORDINATION_GUIDELINES.md` — Entenda interface JSONL
2. ⚙️ `config_taxonomies.json` — Enum values para dropdowns
3. 📖 `GITHUB_STRATEGY.md` — Opção 1 vs 2 para publicação

**Depois receba:** Prompt #1 (gerado por PMO)

---

## 🎯 Your Next Actions (In Order)

### ✅ TODAY (20-04)
- [ ] Leia `GATE_1_SIGN_OFF.md` completamente
- [ ] Valide que todas as decisões fazem sentido
- [ ] Confirme os 3 configs: taxonomies, sources, keywords
- [ ] Responda: "Gate 1 Approved" ou "Preciso ajustar X"

### 🟡 THIS WEEK (21-24)
- [ ] Revise `SANITATION_NEWS_PMO_PLAYBOOK.md` (se quiser entender melhor)
- [ ] Comece a pensar em GitHub repo: nome, URL
- [ ] Se usar GitHub Actions: prepare ANTHROPIC_API_KEY secret

### 🟠 FRIDAY (24-04)
- [ ] PMO gera Prompt #1 & #2 (após sua aprovação Gate 1)
- [ ] Você revisa os prompts
- [ ] Eles ficam prontos para enviar para Claude Code na segunda

### 🚀 MONDAY (27-04)
- [ ] Crie o repo GitHub (ou diga ao PMO para criar)
- [ ] Envie Prompt #1 para Claude Code #2 (Dashboard)
- [ ] Envie Prompt #2 para Claude Code #1 (Processor)
- [ ] Ambos começam desenvolvimento em paralelo

---

## 📁 File Locations

**Todos os arquivos estão em:** `/home/claude/`

### Documentos
```
/home/claude/SANITATION_NEWS_PMO_PLAYBOOK.md
/home/claude/SANITATION_NEWS_TASK_MATRIX.md
/home/claude/SANITATION_NEWS_COORDINATION_GUIDELINES.md
/home/claude/GITHUB_STRATEGY.md
/home/claude/SANITATION_NEWS_WEEKLY_TEMPLATE.md
/home/claude/SANITATION_NEWS_EXECUTIVE_SUMMARY.md
/home/claude/GATE_1_SIGN_OFF.md
```

### Configs
```
/home/claude/config_taxonomies.json
/home/claude/config_sources.json
/home/claude/config_keywords.json
```

---

## 🎯 Success Criteria (Gate 1 Complete ✅)

- [x] Schema 19 campos finalizados
- [x] Taxonomias definidas (enums exatos)
- [x] Sources listadas (17 fontes)
- [x] Keywords estruturadas (país + empresa)
- [x] GitHub strategy definida
- [x] PMO playbook + governance docs
- [x] Coordination guidelines
- [x] Roadmap 6 semanas
- [x] RACI matrix
- [x] Esta Gate 1 sign-off

**Result:** 🟢 Ready to proceed to Prompt Generation

---

## 📞 How to Use This Package

### Se você quer ENTENDER o projeto:
1. Leia `GATE_1_SIGN_OFF.md` (5 min)
2. Leia `SANITATION_NEWS_EXECUTIVE_SUMMARY.md` (10 min)
3. Browse `SANITATION_NEWS_PMO_PLAYBOOK.md` conforme necessário

### Se você quer OPERAR:
1. Estude `GITHUB_STRATEGY.md` para setup
2. Guarde `SANITATION_NEWS_COORDINATION_GUIDELINES.md` (troubleshooting)
3. Use `SANITATION_NEWS_WEEKLY_TEMPLATE.md` toda sexta

### Se você quer COMPARTILHAR com Claude Code:
1. Copie os 3 configs (taxonomies, sources, keywords)
2. Compartilhe `SANITATION_NEWS_COORDINATION_GUIDELINES.md`
3. Envie o Prompt #1 ou #2 quando gerado

---

## 🚀 Ready?

**Próximo passo:** Diga "Gate 1 Approved" e eu gero Prompt #1 & #2 para você enviar para Claude Code.

---

**Index criado:** 2026-04-20  
**Documentos:** 7 (PMO docs)  
**Configs:** 3 (JSON files)  
**Total:** 10 arquivos  
**Status:** ✅ Complete — Ready to deploy

Tudo pronto! 🎉

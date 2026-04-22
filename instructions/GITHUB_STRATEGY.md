# 🚀 GitHub Strategy — Sanitation News Intelligence Platform

**Objetivo:** Repo único no GitHub que funciona como source of truth, com dashboard acessível de forma simples.

---

## 📁 Estrutura Recomendada

```
sanitation-news-intelligence/
│
├── README.md                         # Overview + links rápidos
├── .gitignore                        # Ignore node_modules, .env, __pycache__
│
├── data/
│   ├── news.jsonl                   # 🔴 CRITICAL: Append-only database
│   ├── news-dedup.json              # Índice de URLs (deduplicação)
│   └── SCHEMA.md                    # Documentação dos 19 campos
│
├── logs/
│   ├── 2026-04-20.txt               # Daily processor log
│   ├── 2026-04-21.txt
│   └── README.md                    # Como ler logs
│
├── config/
│   ├── taxonomies.json              # ✅ Enum values (tema_1, impacto, etc)
│   ├── sources.json                 # ✅ RSS, web scraping targets, APIs
│   ├── keywords.json                # ✅ Keywords por país/empresa
│   └── README.md                    # Como usar configs
│
├── dashboard/
│   ├── index.html                   # 🎨 Dashboard (pode abrir localmente!)
│   ├── assets/
│   │   ├── app.js                   # Lógica (fetch, parse, render, charts)
│   │   ├── style.css                # Styling
│   │   └── README.md                # Como customizar
│   └── README.md                    # Como usar o dashboard
│
├── claude-code/
│   ├── processor.py                 # 🤖 Daily runner (9 AM BRT)
│   ├── fetchers.py                  # RSS + web scraping + APIs
│   ├── classifier.py                # Auto-classificação
│   ├── dedup.py                     # Deduplicação por URL
│   ├── requirements.txt             # pip install -r requirements.txt
│   └── README.md                    # Como rodar localmente
│
├── .github/
│   └── workflows/
│       └── daily-run.yml            # ✅ GitHub Actions (opcional)
│
└── GOVERNANCE.md                    # Este projeto tem PMO playbook
```

---

## 🎨 Dashboard: Opção 1 (Recomendada) — Local File + GitHub Raw URL

### Fluxo
```
Você clona o repo localmente
  ↓
Você abre dashboard/index.html no browser (File → Open)
  ↓
Dashboard carrega news.jsonl via GitHub raw URL automaticamente
  ↓
Filtros, buscas, gráficos funcionam
```

### Por quê funciona
- ✅ Zero servidor necessário
- ✅ Zero custo
- ✅ Você controla quando atualizar (git pull)
- ✅ Funciona offline depois de 1ª carga (localStorage cache)

### Como usar
```bash
# 1. Clone o repo
git clone https://github.com/seu-usuario/sanitation-news-intelligence.git
cd sanitation-news-intelligence

# 2. Abra o dashboard
open dashboard/index.html  # macOS
start dashboard/index.html # Windows
xdg-open dashboard/index.html # Linux

# 3. Dashboard carrega dados automaticamente
#    (quando Claude Code processor rodar 9 AM, você faz git pull e refrescar browser)
```

### GitHub Raw URL (para o dashboard)
```javascript
// Em app.js, a URL será:
const RAW_NEWS_URL = 'https://raw.githubusercontent.com/seu-usuario/sanitation-news-intelligence/main/data/news.jsonl';

// Dashboard faz fetch desta URL automaticamente
fetch(RAW_NEWS_URL)
  .then(r => r.text())
  .then(text => parseJSONL(text))
  .then(articles => render(articles))
```

**Importante:** GitHub raw URL reflete as mudanças em ~1-2 minutos após push. Ou você faz hard refresh (Cmd+Shift+R) para forçar.

---

## 🎨 Dashboard: Opção 2 — GitHub Pages (Alternativa)

### Se você quer URL fixa + compartilhável

```bash
# 1. Habilite GitHub Pages no repo settings
#    Settings → Pages → Source: main branch, folder: /root

# 2. Dashboard fica disponível em:
#    https://seu-usuario.github.io/sanitation-news-intelligence/

# 3. Sempre atualizado automaticamente quando você faz push
```

**Vantagens:**
- ✅ URL fixa e compartilhável
- ✅ Sempre atualizado (sem git pull manual)

**Desvantagens:**
- 1 passo extra (habilitar Pages)
- Requer que repo seja público (não private)

---

## 🤖 Processor: Como Rodar Diariamente

### Opção A: GitHub Actions (Automático ✅ Recomendado)

**Arquivo:** `.github/workflows/daily-run.yml`

```yaml
name: Daily News Processor

on:
  schedule:
    - cron: '0 12 * * *'  # 12 UTC = 9 AM BRT (UTC-3)

jobs:
  process:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Para manter histórico completo
      
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: pip install -r claude-code/requirements.txt
      
      - name: Run processor
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          NEWSAPI_KEY: ${{ secrets.NEWSAPI_KEY }}
        run: python claude-code/processor.py
      
      - name: Commit and push
        run: |
          git config user.name "Sanitation News Bot"
          git config user.email "bot@sanitation-news.local"
          git add data/news.jsonl data/news-dedup.json logs/
          git commit -m "Daily news update: $(date +%Y-%m-%d)" || echo "No changes"
          git push
```

**Setup:**
1. Crie secrets no GitHub (Settings → Secrets):
   - `ANTHROPIC_API_KEY` (sua chave Claude API)
   - `NEWSAPI_KEY` (se usar NewsAPI)
2. GitHub Actions roda automaticamente 9 AM BRT
3. Commits automáticos ao repo

**Vantagens:**
- ✅ Totalmente automático
- ✅ 0 intervenção sua
- ✅ Histórico de commits automático

---

### Opção B: Local Trigger (Manual)

Se preferir rodar manualmente ou em máquina local:

```bash
cd claude-code/
export ANTHROPIC_API_KEY="sk-..."
python processor.py
```

Depois você faz:
```bash
git add ../data/ ../logs/
git commit -m "Daily update: $(date +%Y-%m-%d)"
git push
```

---

## 📊 Fluxo Completo (Exemplo)

```
09:00 AM BRT — Terça-feira
  ↓
GitHub Actions dispara (ou você roda manualmente)
  ↓
Claude Code Processor:
  ├─ Fetch RSS feeds
  ├─ Web scraping (Arsae, Sabesp RI, etc)
  ├─ Query APIs (NewsAPI, GNews)
  ├─ Classificar (tema_1, impacto, etc)
  ├─ Append a data/news.jsonl
  └─ Commit & push para GitHub
  ↓
09:05 AM — GitHub repo atualizado
  ↓
Você (ou anyone) abre dashboard/index.html
  ↓
Dashboard faz fetch da raw URL
  ↓
~2 minutos → Dados aparecem no dashboard ✅
```

---

## 🔐 Secrets & Credenciais

### No GitHub (Se usar GitHub Actions)

```bash
# Settings → Secrets and variables → Actions
ANTHROPIC_API_KEY=sk-...
NEWSAPI_KEY=xxx
GNEWS_API_KEY=xxx
```

### Localmente (Se rodar manual)

```bash
# .env (gitignore'd)
ANTHROPIC_API_KEY=sk-...
NEWSAPI_KEY=xxx
GNEWS_API_KEY=xxx

# Load em processor.py:
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv('ANTHROPIC_API_KEY')
```

---

## 📝 Checklist: Setup GitHub

### Inicial
- [ ] Criar repo `sanitation-news-intelligence` no GitHub
- [ ] Clone localmente
- [ ] Criar estrutura de pastas (data/, logs/, config/, dashboard/, claude-code/)
- [ ] Commit inicial com README.md + .gitignore

### Configuração
- [ ] Upload config/ (taxonomies.json, sources.json, keywords.json)
- [ ] Upload dashboard/ (index.html, assets/)
- [ ] Upload claude-code/ (processor.py, requirements.txt, etc)
- [ ] Criar .github/workflows/daily-run.yml

### Secrets (se usar GitHub Actions)
- [ ] Ir em Settings → Secrets → Add ANTHROPIC_API_KEY
- [ ] Add NEWSAPI_KEY, GNEWS_API_KEY

### Teste
- [ ] Rodar processor.py localmente (test dry-run)
- [ ] Validar news.jsonl gerado
- [ ] Abrir dashboard/index.html, verificar se carrega dados
- [ ] Fazer push para GitHub

---

## 🚀 Depois: Operação Diária

### Se GitHub Actions (Automático)
```
Você não faz nada! 🎉
GitHub roda 9 AM BRT automaticamente
Dados aparecem no repo
Você abre dashboard quando quiser
```

### Se Manual (Local)
```
08:55 AM — Você abre terminal
cd claude-code/
python processor.py
# ... espera alguns segundos ...
git add ../data/ ../logs/
git commit -m "Daily update"
git push

# Depois:
git pull  # Se quiser dados mais recentes
# Refresh browser ou hard refresh (Cmd+Shift+R)
```

---

## 📊 Estrutura de Commit

Cada vez que o processor roda:

```
Commit message: "Daily news update: 2026-04-21"

Files changed:
  - data/news.jsonl (+23 lines, append-only)
  - data/news-dedup.json (updated index)
  - logs/2026-04-21.txt (new log file)

Histórico fica limpo e auditável
```

---

## 🔍 Como Verificar Status

### Ver último commit
```bash
git log --oneline -n 5
# Output:
# a3f2e1c Daily news update: 2026-04-21
# b2c3d4e Daily news update: 2026-04-20
# ...
```

### Ver tamanho do news.jsonl
```bash
wc -l data/news.jsonl  # Conta linhas (artigos)
du -h data/news.jsonl  # Tamanho do arquivo
```

### Ver último log processado
```bash
tail -20 logs/$(date +%Y-%m-%d).txt
```

---

## ⚠️ Cuidados

### NUNCA
- ❌ Edite news.jsonl manualmente (append-only!)
- ❌ Rebase ou force-push em main (histórico é importante)
- ❌ Delete logs/ (auditoria)

### SEMPRE
- ✅ Faça git pull antes de qualquer operação local
- ✅ Review logs diários se houver erros
- ✅ Commit com mensagens descritivas

---

## 📌 Resumo: Seu Setup Recomendado

```
GitHub Repo:
  ✅ Public (para raw URLs funcionarem)
  
Dashboard Access:
  ✅ Opção 1: Local HTML (recomendado)
     - Clone repo
     - Abra dashboard/index.html
     - Dados carregam do GitHub raw URL
  
Processor Automation:
  ✅ Opção A: GitHub Actions (9 AM BRT)
     - Setup: 5 minutos
     - Depois: Zero intervenção
     
Resultado:
  ✅ Dados atualizados diariamente
  ✅ Dashboard sempre reflete últimas notícias
  ✅ Histórico completo em repo
  ✅ Zero servidor, zero custo
```

---

**Próximo:** Pronto para eu gerar os prompts para Claude Code #1 & #2?

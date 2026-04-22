# 🤝 Diretrizes de Coordenação: Claude Code #1 ↔ Claude Code #2

**Este documento define o contrato entre o Backend (Daily Processor) e Frontend (Dashboard).**

---

## 🎯 Princípio Fundamental

**Backend e Frontend são **desacoplados** e se comunicam **exclusivamente via GitHub.**

Não há chamadas diretas, webhooks complexos, ou interdependências de código. O Backend escreve dados, o Frontend lê dados. Ambos operan independentemente.

---

## 📦 Interface: news.jsonl

### Localização
```
GitHub: https://raw.githubusercontent.com/[seu-usuario]/sanitation-news-intelligence/main/data/news.jsonl
```

### Formato
- **Tipo:** JSONL (JSON Lines — 1 objeto JSON válido por linha)
- **Encoding:** UTF-8 com BOM opcional
- **Linhas vazias:** Ignorar (robustez)
- **Objetos inválidos:** Frontend ignora linhas que não parseiam

### Contrato de Objeto

Cada linha deve ser um JSON object com **EXATAMENTE** estes campos (ordem não importa):

```json
{
  "data": "YYYY-MM-DD",
  "data_coleta": "ISO8601",
  "pais": "string",
  "estado_provincia": "string | null",
  "empresa": ["string", ...],
  "tema_1": "string (enum)",
  "tema_2": "string (enum) | null",
  "setor": "string | null",
  "tipo_evento": "string (enum)",
  "titulo": "string",
  "veiculo": "string",
  "tipo_fonte": "string (enum)",
  "descricao": "string",
  "resumo_executivo": "string",
  "link": "URL string",
  "tags": ["string", ...] | [],
  "impacto": "string (enum: alto|medio|baixo)",
  "tom": "string (enum: positivo|negativo|neutro|misto)",
  "status_revisao": "string (enum: novo|revisado|consolidado)"
}
```

### Regras Rigorosas

**Backend:**
- ✅ DEVE escrever todas 19 chaves em cada objeto
- ✅ DEVE usar `null` para campos opcionais vazios (não omitir a chave)
- ✅ DEVE garantir que `link` é URL válida
- ✅ DEVE garantir que `data` e `data_coleta` estão em formato correto
- ✅ DEVE fazer `json.dumps(..., ensure_ascii=False)` para acentos
- ❌ NÃO deve quebrar linha dentro de valores de string
- ❌ NÃO deve omitir chaves
- ❌ NÃO deve sobrescrever news.jsonl (append-only)

**Frontend:**
- ✅ DEVE ser robusto contra objetos incompletos ou com tipo errado
- ✅ DEVE ignorar silenciosamente linhas que não parseiam
- ✅ DEVE cache em localStorage (se muito lento carregar)
- ✅ DEVE refrescar dados a cada X minutos (configurável)
- ❌ NÃO deve enviar dados para Backend
- ❌ NÃO deve confiar que news.jsonl nunca vai ter linhas inválidas

### Exemplo Válido

```json
{"data":"2026-04-09","data_coleta":"2026-04-09T08:32:59-03:00","pais":"Brasil","estado_provincia":"MG","empresa":["Copasa","Arsae"],"tema_1":"regulatorio","tema_2":"economico","setor":"agua","tipo_evento":"regulacao","titulo":"Arsae abre consulta pública para revisão tarifária da Copasa 2026-2029","veiculo":"Diário do Comércio","tipo_fonte":"midia_local","descricao":"Arsae-MG abriu consulta pública com prazo de 30 dias para discussão dos parâmetros da revisão tarifária da Copasa para o ciclo 2026-2029.","resumo_executivo":"Avanço na agenda regulatória. Revisão tarifária é crítica para receita; consulta pública sinaliza processo transparente e melhora previsibilidade.","link":"https://diario-do-comercio.com/noticias/arsae-abre-consulta","tags":["revisao-tarifaria","wacc","arsae","minas-gerais"],"impacto":"alto","tom":"positivo","status_revisao":"novo"}
```

---

## 🔄 Fluxo de Dados Diário

```
9:00 AM BRT
  ↓
Claude Code #1: Processor.py executa
  ├─ Fetch from RSS, web, APIs
  ├─ Parse articles
  ├─ Classify (tema_1, impacto, etc)
  ├─ Generate resumo_executivo
  └─ Append X artigos a news.jsonl
  ↓
news.jsonl atualizado no GitHub
  ↓
~9:05 AM: GitHub raw URL reflete as mudanças (propagar)
  ↓
Claude Code #2: Dashboard (browser)
  ├─ User abre dashboard (ou refrescar)
  ├─ Fetch news.jsonl via raw GitHub URL
  ├─ Parse JSONL
  ├─ Renderizar cards + atualizar gráficos
  └─ Mostrar dados <5 segundos
  ↓
User vê notícias do dia ✅
```

---

## 📋 Enumerations Compartilhadas

**Backend E Frontend devem usar EXATAMENTE estes valores:**

### tema_1 (8 valores)
```
economico, regulatorio, politico, juridico, operacional, social, ambiental, governanca
```

### tipo_evento (10 valores)
```
ma, ipo, regulacao, operacao, projeto-lei, acordo, desastre, decisao-judicial, announcement, noticia
```

### tipo_fonte (4 valores)
```
oficial, grande_midia, midia_local, stakeholder
```

### impacto (3 valores)
```
alto, medio, baixo
```

### tom (4 valores)
```
positivo, negativo, neutro, misto
```

### status_revisao (3 valores)
```
novo, revisado, consolidado
```

**NOTA:** Se houver discrepância (ex: Backend grava `reviado` em vez de `revisado`), Frontend renderiza como está. **Não há validação cross-layer.**

---

## 🔍 Validação & Error Handling

### Backend (Claude Code #1)

**Se algo falhar:**
1. Log com timestamp, erro, e contexto
2. **Continue com próximo item** (não parar tudo)
3. Escriba o que conseguiu (append ao news.jsonl)
4. Salve o erro no log diário
5. **Não lance exceção** para cima (silent fail com log)

**Exemplo:**
```
[2026-04-21 09:15:32] Fetching RSS: https://valor.globo.com/rss
[2026-04-21 09:15:45] Found 25 articles from RSS
[2026-04-21 09:15:46] Error fetching https://site-down.com: Connection timeout
[2026-04-21 09:15:46] Skipped 1 sources due to error. Continuing...
[2026-04-21 09:16:10] Classified 23 unique articles
[2026-04-21 09:16:25] Generated resumos for 23 articles
[2026-04-21 09:16:26] Appended 23 articles to news.jsonl
[2026-04-21 09:16:27] === Run completed: 23 new articles added, 1 error (non-fatal) ===
```

### Frontend (Claude Code #2)

**Se algo falhar ao carregar news.jsonl:**
1. Tentar carregar 3x com 5s delay entre tentativas
2. Se falha persistir, mostrar mensagem: "Dados não carregados. Última sincronização: [timestamp]"
3. Mostrar dados em cache (localStorage) se disponível
4. Refrescar automaticamente a cada 5 minutos

**Exemplo:**
```javascript
async function loadNews() {
  const maxRetries = 3;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const resp = await fetch(GITHUB_RAW_URL, { cache: 'no-store' });
      const text = await resp.text();
      const articles = parseJSONL(text);
      return articles;
    } catch (e) {
      if (i < maxRetries - 1) await sleep(5000);
    }
  }
  // Fallback to cache
  return loadFromLocalStorage('newsCache');
}
```

---

## 🔐 Shared Configuration

### Enum Values (Source of Truth)
- **File:** `config/taxonomies.json`
- **Owner:** PMO (Breno)
- **Updated:** Quando houver mudança de requisito
- **Frontend:** Lê em tempo de load (dropdown populate)
- **Backend:** Valida contra enum ao classificar

### Keywords por País/Empresa
- **File:** `config/keywords.json`
- **Owner:** Backend usa para classificação
- **Format:**
```json
{
  "Brasil": {
    "Sabesp": ["sabesp", "saneamento sp", "agua sao paulo"],
    "Copasa": ["copasa", "minas gerais", "arsae"]
  },
  "Argentina": {
    "AySA": ["aysa", "agua buenos aires"]
  }
}
```

### Fontes a Monitorar
- **File:** `config/sources.json`
- **Owner:** Backend (Claude Code #1)
- **Format:**
```json
{
  "rss_feeds": [
    { "name": "Valor Econômico", "url": "https://valor.globo.com/rss" },
    { "name": "G1", "url": "https://g1.globo.com/rss" }
  ],
  "scrape_targets": [
    { "name": "Arsae-MG", "url": "https://arsae.mg.gov.br/noticia" }
  ],
  "api_sources": [
    { "name": "NewsAPI", "key": "[ENV_VAR]" }
  ]
}
```

---

## 🎛️ Configurações Frontend

### Constantes
```javascript
// app.js — comuns entre Claude Code #2
const GITHUB_REPO = 'https://raw.githubusercontent.com/[username]/sanitation-news-intelligence';
const RAW_NEWS_URL = `${GITHUB_REPO}/main/data/news.jsonl`;
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const GITHUB_LOAD_TIMEOUT_MS = 10000; // 10 seconds
const LOCAL_CACHE_KEY = 'sanitation_news_cache';
```

### Filtros Disponíveis
```javascript
const FILTERS = {
  pais: ['Brasil', 'Argentina', 'Global', 'LatAm'],
  empresa: [...unique from data],
  tema_1: [...from taxonomies.json],
  impacto: ['alto', 'medio', 'baixo'],
  tom: ['positivo', 'negativo', 'neutro', 'misto'],
  data_range: '[start_date, end_date]'
};
```

---

## 📞 Troubleshooting Guide

### Cenário: News.jsonl não está atualizado

**Possíveis causas:**
1. Backend não rodou (verificar se 9 AM passa)
2. Backend rodou mas teve erro (verificar log diário)
3. GitHub raw URL cache (esperar 5 minutos)

**Ação:**
- Backend: Verificar `logs/YYYY-MM-DD.txt` último
- Frontend: Forçar refresh (Ctrl+Shift+R no browser)

### Cenário: Frontend mostra dados antigos

**Possíveis causas:**
1. localStorage cache ativo (dados de 1 dia atrás)
2. Browser cache do raw GitHub URL
3. Dashboard não foi refrescado desde ontem

**Ação:**
- Frontend: Clear localStorage (`localStorage.clear()` no console)
- Browser: Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

### Cenário: Classificação (tema_1) está errada em alguns artigos

**Possíveis causas:**
1. Keywords.json não capturou contexto
2. Título/descrição é ambíguo
3. Claude API teve interpretação diferente

**Ação:**
- Backend: Revisar keywords.json, adicionar context
- Manual: Marcar artigo como "revisado" em status_revisao
- Future: Feedback loop com Claude para melhorar classifier

### Cenário: Duplicatas aparecem no dashboard

**Possíveis causas:**
1. Deduplicação falhou (mesmo artigo, URLs diferentes)
2. Artigo foi reeditado no mesmo dia

**Ação:**
- Backend: Revisar dedup.py logic
- Frontend: Deduplicate manualmente (filter by link)
- Policy decision: Você quer manter reedições ou filtrar?

---

## 🚀 Deployment Checklist (Pre-Go-Live)

### Backend (Claude Code #1)
- [ ] processor.py executa sem erros
- [ ] news.jsonl tem >10 artigos com estrutura correta
- [ ] Não há duplicatas (verificar news-dedup.json)
- [ ] Classificações fazem sentido (5+ manual checks)
- [ ] Logs estão estruturados e legíveis
- [ ] GitHub commits estão sendo feitos automaticamente
- [ ] Rodou 2+ dias sem intervenção

### Frontend (Claude Code #2)
- [ ] Dashboard carrega news.jsonl do GitHub
- [ ] Cards renderizam corretamente
- [ ] Todos filtros funcionam (país, empresa, tema, impacto, tom, date range)
- [ ] Busca full-text funciona
- [ ] Gráficos Chart.js renderizam sem erro
- [ ] Mobile responsivo (testado 375px, 768px, 1024px)
- [ ] Erro handling: mostra mensagem se dados não carregam
- [ ] Performance: page load <5s com 100+ artigos

### Integration
- [ ] Backend + Frontend rodaram juntos sem erro
- [ ] Dashboard mostra dados processados pelo Backend
- [ ] E2E test: dados novos aparecem no dashboard <5 min após processor rodar
- [ ] Ambos podem rodar independentemente sem impactar um ao outro

---

## 📌 Princípios de Manutenção Futura

1. **Schema é imutável:** Uma vez definido, adicionar novo campo requer coordenação
2. **Backwards compatibility:** Frontend deve lidar com versões antigas de news.jsonl
3. **Logging é king:** Mais logs = melhor debugging
4. **No shared state:** Backend e Frontend não compartilham estado (apenas dados via GitHub)
5. **Fail gracefully:** Se um falha, outro continua funcionando

---

**Última atualização:** 2026-04-20  
**Mantido por:** PMO (Breno guidance)  
**Review sugerido:** Quando mudar schema ou arquitetura

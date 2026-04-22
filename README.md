# 🌊 Sanitation News Intelligence Dashboard

Um dashboard interativo para análise de notícias sobre saneamento básico, água, energia e resíduos sólidos. Consolida informações de múltiplas fontes jornalísticas em uma plataforma unificada com análise estratégica.

## 📋 Características

### 🎯 Aba "Today" (Hoje)
- **7 artigos destacados** com alto impacto e análise estratégica profunda
- **6 seções temáticas**: Privatização, SABESP, Brasil, Argentina/LatAm, Global/OCDE, Infraestrutura
- Cada artigo mostra:
  - Título, fonte e data de publicação
  - 2 bullets: resumo operacional + análise estratégica
  - Subtags (tema secundário, setor, país)
  - Link direto para o artigo original

### 🔍 Aba "Search & Filter"
- **Filtros multi-campo**:
  - País (Brasil, Argentina, LatAm, Global)
  - Empresa (Sabesp, Copasa, BRK, AySA, etc.)
  - Tema (regulatorio, economico, ambiental, social, juridico, operacional, politico, governanca)
  - Impacto (alto, médio, baixo)
  - Tom (positivo, negativo, neutro, misto)
  - Intervalo de datas
- **Busca full-text** em títulos e descrições
- Visualização em **Cards** ou **Tabela**
- Paginação com infinite scroll

### 📊 Aba "Analytics"
- **4 resumos executivos**: Total de artigos, Novos hoje, Top empresa, Tema em tendência
- **Citações por Tema** (últimos 30 dias): Artigos de alto impacto agrupados por tema
- **4 gráficos interativos** com Chart.js:
  1. Distribuição de notícias por tema (últimos 30 dias)
  2. Distribuição por país
  3. Sentimento ao longo do tempo (área stacked)
  4. Top 10 empresas mencionadas

## 🚀 Acesso Online

O dashboard está hospedado em GitHub Pages e pode ser acessado em:

**[https://seu-usuario.github.io/fin_dash_bw/dashboard/](https://seu-usuario.github.io/fin_dash_bw/dashboard/)**

*(Substitua `seu-usuario` pelo seu username do GitHub)*

## 🛠️ Uso Local

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (para carregar Chart.js do CDN)

### Instalação Local
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/fin_dash_bw.git
   cd fin_dash_bw
   ```

2. Inicie um servidor HTTP local:
   ```bash
   # Usando Python 3
   python -m http.server 8000
   
   # Ou usando Node.js (http-server)
   npx http-server dashboard -c-1
   ```

3. Abra no navegador:
   ```
   http://localhost:8000/dashboard/
   ```

## 📊 Estrutura de Dados

Os artigos são armazenados em `dashboard/sample-data.jsonl` (JSONL - JSON Lines):

```json
{
  "data": "2026-04-20",
  "pais": "Brasil",
  "empresa": ["Sabesp"],
  "tema_1": "regulatorio",
  "tema_2": "economico",
  "setor": "agua",
  "titulo": "Sabesp reajusta tarifas em 6,11%...",
  "veiculo": "Poder360",
  "descricao": "...",
  "resumo_executivo": "...",
  "link": "https://www.poder360.com.br/...",
  "impacto": "alto",
  "tom": "neutro",
  "tags": ["sabesp", "tarifa", "sp"]
}
```

### Campos Obrigatórios
- `data`: Data da notícia (YYYY-MM-DD)
- `pais`: País (Brasil, Argentina, LatAm, Global)
- `empresa`: Array de empresas mencionadas
- `tema_1`: Tema principal
- `setor`: Setor (agua, esgoto, energia, residuos, multisservico)
- `titulo`: Título da notícia
- `veiculo`: Fonte/publicação
- `descricao`: Resumo breve
- `resumo_executivo`: 1-2 frases-chave
- `link`: URL da notícia original
- `impacto`: alto, medio, baixo
- `tom`: positivo, negativo, neutro, misto

## 🎨 Tema Claro/Escuro

O dashboard detecta automaticamente a preferência do sistema operacional (light/dark mode) via `prefers-color-scheme`. Clique no botão 🌙 **Theme** na navbar para alternar manualmente.

## 🔗 Fontes de Dados

O dashboard agrega notícias de publicações verificadas:

- **Brasil**: Valor Econômico, Folha de S.Paulo, O Globo, Diário do Comércio, Infomoney, Brazil Journal, Diário Catarinense, etc.
- **Argentina**: La Nación, Clarín, Infobea
- **Global**: Reuters, Bloomberg, CNN, OCDE, Banco Mundial, ONU

Todas as URLs são reais e verificadas.

## 📈 Performance

- **Carregamento**: < 2 segundos (arquivo JSONL de ~100KB)
- **Filtros**: Aplicados em tempo real (< 500ms para 1000+ artigos)
- **Charts**: Renderizados com Chart.js 3.9+
- **Responsividade**: Otimizado para desktop (1024px+) e tablet (768px+)

## 🔄 Atualização de Dados

Para adicionar novos artigos:

1. Adicione uma linha JSON ao final de `dashboard/sample-data.jsonl`
2. Respeite a estrutura de campos obrigatórios
3. Faça commit: `git add dashboard/sample-data.jsonl && git commit -m "Add new articles"`
4. Faça push: `git push origin main`
5. GitHub Pages atualiza automaticamente em ~1 minuto

## 💡 Dicas de Uso

### Análise Estratégica
A seção em itálico após cada artigo contém análise estratégica com:
- **Impacto em WACC e margens** (temas regulatórios)
- **Impacto em cash flows** (temas econômicos)
- **Risco de licença social** (temas sociais)
- **Timeline de implementação** (decisões judiciais)

### Filtros Eficientes
- Use **Country + Company** para análise por operadora
- Use **Theme + Impact** para identificar riscos estratégicos
- Use **Date Range + Tone** para trend analysis

### Exportação de Dados
Atualmente, use a visualização em **Table** do Search & Filter para copiar dados em formato estruturado.

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Charting**: Chart.js 3.9.1
- **Data Format**: JSONL (JSON Lines)
- **Hosting**: GitHub Pages
- **Responsiveness**: CSS Grid + Flexbox

## 📝 Licença

Este projeto está disponível sob licença MIT. Sinta-se livre para usar, modificar e distribuir.

## 👨‍💻 Autor

Dashboard de Inteligência em Saneamento  
Desenvolvido com Claude Assistant (Anthropic)  
Abril de 2026

---

**Acesse agora**: [Dashboard Online](https://seu-usuario.github.io/fin_dash_bw/dashboard/)

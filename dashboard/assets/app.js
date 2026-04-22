// ============================================================================
// SANITATION NEWS DASHBOARD - MAIN APPLICATION
// ============================================================================

// Configuration: Enums and constants
const TAXONOMIES = {
  tema_1: ['economico', 'regulatorio', 'politico', 'juridico', 'operacional', 'social', 'ambiental', 'governanca'],
  tema_2: ['economico', 'regulatorio', 'politico', 'juridico', 'operacional', 'social', 'ambiental', 'governanca'],
  tipo_evento: ['ma', 'ipo', 'follow-on', 'regulacao', 'operacao', 'projeto-lei', 'acordo', 'desastre', 'decisao-judicial', 'announcement', 'noticia'],
  tipo_fonte: ['oficial', 'grande_midia', 'midia_local', 'stakeholder'],
  setor: ['agua', 'esgoto', 'energia', 'residuos', 'multisservico'],
  pais: ['Brasil', 'Argentina', 'Global', 'LatAm'],
  impacto: ['alto', 'medio', 'baixo'],
  tom: ['positivo', 'negativo', 'neutro', 'misto'],
  status_revisao: ['novo', 'revisado', 'consolidado']
};

const THEME_COLORS = {
  economico: '#3B82F6', regulatorio: '#14B8A6', politico: '#8B5CF6', juridico: '#F97316',
  operacional: '#FBBF24', social: '#EC4899', ambiental: '#10B981', governanca: '#6B7280'
};

const IMPACT_COLORS = { alto: '#EF4444', medio: '#FBBF24', baixo: '#9CA3AF' };

const TONE_COLORS = {
  positivo: '#10B981', negativo: '#EF4444', neutro: '#9CA3AF', misto: '#FBBF24'
};

const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/brenowohlers/fin_dash_bw/main/data/news.jsonl';
const RESULTS_PER_PAGE = 50;
const TODAY_RANGE_DAYS = 1;
const ANALYTICS_RANGE_DAYS = 30;

// Global state
let allArticles = [];
let filteredArticles = [];
let currentViewMode = 'cards';
let currentPage = 0;
let chartsInstances = {};

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Initializing dashboard...');

    const newsText = await loadNews();
    if (!newsText) {
      showError('Unable to load news data. Please check your connection.');
      return;
    }

    allArticles = parseJSONL(newsText);
    console.log(`Loaded ${allArticles.length} articles`);

    if (allArticles.length === 0) {
      showError('No articles found in data source.');
      return;
    }

    allArticles.sort((a, b) => new Date(b.data) - new Date(a.data));

    setupTabNavigation();
    setupThemeToggle();

    switchTab('today');
  } catch (error) {
    console.error('Error initializing app:', error);
    showError('Failed to initialize dashboard. Check console for details.');
  }
});

async function loadNews() {
  try {
    console.log('Fetching local sample-data.jsonl...');
    const response = await fetch('./sample-data.jsonl', { cache: 'no-store' });
    if (response.ok) {
      const text = await response.text();
      localStorage.setItem('newsCache', text);
      localStorage.setItem('lastUpdate', new Date().toISOString());
      console.log('✓ Loaded from local sample-data.jsonl');
      return text;
    }
  } catch (error) {
    console.warn('Could not load local sample-data.jsonl:', error.message);
  }

  const maxRetries = 3;
  const retryDelay = 5000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Fetching from GitHub (attempt ${i + 1}/${maxRetries})...`);
      const response = await fetch(GITHUB_RAW_URL, { cache: 'no-store' });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const text = await response.text();
      localStorage.setItem('newsCache', text);
      localStorage.setItem('lastUpdate', new Date().toISOString());
      console.log('✓ Loaded from GitHub');
      return text;
    } catch (error) {
      console.warn(`GitHub fetch attempt ${i + 1} failed:`, error.message);
      if (i < maxRetries - 1) await sleep(retryDelay);
    }
  }

  console.log('Falling back to localStorage cache...');
  const cached = localStorage.getItem('newsCache');
  if (cached) {
    console.log('✓ Using cached data from localStorage');
    return cached;
  }

  return null;
}

function parseJSONL(text) {
  const articles = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    try {
      const article = JSON.parse(trimmed);
      if (article.data && article.titulo && article.link) {
        articles.push(article);
      }
    } catch (error) {
      console.warn(`Skipping malformed line`);
    }
  }

  return articles;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setupTabNavigation() {
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      switchTab(button.getAttribute('data-tab'));
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));

  const tab = document.getElementById(`${tabId}-tab`);
  if (tab) tab.classList.add('active');

  const button = document.querySelector(`[data-tab="${tabId}"]`);
  if (button) button.classList.add('active');

  switch (tabId) {
    case 'today': renderToday(); break;
    case 'search': renderSearch(); break;
    case 'analytics': renderAnalytics(); break;
  }
}

function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      console.log('Theme toggle clicked');
    });
  }
}

function renderToday() {
  const content = document.getElementById('today-tab');
  if (!content) return;

  // Get high-impact articles for featured section
  const featuredArticles = allArticles
    .filter(a => a.impacto === 'alto')
    .slice(0, 7);

  if (featuredArticles.length === 0) {
    content.innerHTML = '<div class="empty-state"><h3>No high-impact articles today</h3><p>Check back later for updates.</p></div>';
    return;
  }

  // Theme-based sections
  const themes = [
    { key: 'privatizacao', label: '🏛️ Privatização (COPASA, SABESP)', keywords: ['privatiza'] },
    { key: 'sabesp', label: '💧 SABESP', keywords: ['sabesp'] },
    { key: 'saneamento-br', label: '🇧🇷 Saneamento Brasil', keywords: ['brasil'] },
    { key: 'latam', label: '🌎 Saneamento LatAm', keywords: ['argentina', 'latam', 'chile'] },
    { key: 'global', label: '🌍 Saneamento Global', keywords: ['global', 'oecd', 'banco mundial'] },
    { key: 'infraestrutura', label: '🏗️ Infraestrutura Brasil', keywords: ['infraestrutura', 'operacional'] }
  ];

  let html = `
    <div class="homepage-container">
      <section class="featured-section">
        <h2 class="section-title">📰 Notícias Destaque (Alto Impacto)</h2>
        <div class="featured-grid">
  `;

  featuredArticles.forEach(article => {
    html += renderFeaturedCard(article);
  });

  html += `
        </div>
      </section>

      <section class="themes-section">
  `;

  themes.forEach(theme => {
    const themeArticles = allArticles.filter(a => {
      const searchText = (a.titulo + ' ' + a.descricao + ' ' + (a.empresa || []).join(' ')).toLowerCase();
      return theme.keywords.some(kw => searchText.includes(kw.toLowerCase()));
    }).slice(0, 15);

    if (themeArticles.length > 0) {
      html += `
        <div class="theme-section">
          <h3 class="theme-title">${theme.label}</h3>
          <div class="theme-cards">
      `;

      themeArticles.forEach(article => {
        html += renderThemeCard(article);
      });

      html += `
          </div>
        </div>
      `;
    }
  });

  html += `
      </section>
    </div>
  `;

  content.innerHTML = html;
  setupCardListeners();
}

function renderSearch() {
  const content = document.getElementById('search-tab');
  if (!content) return;

  const paisOptions = TAXONOMIES.pais.map(p => `<option value="${p}">${p}</option>`).join('');
  const temaOptions = TAXONOMIES.tema_1.map(t => `<option value="${t}">${t}</option>`).join('');
  const impactoOptions = TAXONOMIES.impacto.map(i => `<option value="${i}">${i}</option>`).join('');
  const tonOptions = TAXONOMIES.tom.map(t => `<option value="${t}">${t}</option>`).join('');

  content.innerHTML = `
    <div class="filter-panel">
      <div class="filter-grid">
        <div class="filter-group">
          <label for="filter-pais">Country</label>
          <select id="filter-pais">
            <option value="">All</option>
            ${paisOptions}
          </select>
        </div>
        <div class="filter-group">
          <label for="filter-empresa">Company</label>
          <select id="filter-empresa" multiple></select>
        </div>
        <div class="filter-group">
          <label for="filter-tema">Theme</label>
          <select id="filter-tema">
            <option value="">All</option>
            ${temaOptions}
          </select>
        </div>
        <div class="filter-group">
          <label for="filter-impacto">Impact</label>
          <select id="filter-impacto">
            <option value="">All</option>
            ${impactoOptions}
          </select>
        </div>
        <div class="filter-group">
          <label for="filter-tom">Tone</label>
          <select id="filter-tom">
            <option value="">All</option>
            ${tonOptions}
          </select>
        </div>
        <div class="filter-group">
          <label for="filter-date-from">Date From</label>
          <input type="date" id="filter-date-from" />
        </div>
        <div class="filter-group">
          <label for="filter-date-to">Date To</label>
          <input type="date" id="filter-date-to" />
        </div>
        <div class="filter-group">
          <label for="search-input">Search</label>
          <input type="text" id="search-input" placeholder="Search title + description" />
        </div>
      </div>
      <div class="filter-actions">
        <button class="btn btn-primary" id="btn-search">Apply Filters</button>
        <button class="btn btn-secondary" id="btn-reset">Reset</button>
      </div>
    </div>
    <div id="results-container"></div>
  `;

  const companies = [...new Set(allArticles.flatMap(a => a.empresa || []))].sort();
  const empresaSelect = document.getElementById('filter-empresa');
  empresaSelect.innerHTML = companies.map(c => `<option value="${c}">${c}</option>`).join('');

  document.getElementById('btn-search').addEventListener('click', applyFilters);
  document.getElementById('btn-reset').addEventListener('click', resetFilters);
  document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') applyFilters();
  });

  applyFilters();
}

function applyFilters() {
  const pais = document.getElementById('filter-pais')?.value || '';
  const empresas = Array.from(document.getElementById('filter-empresa')?.selectedOptions || []).map(o => o.value);
  const tema = document.getElementById('filter-tema')?.value || '';
  const impacto = document.getElementById('filter-impacto')?.value || '';
  const tom = document.getElementById('filter-tom')?.value || '';
  const dateFrom = document.getElementById('filter-date-from')?.value || '';
  const dateTo = document.getElementById('filter-date-to')?.value || '';
  const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';

  filteredArticles = allArticles.filter(article => {
    if (pais && article.pais !== pais) return false;
    if (tema && article.tema_1 !== tema) return false;
    if (impacto && article.impacto !== impacto) return false;
    if (tom && article.tom !== tom) return false;

    if (empresas.length > 0) {
      const articleEmpresas = article.empresa || [];
      const hasMatch = empresas.some(e => articleEmpresas.includes(e));
      if (!hasMatch) return false;
    }

    if (dateFrom && article.data < dateFrom) return false;
    if (dateTo && article.data > dateTo) return false;

    if (searchTerm) {
      const titulo = (article.titulo || '').toLowerCase();
      const descricao = (article.descricao || '').toLowerCase();
      if (!titulo.includes(searchTerm) && !descricao.includes(searchTerm)) return false;
    }

    return true;
  });

  currentPage = 0;
  renderSearchResults();
}

function resetFilters() {
  document.getElementById('filter-pais').value = '';
  document.getElementById('filter-empresa').selectedIndex = -1;
  document.getElementById('filter-tema').value = '';
  document.getElementById('filter-impacto').value = '';
  document.getElementById('filter-tom').value = '';
  document.getElementById('filter-date-from').value = '';
  document.getElementById('filter-date-to').value = '';
  document.getElementById('search-input').value = '';

  filteredArticles = allArticles;
  currentPage = 0;
  renderSearchResults();
}

function renderSearchResults() {
  const container = document.getElementById('results-container');
  if (!container) return;

  const totalResults = filteredArticles.length;
  const resultsPerPage = RESULTS_PER_PAGE;
  const startIdx = currentPage * resultsPerPage;
  const endIdx = Math.min(startIdx + resultsPerPage, totalResults);
  const pageResults = filteredArticles.slice(startIdx, endIdx);

  let html = `
    <div class="results-header">
      <div class="results-count">${totalResults} articles match your criteria</div>
      <div class="view-toggle">
        <button class="view-btn ${currentViewMode === 'cards' ? 'active' : ''}" data-view="cards">Cards</button>
        <button class="view-btn ${currentViewMode === 'table' ? 'active' : ''}" data-view="table">Table</button>
      </div>
    </div>
  `;

  if (totalResults === 0) {
    html += '<div class="empty-state"><h3>No results</h3><p>Try adjusting your filters.</p></div>';
    container.innerHTML = html;
    return;
  }

  if (currentViewMode === 'cards') {
    html += '<div class="cards-grid">';
    pageResults.forEach(article => {
      html += renderNewsCard(article);
    });
    html += '</div>';
  } else {
    html += `
      <table class="results-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Company</th>
            <th>Theme</th>
            <th>Impact</th>
            <th>Tone</th>
          </tr>
        </thead>
        <tbody>
          ${pageResults.map(a => `
            <tr style="cursor: pointer;" onclick="window.open('${a.link}', '_blank')">
              <td>${a.data}</td>
              <td><strong>${a.titulo}</strong></td>
              <td>${(a.empresa || []).join(', ')}</td>
              <td>${a.tema_1}</td>
              <td><span class="badge badge-impact badge-impact-${a.impacto}">${a.impacto}</span></td>
              <td><span class="badge badge-tone badge-tone-${a.tom}">${a.tom}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  if (endIdx < totalResults) {
    html += `
      <div class="load-more-container">
        <button class="load-more" id="btn-load-more">Load More (${endIdx}/${totalResults})</button>
      </div>
    `;
  }

  container.innerHTML = html;

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentViewMode = btn.getAttribute('data-view');
      currentPage = 0;
      renderSearchResults();
    });
  });

  document.getElementById('btn-load-more')?.addEventListener('click', () => {
    currentPage++;
    renderSearchResults();
  });

  setupCardListeners();
}

function renderAnalytics() {
  const content = document.getElementById('analytics-tab');
  if (!content) return;

  const last30Days = filterLast30Days(allArticles);
  const summaryData = {
    totalArticles: allArticles.length,
    newToday: allArticles.filter(a => a.data === new Date().toISOString().split('T')[0]).length,
    topCompany: getTopCompany(allArticles),
    trendingTheme: getTrendingTheme(last30Days)
  };

  const themeQuotes = getThemeQuotes(last30Days);
  const quotesHtml = Object.entries(themeQuotes)
    .map(([theme, quote]) => {
      if (!quote) return '';
      return `
        <div class="quote-card" onclick="window.open('${quote.link}', '_blank')">
          <div class="quote-theme">${theme.toUpperCase()}</div>
          <p class="quote-text">"${quote.titulo}"</p>
          <p class="quote-summary">→ ${quote.resumo}</p>
          <div class="quote-meta">
            <span class="quote-source">${quote.veiculo}</span>
            <span class="quote-date">${quote.data}</span>
          </div>
        </div>
      `;
    })
    .join('');

  content.innerHTML = `
    <div class="summary-cards">
      <div class="summary-card">
        <div class="summary-label">Total Articles</div>
        <div class="summary-value">${summaryData.totalArticles}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">New Today</div>
        <div class="summary-value">${summaryData.newToday}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Top Company</div>
        <div class="summary-value">${summaryData.topCompany || 'N/A'}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Trending Theme</div>
        <div class="summary-value">${summaryData.trendingTheme}</div>
      </div>
    </div>

    <div class="quotes-section">
      <h2 class="quotes-title">📌 Citações por Tema (Últimos 30 Dias)</h2>
      <div class="quotes-grid">
        ${quotesHtml}
      </div>
    </div>

    <div class="charts-container">
      <div class="chart-wrapper">
        <h3 class="chart-title">News by Theme (Last 30 Days)</h3>
        <canvas id="chart-theme"></canvas>
      </div>
      <div class="chart-wrapper">
        <h3 class="chart-title">News by Country</h3>
        <canvas id="chart-country"></canvas>
      </div>
      <div class="chart-wrapper">
        <h3 class="chart-title">Sentiment Over Time (Last 30 Days)</h3>
        <canvas id="chart-sentiment"></canvas>
      </div>
      <div class="chart-wrapper">
        <h3 class="chart-title">Top 10 Companies</h3>
        <canvas id="chart-companies"></canvas>
      </div>
    </div>
  `;

  setTimeout(() => {
    renderCharts(last30Days);
  }, 100);
}

function renderCharts(articlesLast30Days) {
  Object.values(chartsInstances).forEach(chart => chart?.destroy?.());
  chartsInstances = {};

  const themeData = getThemeData(articlesLast30Days);
  const themeCtx = document.getElementById('chart-theme');
  if (themeCtx) {
    chartsInstances.theme = new Chart(themeCtx, {
      type: 'bar',
      data: themeData,
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
  }

  const countryData = getCountryData(allArticles);
  const countryCtx = document.getElementById('chart-country');
  if (countryCtx) {
    chartsInstances.country = new Chart(countryCtx, {
      type: 'doughnut',
      data: countryData,
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  }

  const sentimentData = getSentimentData(articlesLast30Days);
  const sentimentCtx = document.getElementById('chart-sentiment');
  if (sentimentCtx) {
    chartsInstances.sentiment = new Chart(sentimentCtx, {
      type: 'line',
      data: sentimentData,
      options: { responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
    });
  }

  const companiesData = getTopCompaniesData(allArticles);
  const companiesCtx = document.getElementById('chart-companies');
  if (companiesCtx) {
    chartsInstances.companies = new Chart(companiesCtx, {
      type: 'bar',
      data: companiesData,
      options: { indexAxis: 'y', responsive: true, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true } } }
    });
  }
}

function filterLast30Days(articles) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - ANALYTICS_RANGE_DAYS);
  const cutoffStr = cutoffDate.toISOString().split('T')[0];
  return articles.filter(a => a.data >= cutoffStr);
}

function getTopCompany(articles) {
  const counts = {};
  articles.forEach(a => {
    (a.empresa || []).forEach(e => {
      counts[e] = (counts[e] || 0) + 1;
    });
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
}

function getTrendingTheme(articles) {
  const counts = {};
  articles.forEach(a => {
    const theme = a.tema_1;
    counts[theme] = (counts[theme] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
}

function getThemeQuotes(articles) {
  const quotesByTheme = {};

  // Para cada tema, pega o artigo de alto impacto mais recente
  TAXONOMIES.tema_1.forEach(theme => {
    const themeArticles = articles
      .filter(a => a.tema_1 === theme && a.impacto === 'alto')
      .sort((a, b) => new Date(b.data) - new Date(a.data));

    if (themeArticles.length > 0) {
      const article = themeArticles[0];
      quotesByTheme[theme] = {
        titulo: article.titulo,
        resumo: article.resumo_executivo || article.descricao?.substring(0, 120),
        veiculo: article.veiculo,
        data: article.data,
        link: article.link
      };
    }
  });

  return quotesByTheme;
}

function getThemeData(articles) {
  const counts = {};
  TAXONOMIES.tema_1.forEach(t => (counts[t] = 0));
  articles.forEach(a => {
    if (a.tema_1) counts[a.tema_1]++;
  });
  return {
    labels: Object.keys(counts),
    datasets: [{
      label: 'Articles',
      data: Object.values(counts),
      backgroundColor: Object.keys(counts).map(t => THEME_COLORS[t] || '#999')
    }]
  };
}

function getCountryData(articles) {
  const counts = {};
  articles.forEach(a => {
    const country = a.pais;
    counts[country] = (counts[country] || 0) + 1;
  });
  return {
    labels: Object.keys(counts),
    datasets: [{
      data: Object.values(counts),
      backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#FBBF24']
    }]
  };
}

function getSentimentData(articles) {
  const weekData = {};
  articles.forEach(a => {
    const date = new Date(a.data);
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];

    if (!weekData[weekKey]) {
      weekData[weekKey] = { positivo: 0, negativo: 0, neutro: 0, misto: 0 };
    }
    weekData[weekKey][a.tom]++;
  });

  const labels = Object.keys(weekData).sort();
  const tones = ['positivo', 'negativo', 'neutro', 'misto'];
  const datasets = tones.map((tone, idx) => ({
    label: tone,
    data: labels.map(w => weekData[w][tone] || 0),
    borderColor: ['#10B981', '#EF4444', '#9CA3AF', '#FBBF24'][idx],
    backgroundColor: ['rgba(16, 185, 129, 0.1)', 'rgba(239, 68, 68, 0.1)', 'rgba(156, 163, 175, 0.1)', 'rgba(251, 191, 36, 0.1)'][idx],
    fill: true
  }));

  return { labels, datasets };
}

function getTopCompaniesData(articles) {
  const counts = {};
  articles.forEach(a => {
    (a.empresa || []).forEach(e => {
      counts[e] = (counts[e] || 0) + 1;
    });
  });

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return {
    labels: sorted.map(([company]) => company),
    datasets: [{
      label: 'Mentions',
      data: sorted.map(([, count]) => count),
      backgroundColor: '#3B82F6'
    }]
  };
}

function renderFeaturedCard(article) {
  const resumo = article.resumo_executivo || 'N/A';
  const analise = generateStrategicAnalysis(article);

  const subtags = [];
  if (article.tema_2) subtags.push(article.tema_2);
  if (article.setor) subtags.push(article.setor);
  if (article.pais) subtags.push(article.pais);
  const subtagsHtml = subtags.map(tag => `<span class="subtag">${tag}</span>`).join('');

  return `
    <div class="featured-card" onclick="window.open('${article.link}', '_blank')">
      <div class="featured-header">
        <h3 class="featured-title">${article.titulo}</h3>
        <div class="featured-badges">
          <span class="badge badge-theme">${article.tema_1}</span>
          <span class="badge badge-impact badge-impact-${article.impacto}">${article.impacto}</span>
        </div>
      </div>
      <div class="featured-body">
        <p class="featured-bullet">• ${resumo}</p>
        <p class="featured-bullet featured-analysis">💡 ${analise}</p>
      </div>
      ${subtagsHtml ? `<div class="featured-subtags">${subtagsHtml}</div>` : ''}
      <div class="featured-footer">
        <span class="featured-source">${article.veiculo}</span>
        <span class="featured-date">${article.data}</span>
      </div>
    </div>
  `;
}

function renderThemeCard(article) {
  const resumo = article.resumo_executivo || article.descricao?.substring(0, 100) || 'N/A';

  const subtags = [];
  if (article.setor) subtags.push(article.setor);
  if (article.pais) subtags.push(article.pais);
  const subtagsHtml = subtags.map(tag => `<span class="subtag">${tag}</span>`).join('');

  return `
    <div class="theme-card" onclick="window.open('${article.link}', '_blank')">
      <h4 class="theme-card-title">${article.titulo}</h4>
      <p class="theme-card-bullet">• ${resumo}</p>
      ${subtagsHtml ? `<div class="theme-card-subtags">${subtagsHtml}</div>` : ''}
      <div class="theme-card-footer">
        <span class="theme-card-source">${article.veiculo}</span>
        <span class="theme-card-date">${article.data}</span>
      </div>
    </div>
  `;
}

function renderNewsCard(article) {
  const empresas = (article.empresa || []).join(', ') || 'N/A';
  const resumo = article.resumo_executivo || 'N/A';
  const analise = generateStrategicAnalysis(article);

  return `
    <div class="news-card" onclick="window.open('${article.link}', '_blank')">
      <div class="card-header">
        <span class="date">${article.data}</span>
        <span class="badge badge-theme">${article.tema_1}</span>
        <span class="badge badge-impact badge-impact-${article.impacto}">${article.impacto}</span>
      </div>
      <div class="card-content">
        <h3 class="card-title">${article.titulo}</h3>
        <div class="card-bullets">
          <p class="card-bullet card-description">${resumo}</p>
          <p class="card-bullet card-analysis">💡 ${analise}</p>
        </div>
        <div class="card-footer">
          <span class="veiculo">${article.veiculo}</span>
          <a href="${article.link}" target="_blank" class="btn-read" onclick="event.stopPropagation()">Read More →</a>
        </div>
      </div>
    </div>
  `;
}

function generateStrategicAnalysis(article) {
  const tema = article.tema_1;
  const impacto = article.impacto;
  const tom = article.tom;
  const setor = article.setor;

  let analise = '';

  // Análises densas e estruturadas para consolidação histórica
  if (tema === 'regulatorio') {
    if (impacto === 'alto' && tom === 'negativo') {
      analise = 'Pressão regulatória adversa com potencial impacto negativo em tarifa e WACC. Risco de margin compression em operações. Acompanhar posicionamento de stakeholders e timeline de implementação. Efeito possível em valuation multissetorial.';
    } else if (impacto === 'alto' && tom === 'positivo') {
      analise = 'Avanço regulatório com visibilidade tarifária aumentada. Reduz incerteza de cash flows futuros. Oportunidade de reajuste com fundamento técnico-legal. Positivo para investidores institucionais e financiamento de longo prazo.';
    } else {
      analise = 'Sinal regulatório importante para planejamento de capex e receita. Monitore cronograma de decisões e potencial de revisões tarifárias. Implicações para disciplina de investimento em 12-24 meses.';
    }
  } else if (tema === 'economico') {
    if (impacto === 'alto' && tom === 'negativo') {
      analise = 'Dinâmica macroeconômica desfavorável afeta fundamentals de demanda e poder de compra. Risco de deterioração de índices operacionais. Pode pressionar margens se combinado com restrições tarifárias. Revisar projeções de crescimento.';
    } else if (impacto === 'alto' && tom === 'positivo') {
      analise = 'Oportunidade econômica estrutural. Pode ampliar base de receita ou melhorar eficiência operacional. Revisitar casos de consolidação M&A. Impacto material em projeções de 3-5 anos.';
    } else {
      analise = 'Dinâmica econômica relevante para contexto competitivo. Considere para análise de posicionamento de mercado e diferenciais operacionais. Referência para benchmarking regional/setorial.';
    }
  } else if (tema === 'ambiental') {
    if (impacto === 'alto') {
      analise = 'Agenda ambiental em foco com potencial impacto em capex e operações. Importante para acesso a financiamento verde (ESG bonds, BNDES, BID). Risco de compliance regulatório. Oportunidade de diferenciação competitiva se bem executada.';
    } else {
      analise = 'Tema ESG em desenvolvimento. Monitore para impactos futuros em financiamento e reputação corporativa. Base de dados para análise de trends de sustentabilidade setorial.';
    }
  } else if (tema === 'social') {
    if (impacto === 'alto') {
      analise = 'Pressão social/stakeholder que afeta licença operatória. Risco de ações coletivas ou intervenção política. Potencial impacto em custo operacional e capex social. Acompanhe dinâmica política local para mitigação.';
    } else {
      analise = 'Questão de relacionamento comunitário com relevância local. Importante para reputação e sustentabilidade de concessões. Monitore evolução e potencial escalation.';
    }
  } else if (tema === 'juridico') {
    if (impacto === 'alto') {
      analise = 'Risco legal material com potencial impacto financeiro direto. Exige atenção jurídica imediata e contingenciamento. Acompanhe timeline processual e precedentes jurisprudenciais. Possível impacto em demonstrações financeiras.';
    } else {
      analise = 'Questão legal em desenvolvimento. Monitore desdobramentos processuais. Estabeleça paralelo com jurisprudência similar para assess de risco.';
    }
  } else if (tema === 'operacional') {
    if (tom === 'positivo') {
      analise = 'Ganho operacional com impacto direto em eficiência e custos. Melhora de índices técnicos (IDA, taxa de não-receita, etc). Positivo para EBITDA de longo prazo. Repositório para benchmarking de best practices.';
    } else if (impacto === 'alto') {
      analise = 'Desafio operacional significativo. Requer capex e/ou reengenharia de processos. Acompanhe timeline de implementação e impacto em metas operacionais. Efeito possível em índices de qualidade de serviço.';
    } else {
      analise = 'Dinâmica operacional relevante. Monitore para otimizações de custo ou eficiência. Referência para análise contínua de gaps operacionais.';
    }
  } else if (tema === 'politico') {
    if (impacto === 'alto') {
      analise = 'Dinâmica política com potencial impacto estrutural em regulação ou privatização. Acompanhe mudanças de regime, eleições e políticas públicas. Risco político relevante para decisões de M&A e capex.';
    } else {
      analise = 'Sinal político importante para contexto regulatório. Monitore para potencial mudança de direcionamento em saneamento público/privado. Relevância para análise de tendências de longo prazo.';
    }
  } else if (tema === 'governanca') {
    analise = 'Questão de governança corporativa com implicações para credibilidade e conformidade. Relevante para investidores institucionais e rating de agências. Importante para sustentabilidade de concessões/parcerias.';
  } else {
    analise = 'Notícia setorial relevante. Arquivo para análise histórica de trends e consolidação de dinâmicas de mercado.';
  }

  return analise;
}

function setupCardListeners() {
  document.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
}

function showError(message) {
  const main = document.querySelector('.main');
  if (main) {
    main.innerHTML = `<div class="error-message"><strong>Error:</strong> ${message}</div>`;
  }
}

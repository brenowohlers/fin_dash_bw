// Configuration: Enums and constants from taxonomies.json
export const TAXONOMIES = {
  tema_1: [
    'economico',
    'regulatorio',
    'politico',
    'juridico',
    'operacional',
    'social',
    'ambiental',
    'governanca'
  ],
  tema_2: [
    'economico',
    'regulatorio',
    'politico',
    'juridico',
    'operacional',
    'social',
    'ambiental',
    'governanca'
  ],
  tipo_evento: [
    'ma',
    'ipo',
    'follow-on',
    'regulacao',
    'operacao',
    'projeto-lei',
    'acordo',
    'desastre',
    'decisao-judicial',
    'announcement',
    'noticia'
  ],
  tipo_fonte: ['oficial', 'grande_midia', 'midia_local', 'stakeholder'],
  setor: ['agua', 'esgoto', 'energia', 'residuos', 'multisservico'],
  pais: ['Brasil', 'Argentina', 'Global', 'LatAm'],
  impacto: ['alto', 'medio', 'baixo'],
  tom: ['positivo', 'negativo', 'neutro', 'misto'],
  status_revisao: ['novo', 'revisado', 'consolidado']
};

// Color mapping for themes
export const THEME_COLORS = {
  economico: '#3B82F6',    // blue
  regulatorio: '#14B8A6',  // teal
  politico: '#8B5CF6',     // purple
  juridico: '#F97316',     // coral/orange
  operacional: '#FBBF24',  // amber
  social: '#EC4899',       // pink
  ambiental: '#10B981',    // green
  governanca: '#6B7280'    // gray
};

// Color mapping for impact levels
export const IMPACT_COLORS = {
  alto: '#EF4444',     // red (danger)
  medio: '#FBBF24',    // amber (warning)
  baixo: '#9CA3AF'     // gray (muted)
};

// Color mapping for tone
export const TONE_COLORS = {
  positivo: '#10B981',  // green (success)
  negativo: '#EF4444',  // red (danger)
  neutro: '#9CA3AF',    // gray (muted)
  misto: '#FBBF24'      // amber (warning)
};

// GitHub data source
export const GITHUB_RAW_URL =
  'https://raw.githubusercontent.com/brenowohlers/fin_dash_bw/main/data/news.jsonl';

// Results per page for infinite scroll
export const RESULTS_PER_PAGE = 50;

// Days to consider for "Today"
export const TODAY_RANGE_DAYS = 1;

// Days to consider for analytics (last N days)
export const ANALYTICS_RANGE_DAYS = 30;

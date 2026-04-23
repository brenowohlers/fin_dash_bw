#!/bin/bash

# 🚀 Script para configurar automação de coleta de notícias

echo "========================================="
echo "📋 SETUP - Automação de Notícias"
echo "========================================="
echo ""

REPO_PATH="$(cd "$(dirname "$0")" && pwd)"
SCRIPT_PATH="$REPO_PATH/news_collector.py"

echo "✓ Caminho do repositório: $REPO_PATH"
echo "✓ Script Python: $SCRIPT_PATH"
echo ""

# Verificar se Python 3 está disponível
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Instale com:"
    echo "   Ubuntu/Debian: sudo apt-get install python3"
    echo "   macOS: brew install python3"
    echo "   Windows: https://www.python.org/downloads/"
    exit 1
fi

PYTHON_VERSION=$(python3 --version)
echo "✓ $PYTHON_VERSION encontrado"
echo ""

# Tornar script executável
chmod +x "$SCRIPT_PATH"
echo "✓ Script tornado executável"
echo ""

# Criar arquivo de cron
CRON_FILE="/tmp/news_cron_temp"
cat > "$CRON_FILE" <<EOF
# News Intelligence Processor - Coleta automática diária às 6 AM
0 6 * * * cd $REPO_PATH && python3 $SCRIPT_PATH >> /tmp/news_collector.log 2>&1
EOF

echo "========================================="
echo "⚙️  OPÇÃO 1: Agendamento com CRON (Linux/macOS)"
echo "========================================="
echo ""
echo "Para ativar coleta automática DIÁRIA às 6 AM, execute:"
echo ""
echo "  crontab -e"
echo ""
echo "E adicione esta linha no final do arquivo:"
echo ""
echo "  0 6 * * * cd $REPO_PATH && python3 $SCRIPT_PATH >> /tmp/news_collector.log 2>&1"
echo ""
echo "Depois salve (Ctrl+X, depois Y, depois Enter)"
echo ""
echo "Para verificar se foi adicionado:"
echo "  crontab -l"
echo ""

echo "========================================="
echo "⚙️  OPÇÃO 2: Executar Manualmente"
echo "========================================="
echo ""
echo "Para rodar agora mesmo:"
echo ""
echo "  cd $REPO_PATH"
echo "  python3 news_collector.py"
echo ""

echo "========================================="
echo "📊 Visualizar Logs"
echo "========================================="
echo ""
echo "  tail -f /tmp/news_collector.log"
echo ""

echo "========================================="
echo "✅ Setup completo!"
echo "========================================="
echo ""

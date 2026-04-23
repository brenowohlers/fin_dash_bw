# ⚡ Quick Start - Automação em 2 Minutos

## 🎯 Objetivo
Você **NUNCA MAIS** precisa:
- Gerar tokens
- Fazer commit manualmente
- Fazer push manualmente
- Abrir esta conversa

Tudo roda **automaticamente** 1x por dia.

---

## 📥 Passo 1: Baixar os Arquivos

Já estão no seu repositório! Apenas faça git pull:

```bash
cd /caminho/para/fin_dash_bw
git pull origin main
```

3 arquivos novos aparecerão:
- `news_collector.py` - Script Python
- `setup_automation.sh` - Setup
- `NEWS_AUTOMATION.md` - Documentação completa

---

## 🔑 Passo 2: Configurar SSH (SEM TOKEN!)

**Por que SSH?** Sem token, sem expiração, sem renovação.

### No seu computador, execute UMA VEZ:

```bash
# Gerar chave SSH (se não tiver)
ssh-keygen -t ed25519 -C "seu-email@exemplo.com"

# Depois é só apertar ENTER 3 vezes
```

Copie a chave:
```bash
cat ~/.ssh/id_ed25519.pub
```

No GitHub:
1. Vá para: https://github.com/settings/ssh/new
2. Cole a chave
3. Clique "Add SSH key"

Mude a remota:
```bash
cd /caminho/para/fin_dash_bw
git remote set-url origin git@github.com:brenowohlers/fin_dash_bw.git
```

Pronto! **Nunca mais precisa de token.**

---

## ⏰ Passo 3: Agendar para Rodar Sozinho

### Linux/macOS:

```bash
crontab -e
```

Cole no final do arquivo:
```
0 6 * * * cd /caminho/para/fin_dash_bw && python3 news_collector.py >> /tmp/news_collector.log 2>&1
```

Salve (Ctrl+X, depois Y, depois Enter).

**Pronto!** Todos os dias às 6 AM roda sozinho.

### Windows:

Use Task Scheduler (abra como Admin):
1. Crie nova tarefa
2. Nome: "News Collector"
3. Trigger: Diário às 6 AM
4. Action: Programa = `python3`, Argumentos = `/caminho/para/news_collector.py`

---

## 🧪 Passo 4: Testar Agora

Execute uma vez para garantir que funciona:

```bash
python3 /caminho/para/fin_dash_bw/news_collector.py
```

Deve aparecer:
```
[HH:MM:SS] INFO     | 🚀 NEWS INTELLIGENCE PROCESSOR
[HH:MM:SS] INFO     | ✓ 5 artigos adicionados
[HH:MM:SS] INFO     | ✓ Push concluído com sucesso!
[HH:MM:SS] INFO     | ✅ SUCESSO! Dashboard atualizado
```

---

## 📊 Ver o Dashboard

Abre automaticamente aqui:
https://brenowohlers.github.io/fin_dash_bw/dashboard/

(Atualiza a cada push, geralmente em ~1 minuto)

---

## 🔍 Ver Logs

```bash
# Últimas 20 linhas
tail -20 /tmp/news_collector.log

# Acompanhar em tempo real
tail -f /tmp/news_collector.log

# Verificar se rodou hoje
grep "2026-04-23" /tmp/news_collector.log
```

---

## 🎯 E agora?

**Seus artigos são de exemplo!** Se quiser coletar notícias de verdade:

1. Abra `news_collector.py`
2. Modifique a função `add_sample_articles()`
3. Substitua os artigos by scraping de APIs como:
   - NewsAPI.org
   - Google News API
   - Scraping de portais (Poder360, Valor, etc)

Quer que eu integre com API de notícias? Só avisar! 😊

---

## 💡 Dúvidas?

Veja o arquivo completo:
```bash
cat NEWS_AUTOMATION.md
```

---

## ✅ Pronto! Parabéns! 🎉

Agora você tem um **sistema 100% automatizado** de coleta de notícias.

- ✓ Sem tokens
- ✓ Sem prompts
- ✓ Sem intervenção manual
- ✓ Totalmente local (Python + Git)

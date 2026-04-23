# 🚀 Automação de Coleta de Notícias

## O que é?

Um script Python que **automaticamente**:
1. ✓ Coleta notícias sobre saneamento
2. ✓ Adiciona ao arquivo `dashboard/sample-data.jsonl`
3. ✓ Faz commit no Git
4. ✓ Faz push para GitHub
5. ✓ **Tudo sem você precisar fazer nada!**

---

## 📦 Como Instalar

### Passo 1: Verificar Python
Sua máquina já tem Python 3? Digite no terminal:
```bash
python3 --version
```

Se não tiver:
- **Ubuntu/Debian:** `sudo apt-get install python3`
- **macOS:** `brew install python3`
- **Windows:** https://www.python.org/downloads/

### Passo 2: Configurar Git SSH (SEM TOKEN!)
Para não precisar de token toda vez, configure SSH:

```bash
# Gerar chave SSH (se não tiver)
ssh-keygen -t ed25519 -C "seu-email@exemplo.com"

# Copiar a chave pública
cat ~/.ssh/id_ed25519.pub
```

Depois adicione a chave no GitHub:
1. Acesse: https://github.com/settings/ssh/new
2. Cole a chave
3. Clique "Add SSH key"

Mude a remota para SSH:
```bash
cd /caminho/para/fin_dash_bw
git remote set-url origin git@github.com:brenowohlers/fin_dash_bw.git
```

---

## 🏃 Como Usar

### Opção 1: Executar Manualmente (Agora)
```bash
cd /caminho/para/fin_dash_bw
python3 news_collector.py
```

**Output esperado:**
```
[14:30:25] INFO     | 🚀 NEWS INTELLIGENCE PROCESSOR
[14:30:25] INFO     | Data: 2026-04-23
[14:30:25] INFO     | Adicionando artigos...
[14:30:25] INFO     | ✓ Artigo adicionado: Sabesp continua redução...
[14:30:25] INFO     | ✓ Artigo adicionado: Arsae-MG aprova novo...
[14:30:26] INFO     | Publicando no GitHub...
[14:30:27] INFO     | ✓ Commit criado com sucesso
[14:30:28] INFO     | ✓ Push concluído com sucesso!
[14:30:28] INFO     | ✅ SUCESSO! Dashboard atualizado
```

### Opção 2: Agendamento Automático (Recomendado)

**Linux/macOS - Cron (Todos os dias às 6 AM):**
```bash
crontab -e
```

Adicione esta linha no final:
```
0 6 * * * cd /caminho/para/fin_dash_bw && python3 news_collector.py >> /tmp/news_collector.log 2>&1
```

Salve (Ctrl+X, depois Y, depois Enter)

Verifique:
```bash
crontab -l
```

**Windows - Task Scheduler:**
1. Abra "Task Scheduler"
2. Clique "Create Task"
3. Configure:
   - **Name:** News Collector
   - **Trigger:** Diário às 6 AM
   - **Action:** Programa = `python3.exe`, Argumentos = `/caminho/para/news_collector.py`

---

## 📊 Ver Logs

Depois que está rodando, verifique os logs:

```bash
# Ver últimas 20 linhas
tail -20 /tmp/news_collector.log

# Ver em tempo real
tail -f /tmp/news_collector.log
```

---

## 🎯 O que o Script Faz Atualmente

Adiciona **5 artigos de exemplo** (você pode customizar):

| Tema | Empresa | Setor |
|------|---------|-------|
| Operacional | Sabesp | Água |
| Regulatório | Copasa | Água |
| Social | Compesa | Água |
| Regulatório | AySA | Água |
| Econômico | Banco Mundial | Multisserviço |

---

## 🔧 Como Customizar

Edite `news_collector.py` e modifique a função `add_sample_articles()`:

```python
def add_sample_articles(self) -> int:
    """Adiciona artigos de exemplo"""
    articles = [
        {
            "data": self.today,
            "titulo": "Seu título aqui",
            "empresa": ["Sabesp"],
            "tema_1": "regulatorio",
            # ... outros campos
        }
    ]
```

**Campos obrigatórios:**
- `data` - Data (YYYY-MM-DD)
- `empresa` - Array de empresas
- `tema_1` - Tema principal
- `setor` - Setor (agua, esgoto, energia, residuos, multisservico)
- `titulo` - Título
- `veiculo` - Fonte/publicação
- `link` - URL do artigo
- `impacto` - alto, medio, baixo
- `tom` - positivo, negativo, neutro, misto

---

## ⚠️ Troubleshooting

### Erro: "Permission denied"
```bash
chmod +x news_collector.py
```

### Erro: "git: command not found"
Instale Git:
- Ubuntu: `sudo apt-get install git`
- macOS: `brew install git`

### Erro: "No such file or directory"
Use caminho absoluto no cron:
```
0 6 * * * cd /home/usuario/fin_dash_bw && python3 /home/usuario/fin_dash_bw/news_collector.py
```

### Erro: "fatal: Authentication failed"
Configure SSH conforme passo 2 acima.

---

## 🎉 Pronto!

Agora seu dashboard é **100% automatizado**! 

✓ Sem tokens  
✓ Sem prompts  
✓ Sem intervenção manual  

Apenas Python + Git (que já estão instalados)

---

## 📚 Próximos Passos

Para integrar com busca de notícias real:
1. Use APIs de notícias (NewsAPI, Google News API)
2. Implemente lógica de parsing
3. Filtre por palavras-chave
4. Envie para o script

Exemplo:
```python
import requests

def buscar_noticias_sabesp():
    api_key = "sua_chave_api"
    url = f"https://newsapi.org/v2/everything?q=sabesp&language=pt&sortBy=publishedAt&apiKey={api_key}"
    response = requests.get(url)
    return response.json()['articles']
```

Quer que eu crie essa versão automatizada com API de notícias? 😊

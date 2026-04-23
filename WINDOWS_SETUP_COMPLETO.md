# 🪟 Windows - Setup Completo do Zero

## 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Instalar Python](#instalar-python)
3. [Instalar Git](#instalar-git)
4. [Clonar Repositório](#clonar-repositório)
5. [Configurar SSH](#configurar-ssh)
6. [Testar Script](#testar-script)
7. [Agendar com Task Scheduler](#agendar-com-task-scheduler)

---

## 🔍 Pré-requisitos

Você precisa de:
- ✓ Windows 10 ou superior
- ✓ Conta GitHub (brenowohlers)
- ✓ ~1 GB de espaço em disco

---

## 📥 Instalar Python

### Passo 1: Baixar Python
1. Acesse: https://www.python.org/downloads/
2. Clique no grande botão amarelo **"Download Python 3.12"** (ou versão mais recente)

### Passo 2: Executar Instalador
1. Abra o arquivo baixado (deve ser algo como `python-3.12.x-amd64.exe`)
2. **⚠️ IMPORTANTE:** Marque a caixa **"Add Python to PATH"**
3. Clique em **"Install Now"**
4. Aguarde terminar

### Passo 3: Verificar Instalação
1. Abra **PowerShell** (Pesquise "PowerShell" no menu Iniciar)
2. Digite e pressione ENTER:
```powershell
python --version
```

Deve aparecer algo como: `Python 3.12.0`

Se aparecer erro, reinicie o PowerShell e tente novamente.

---

## 🔧 Instalar Git

### Passo 1: Baixar Git
1. Acesse: https://git-scm.com/download/win
2. Clique para baixar (deve começar automaticamente)

### Passo 2: Executar Instalador
1. Abra o arquivo baixado (algo como `Git-2.xx.x-64-bit.exe`)
2. Clique **"Next"** em todas as telas (padrão está bom)
3. Aguarde terminar

### Passo 3: Verificar Instalação
1. Abra uma **nova janela** de PowerShell (importante!)
2. Digite e pressione ENTER:
```powershell
git --version
```

Deve aparecer: `git version 2.xx.x...`

---

## 📂 Clonar Repositório

### Passo 1: Escolher Pasta
Decida onde guardar o projeto. Exemplo:
- `C:\Users\SeuUsuário\Documentos\fin_dash_bw`
- `C:\dev\fin_dash_bw`
- `C:\Users\SeuUsuário\Desktop\fin_dash_bw`

**Recomendo:** `C:\Users\SeuUsuário\Documentos\fin_dash_bw`

### Passo 2: Clonar
1. Abra **PowerShell**
2. Digite (substituindo `C:\Users\SeuUsuário\Documentos` pelo seu caminho):

```powershell
cd C:\Users\SeuUsuário\Documentos
git clone https://github.com/brenowohlers/fin_dash_bw.git
cd fin_dash_bw
```

3. Pressione ENTER após cada linha

**Resultado esperado:**
```
Cloning into 'fin_dash_bw'...
remote: Enumerating objects: 45, done.
...
```

### Passo 3: Verificar Clone
```powershell
ls  # Lista arquivos
```

Deve ver: `README.md`, `dashboard`, `news_collector.py`, etc.

---

## 🔐 Configurar SSH (SEM TOKEN!)

### Passo 1: Gerar Chave SSH
1. No **PowerShell**, digite:

```powershell
ssh-keygen -t ed25519 -C "seu-email@exemplo.com"
```

2. Substituir `seu-email@exemplo.com` pelo seu email real

### Passo 2: Pressionar ENTER 3 vezes
```
Generating public/private ed25519 key pair.
Enter file in which to save the key (...): [ENTER]
Enter passphrase (empty for no passphrase): [ENTER]
Enter same passphrase again: [ENTER]
```

**Resultado esperado:**
```
Your identification has been saved in C:\Users\SeuUsuário\.ssh\id_ed25519
Your public key has been saved in C:\Users\SeuUsuário\.ssh\id_ed25519.pub
```

### Passo 3: Copiar a Chave Pública
```powershell
cat $env:USERPROFILE\.ssh\id_ed25519.pub
```

Pressione ENTER e **copie toda a saída** (começa com `ssh-ed25519`)

### Passo 4: Adicionar no GitHub
1. Acesse: https://github.com/settings/ssh/new
2. Faça login com sua conta `brenowohlers`
3. No campo **"Title"**: escreva `Windows Laptop` (ou qualquer nome)
4. No campo **"Key"**: **cole a chave copiada** (Ctrl+V)
5. Clique **"Add SSH key"**

### Passo 5: Configurar Git Remota
No **PowerShell**, na pasta do projeto:

```powershell
git remote set-url origin git@github.com:brenowohlers/fin_dash_bw.git
```

Pressione ENTER.

### Passo 6: Testar SSH
```powershell
ssh -T git@github.com
```

Pressione ENTER.

**Resultado esperado:**
```
Hi brenowohlers! You've successfully authenticated, but GitHub does not provide shell access.
```

✅ **Se viu esta mensagem, SSH está funcionando!**

---

## 🧪 Testar Script

### Passo 1: Rodar Script Manual
No **PowerShell**, na pasta do projeto:

```powershell
python news_collector.py
```

Pressione ENTER.

### Passo 2: Resultado Esperado

```
[14:30:25] INFO     | ========================================
[14:30:25] INFO     | 🚀 NEWS INTELLIGENCE PROCESSOR
[14:30:25] INFO     | Data: 2026-04-23
[14:30:25] INFO     | ========================================
[14:30:25] INFO     | Adicionando artigos...
[14:30:25] INFO     | ✓ Artigo adicionado: Sabesp continua...
[14:30:25] INFO     | ✓ 5 artigos adicionados
[14:30:26] INFO     | Publicando no GitHub...
[14:30:27] INFO     | ✓ Commit criado com sucesso
[14:30:28] INFO     | ✓ Push concluído com sucesso!
[14:30:28] INFO     | ✅ SUCESSO! Dashboard atualizado
[14:30:28] INFO     | 📊 https://brenowohlers.github.io/fin_dash_bw/dashboard/
```

✅ **Se viu "SUCESSO", tudo está funcionando!**

---

## ⏰ Agendar com Task Scheduler (Automático)

### Passo 1: Abrir Task Scheduler
1. Pesquise **"Task Scheduler"** no menu Iniciar
2. Abra como **Administrador** (clique direito → "Run as Administrator")

### Passo 2: Criar Nova Tarefa
1. No menu esquerdo, clique **"Create Task"** (ou "Criar Tarefa")
2. Na aba **"General"**:
   - **Name:** `News Collector`
   - **Description:** `Coleta automática de notícias de saneamento`
   - Marque: **"Run with highest privileges"**

### Passo 3: Configurar Trigger (quando rodar)
1. Clique na aba **"Triggers"**
2. Clique **"New..."**
3. Configure:
   - **Begin the task:** `On a schedule`
   - **Repeat every:** `Daily`
   - **At:** `06:00:00` (6 AM da manhã)
   - Marque: **"Repeat task every"** → `1 day`
4. Clique **"OK"**

### Passo 4: Configurar Action (o que fazer)
1. Clique na aba **"Actions"**
2. Clique **"New..."**
3. Configure:
   - **Action:** `Start a program`
   - **Program/script:** `python` (ou caminho completo: `C:\Users\SeuUsuário\AppData\Local\Programs\Python\Python312\python.exe`)
   - **Add arguments:** `C:\Users\SeuUsuário\Documentos\fin_dash_bw\news_collector.py`
   - **Start in:** `C:\Users\SeuUsuário\Documentos\fin_dash_bw`

4. Clique **"OK"**

### Passo 5: Salvar
1. Clique **"OK"** para fechar a janela
2. Pode pedir senha do Windows - digite e clique **"Yes"**

### Passo 6: Testar Agendamento
1. Volte ao Task Scheduler
2. Procure por **"News Collector"** na lista
3. Clique direito → **"Run"**
4. Veja se aparece a mensagem de sucesso

---

## 📊 Ver Logs (Verificar se Rodou)

### Opção 1: No Task Scheduler
1. Abra **Task Scheduler**
2. Clique em **"News Collector"**
3. Na aba **"History"** você vê se rodou

### Opção 2: Ver no GitHub
1. Acesse: https://github.com/brenowohlers/fin_dash_bw
2. Clique em **"Commits"**
3. Procure por commits com mensagem **"Add news from..."**
4. Se vê um novo commit hoje, funcionou! ✅

---

## ✅ Checklist Final

Marque conforme completa:

- [ ] Python instalado e funcionando (`python --version`)
- [ ] Git instalado e funcionando (`git --version`)
- [ ] Repositório clonado em `C:\Users\...\fin_dash_bw`
- [ ] Chave SSH gerada
- [ ] Chave SSH adicionada no GitHub
- [ ] SSH testado com sucesso (`ssh -T git@github.com`)
- [ ] Script testado manualmente (rodou com sucesso)
- [ ] Task Scheduler criada e funcionando
- [ ] Novo commit apareceu no GitHub

---

## 🎉 Pronto!

Agora seu sistema está **100% automatizado**:
- ✓ Sem tokens
- ✓ Sem prompts manuais
- ✓ Roda todos os dias às 6 AM
- ✓ Dashboard atualiza sozinho

---

## 🆘 Troubleshooting

### "python: command not found"
**Solução:**
1. Reinstale Python
2. Marque a opção **"Add Python to PATH"**
3. Reinicie o PowerShell

### "git: command not found"
**Solução:**
1. Instale Git de novo
2. Reinicie o PowerShell

### "Permission denied" no SSH
**Solução:**
```powershell
# Ajustar permissões SSH
icacls $env:USERPROFILE\.ssh\id_ed25519 /inheritance:r /grant:r "$env:USERNAME`:`(F`)"
```

### Script roda manual mas não no Task Scheduler
**Solução:**
1. Verifique o caminho completo em **Action**
2. Execute como **Administrator**
3. Veja os logs no Task Scheduler

### Não consigo conectar no GitHub via SSH
**Solução:**
```powershell
# Testar conexão
ssh -v git@github.com
```

Se vir "Successfully authenticated", SSH está OK.

---

## 📚 Documentação Completa

Para mais detalhes, veja:
```powershell
cat QUICK_START.md
cat NEWS_AUTOMATION.md
```

---

## 🤔 Dúvidas?

Se algo não funcionar, verifique:
1. Python e Git estão instalados?
2. Você está na pasta correta? (`cd C:\Users\...\fin_dash_bw`)
3. SSH foi testado? (`ssh -T git@github.com`)
4. Task Scheduler está com permissões de admin?

**Tudo feito?** 🎉 Você está pronto!

# 📖 Guia: Como Colocar o Dashboard no GitHub Pages

Este guia te mostra passo a passo como publicar o dashboard online usando GitHub Pages.

---

## 📋 Pré-requisitos

- ✅ Conta GitHub (crie em https://github.com/signup se não tiver)
- ✅ Git instalado no seu computador
- ✅ Email configurado no Git local

---

## 🚀 Passo 1: Criar Repositório no GitHub

### 1.1 Acesse GitHub
1. Vá para https://github.com
2. Faça login com sua conta
3. Clique no ícone `+` no canto superior direito
4. Selecione **New repository**

### 1.2 Configure o Repositório
Preencha com os seguintes dados:

| Campo | Valor |
|-------|-------|
| **Repository name** | `fin_dash_bw` |
| **Description** | `Dashboard de Inteligência em Saneamento` |
| **Visibility** | Public *(para acessar via GitHub Pages)* |
| **Initialize this repository** | ❌ Deixe em branco (já temos commits locais) |

**NÃO** marque "Add a README file", "Add .gitignore", ou "Choose a license" (já temos esses localmente).

### 1.3 Clique "Create repository"

Você verá uma página com instruções. Copie a URL do repositório (ex: `https://github.com/seu-usuario/fin_dash_bw.git`).

---

## 🔗 Passo 2: Conectar Repositório Local ao GitHub

Abra o **PowerShell** ou **Git Bash** e navegue até o diretório do projeto:

```powershell
cd D:\Saneamento\news_dash
```

Agora execute estes comandos (substitua `seu-usuario` pelo seu username do GitHub):

```bash
# Adicione o remote do GitHub
git remote add origin https://github.com/seu-usuario/fin_dash_bw.git

# Renomeie a branch para 'main' (padrão do GitHub)
git branch -M main

# Faça push do código para GitHub
git push -u origin main
```

Se pedir **username/password**:
- **Username**: Seu username do GitHub
- **Password**: Use um **Personal Access Token** (veja abaixo)

### ⚙️ Alternativa: Usar SSH (mais seguro)

Se preferir usar SSH em vez de HTTPS:

```bash
# Configure SSH (siga as instruções do GitHub)
# https://docs.github.com/en/authentication/connecting-to-github-with-ssh

# Mude a URL do remote
git remote set-url origin git@github.com:seu-usuario/fin_dash_bw.git

# Faça push
git push -u origin main
```

---

## 🔐 Criar Personal Access Token (se necessário)

Se o GitHub pedir password ao fazer push:

1. Acesse https://github.com/settings/tokens
2. Clique em **Generate new token** → **Generate new token (classic)**
3. Configure:
   - **Token name**: `git-push-token`
   - **Expiration**: `90 days`
   - **Scopes**: Marque `repo` (acesso completo a repositórios privados e públicos)
4. Clique **Generate token**
5. **COPIE O TOKEN** (você só verá uma vez!)
6. Use o token como password no Git:
   ```bash
   git push -u origin main
   # Username: seu-usuario
   # Password: <paste-token-aqui>
   ```

---

## 📄 Passo 3: Configurar GitHub Pages

### 3.1 Acesse as Configurações do Repositório
1. Vá para https://github.com/seu-usuario/fin_dash_bw
2. Clique na aba **Settings** (⚙️)
3. No menu lateral, clique em **Pages** (lado esquerdo, seção "Code and automation")

### 3.2 Configure GitHub Pages
1. Em **Source**, selecione **Deploy from a branch**
2. Em **Branch**, selecione:
   - Branch: `main`
   - Folder: `/ (root)` ← **IMPORTANTE!**
3. Clique **Save**

GitHub Pages vai começar a processar. Aguarde ~1-2 minutos.

### 3.3 Verifique o Status
Volta para **Settings** → **Pages** e veja o URL gerado:

```
Your site is live at https://seu-usuario.github.io/fin_dash_bw/
```

---

## 🎯 Passo 4: Acessar o Dashboard Online

### Dashboard está em:
```
https://seu-usuario.github.io/fin_dash_bw/dashboard/
```

Abra essa URL no navegador e você verá o dashboard ao vivo! 🎉

---

## 📡 Passo 5: Carregar Dados do GitHub (Opcional)

O dashboard atualmente carrega dados do arquivo local `dashboard/sample-data.jsonl`. Para carregar dados **sempre** do GitHub (útil quando os dados são atualizados):

### 5.1 Atualize o `app.js`

Abra `dashboard/assets/app.js` e procure a função `loadNews()`:

**Encontre:**
```javascript
async function loadNews() {
  try {
    console.log("Fetching local sample-data.jsonl...");
    const response = await fetch("../sample-data.jsonl");
    ...
}
```

**Substitua por:**
```javascript
async function loadNews() {
  const GITHUB_RAW_URL = "https://raw.githubusercontent.com/seu-usuario/fin_dash_bw/main/dashboard/sample-data.jsonl";
  
  try {
    console.log("Fetching data from GitHub...");
    const response = await fetch(GITHUB_RAW_URL);
    
    if (!response.ok) {
      console.log("GitHub offline, falling back to local...");
      const localResponse = await fetch("../sample-data.jsonl");
      return await localResponse.text();
    }
    
    return await response.text();
  } catch (error) {
    console.log("Network error, trying localStorage...");
    const cached = localStorage.getItem("newsCache");
    if (cached) {
      return cached;
    }
    throw new Error("Cannot load data");
  }
}
```

### 5.2 Faça Commit e Push

```bash
git add dashboard/assets/app.js
git commit -m "Update app.js to load data from GitHub raw URL"
git push origin main
```

Aguarde ~1 minuto e recarregue o dashboard.

---

## 🔄 Atualizar o Dashboard com Novos Artigos

Sempre que quiser adicionar novos artigos:

### 1. Edite o arquivo `dashboard/sample-data.jsonl`
Adicione uma nova linha JSON no final:

```json
{"data":"2026-04-21","data_coleta":"2026-04-21T10:00:00-03:00",...}
```

### 2. Faça Commit
```bash
git add dashboard/sample-data.jsonl
git commit -m "Add new articles dated 2026-04-21"
```

### 3. Faça Push
```bash
git push origin main
```

### 4. Aguarde
GitHub Pages atualiza automaticamente em ~1-2 minutos. Recarregue o dashboard no navegador.

---

## ✅ Checklist Final

Verifique se tudo está funcionando:

- [ ] Repositório criado no GitHub (https://github.com/seu-usuario/fin_dash_bw)
- [ ] Código foi feito push (veja o código no GitHub)
- [ ] GitHub Pages está ativado (Settings → Pages)
- [ ] Dashboard acessível em: https://seu-usuario.github.io/fin_dash_bw/dashboard/
- [ ] Artigos aparecem corretamente
- [ ] Filtros funcionam
- [ ] Charts renderizam
- [ ] Links dos artigos funcionam

---

## 🆘 Troubleshooting

### Problema: "This site can't be reached"
**Solução**: Aguarde 2-3 minutos após fazer push. GitHub Pages leva tempo para processar.

### Problema: "404 - Page not found"
**Solução**: Verifique se a URL está correta:
- Deve ser: `https://seu-usuario.github.io/fin_dash_bw/dashboard/`
- NÃO: `https://seu-usuario.github.io/fin_dash_bw/` (sem `/dashboard/`)

### Problema: Dados não atualizam
**Solução**: 
1. Limpe o cache do navegador (Ctrl+Shift+Del)
2. Ou abra em modo incógnito (Ctrl+Shift+N)

### Problema: Erro ao fazer push
**Solução**:
```bash
# Confirme que o remote está correto
git remote -v

# Se não ver 'origin', configure novamente
git remote add origin https://github.com/seu-usuario/fin_dash_bw.git

# Tente fazer push novamente
git push -u origin main
```

---

## 📚 Recursos Úteis

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Git Basics](https://docs.github.com/en/get-started/using-git)
- [Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

---

## 🎉 Pronto!

Seu dashboard está agora online e acessível 24/7!

**Compartilhe a URL**: https://seu-usuario.github.io/fin_dash_bw/dashboard/

Qualquer dúvida, volte a este guia ou acesse a documentação oficial do GitHub.

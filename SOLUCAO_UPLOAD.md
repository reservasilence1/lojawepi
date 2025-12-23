# ✅ SOLUÇÃO: Como Fazer Upload Corretamente

## O Problema

Os arquivos JavaScript e CSS estão retornando 404 porque a pasta `_next/` não foi enviada corretamente para o servidor.

## Solução Passo a Passo

### 1. Verificar Estrutura Local

Certifique-se de que você tem esta estrutura na pasta `out/`:

```
out/
├── .htaccess
├── index.html
├── 404.html
├── body-splash/
│   └── top5/
│       └── index.html
├── _next/                    ← ESTA PASTA É ESSENCIAL!
│   └── static/
│       ├── chunks/
│       │   ├── webpack-bde07f898cc55c1a.js
│       │   ├── fd9d1056-516b58327fb05db5.js
│       │   ├── 938-51fbe7d7c9e52edf.js
│       │   ├── main-app-10a6a000ba87dacf.js
│       │   ├── page-e022d03d6344045a.js
│       │   └── [outros arquivos .js]
│       ├── css/
│       │   └── 89a5b1b02cfd5092.css
│       └── VEW6S6oQYS7wydohBZcte/
├── logo-primary.svg
└── pix-icon.svg
```

### 2. Upload na Hostinger

**IMPORTANTE:** Você precisa enviar TODA a pasta `out/` completa, incluindo a pasta `_next/`!

#### Opção A: Upload via File Manager (Recomendado)

1. Acesse o **File Manager** da Hostinger
2. Navegue até a pasta do subdomínio `wepink`
3. **Delete tudo** que está lá atualmente (se houver)
4. Faça upload de **TODOS os arquivos e pastas** da pasta `out/`:
   - ✅ `index.html`
   - ✅ `404.html`
   - ✅ `.htaccess`
   - ✅ Pasta `body-splash/` (com todo o conteúdo)
   - ✅ **Pasta `_next/` (COM TODO O CONTEÚDO)** ← MUITO IMPORTANTE!
   - ✅ `logo-primary.svg`
   - ✅ `pix-icon.svg`

#### Opção B: Upload via FTP

1. Conecte via FTP (FileZilla, WinSCP, etc.)
2. Navegue até a pasta do subdomínio `wepink`
3. Faça upload de **TODA a pasta `out/`** mantendo a estrutura

### 3. Verificar Estrutura no Servidor

Após o upload, a estrutura no servidor deve ser:

```
wepink/
├── .htaccess
├── index.html
├── 404.html
├── body-splash/
│   └── top5/
│       └── index.html
├── _next/                    ← DEVE EXISTIR!
│   └── static/
│       ├── chunks/
│       ├── css/
│       └── VEW6S6oQYS7wydohBZcte/
├── logo-primary.svg
└── pix-icon.svg
```

### 4. Verificar Permissões

No File Manager da Hostinger, verifique as permissões:
- **Arquivos**: 644
- **Pastas**: 755

### 5. Testar

1. Acesse: `https://wepink.seudominio.com/body-splash/top5/`
2. Pressione F12
3. Vá na aba "Network"
4. Recarregue a página (Ctrl+F5)
5. Verifique se os arquivos `.js` e `.css` agora retornam **200** (OK) ao invés de **404**

## ⚠️ Erros Comuns

### Erro: "Ainda está dando 404"
**Solução:** 
- Verifique se a pasta `_next/` foi enviada completamente
- Verifique se está na raiz do subdomínio (não dentro de outra pasta)
- Verifique as permissões (755 para pastas)

### Erro: "Não consigo fazer upload da pasta _next"
**Solução:**
- Use um cliente FTP (FileZilla) ao invés do File Manager
- Ou faça upload arquivo por arquivo (não recomendado, mas funciona)

### Erro: "Os arquivos estão lá mas ainda dá 404"
**Solução:**
- Verifique o arquivo `.htaccess` - ele deve estar na raiz
- Verifique se não há outro `.htaccess` sobrescrevendo
- Tente acessar diretamente: `https://wepink.seudominio.com/_next/static/css/89a5b1b02cfd5092.css`

## Checklist Final

Antes de testar, verifique:

- [ ] Pasta `_next/` foi enviada
- [ ] Pasta `_next/static/chunks/` contém os arquivos .js
- [ ] Pasta `_next/static/css/` contém o arquivo .css
- [ ] Arquivo `.htaccess` está na raiz
- [ ] Arquivo `index.html` está na raiz
- [ ] Permissões estão corretas (644 para arquivos, 755 para pastas)

## Teste Rápido

Tente acessar diretamente no navegador:
- `https://wepink.seudominio.com/_next/static/css/89a5b1b02cfd5092.css`

Se retornar o CSS, está funcionando! Se retornar 404, a pasta `_next/` não foi enviada corretamente.



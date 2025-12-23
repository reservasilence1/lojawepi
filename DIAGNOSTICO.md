# Diagnóstico - Página em Branco

## Checklist de Verificação

### 1. Verificar no Navegador (F12)

**Console:**
- Abra o DevTools (F12)
- Vá na aba "Console"
- Procure por erros em vermelho
- Erros comuns:
  - `Failed to load resource: 404` - Arquivo não encontrado
  - `Uncaught TypeError` - Erro JavaScript
  - `Hydration failed` - Problema de hidratação React

**Network:**
- Vá na aba "Network"
- Recarregue a página (Ctrl+F5)
- Verifique quais arquivos têm status:
  - ✅ 200 (OK) - Carregou corretamente
  - ❌ 404 (Not Found) - Arquivo não encontrado
  - ❌ 403 (Forbidden) - Sem permissão
  - ❌ 500 (Server Error) - Erro no servidor

### 2. Verificar Arquivos no Servidor

Certifique-se de que TODOS estes arquivos existem:

```
wepink/
├── .htaccess                    ← DEVE existir
├── index.html                   ← DEVE existir
├── 404.html                     ← DEVE existir
├── body-splash/
│   └── top5.html                ← DEVE existir
├── _next/
│   └── static/
│       ├── chunks/              ← DEVE existir e ter arquivos .js
│       ├── css/                 ← DEVE existir e ter arquivo .css
│       └── [build-id]/          ← DEVE existir
├── logo-primary.svg             ← DEVE existir
└── pix-icon.svg                 ← DEVE existir
```

### 3. Testar Acesso Direto aos Arquivos

Tente acessar diretamente no navegador:
- `https://wepink.seudominio.com/_next/static/css/[nome-do-arquivo].css`
- `https://wepink.seudominio.com/_next/static/chunks/main-app-[hash].js`

Se retornar 404, os arquivos não foram enviados corretamente.

### 4. Verificar .htaccess

O arquivo `.htaccess` deve estar na raiz e conter:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

### 5. Verificar Permissões

No File Manager da Hostinger:
- Arquivos: 644
- Pastas: 755

### 6. Testar Página Específica

Tente acessar diretamente:
- `https://wepink.seudominio.com/body-splash/top5/`

Se esta página funciona mas a raiz não, o problema é no redirecionamento.

## Soluções Rápidas

### Solução 1: Rebuild Completo

```bash
# Limpar tudo
rm -rf .next out node_modules

# Reinstalar
npm install

# Rebuild
npm run build
```

### Solução 2: Verificar se o Build Funciona Localmente

```bash
# Instalar servidor simples
npm install -g serve

# Servir a pasta out
serve out

# Acessar http://localhost:3000
```

Se funcionar localmente mas não no servidor, o problema é no upload.

### Solução 3: Verificar Caminhos Absolutos vs Relativos

No HTML gerado, verifique se os caminhos começam com:
- ✅ `/_next/...` (caminho absoluto - correto)
- ❌ `./_next/...` ou `_next/...` (caminho relativo - pode dar problema)

## Erros Comuns e Soluções

### Erro: "Cannot GET /"
**Solução:** Verifique se o `index.html` está na raiz do subdomínio.

### Erro: Arquivos CSS/JS retornam 404
**Solução:** Verifique se a pasta `_next/` foi enviada completamente.

### Erro: Página carrega mas fica em branco
**Solução:** 
1. Verifique o console do navegador
2. Pode ser erro JavaScript impedindo a renderização
3. Verifique se todos os componentes client-side estão funcionando

### Erro: "Hydration failed"
**Solução:** Pode ser problema com componentes client-side. Verifique se não há diferenças entre servidor e cliente.



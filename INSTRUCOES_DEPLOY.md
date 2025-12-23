# Instruções de Deploy - WePink Clone

## ⚠️ IMPORTANTE: Problema de Página em Branco

Se a página está aparecendo em branco após o deploy, siga estas instruções:

### Solução 1: Verificar Caminhos dos Arquivos

1. **Certifique-se de que TODOS os arquivos da pasta `out/` foram enviados**, incluindo:
   - `index.html`
   - `body-splash/top5.html`
   - Toda a pasta `_next/` (com todos os arquivos JavaScript e CSS)
   - Todos os arquivos SVG da pasta `public/`

2. **Verifique se a estrutura está correta no servidor:**
   ```
   wepink/
   ├── index.html
   ├── body-splash/
   │   └── top5.html
   ├── _next/
   │   └── static/
   │       ├── chunks/
   │       ├── css/
   │       └── MoIuJLV83HouDpZt6NVDz/
   ├── logo-primary.svg
   └── pix-icon.svg
   ```

### Solução 2: Verificar .htaccess

O arquivo `.htaccess` deve estar na raiz do subdomínio. Ele é essencial para:
- Redirecionar rotas
- Habilitar compressão
- Configurar cache

### Solução 3: Verificar Permissões

No File Manager da Hostinger, verifique se os arquivos têm permissões corretas:
- Arquivos: 644
- Pastas: 755

### Solução 4: Testar Localmente

Antes de fazer upload, teste localmente:

```bash
# Instalar um servidor HTTP simples
npx serve out

# Ou usar Python
cd out
python -m http.server 8000
```

Acesse `http://localhost:8000` e verifique se funciona.

### Solução 5: Verificar Console do Navegador

1. Abra o site no navegador
2. Pressione F12 para abrir o DevTools
3. Vá na aba "Console"
4. Verifique se há erros (geralmente relacionados a arquivos não encontrados)

### Solução 6: Verificar Network

1. No DevTools, vá na aba "Network"
2. Recarregue a página (F5)
3. Verifique quais arquivos estão falhando ao carregar (status 404)
4. Ajuste os caminhos conforme necessário

## Passos para Deploy Correto

1. **Build do projeto:**
   ```bash
   npm run build
   ```

2. **Verificar se a pasta `out/` foi criada**

3. **Fazer upload de TODOS os arquivos da pasta `out/` para o subdomínio `wepink`**

4. **Certificar-se de que o `.htaccess` está na raiz**

5. **Acessar o site e verificar**

## Estrutura Correta no Servidor

```
public_html/
└── wepink/          (ou o caminho do seu subdomínio)
    ├── .htaccess
    ├── index.html
    ├── 404.html
    ├── body-splash/
    │   └── top5.html
    ├── _next/
    │   └── static/
    │       ├── chunks/
    │       ├── css/
    │       └── [build-id]/
    ├── logo-primary.svg
    └── pix-icon.svg
```

## Troubleshooting

### Erro: "Cannot GET /"
- Verifique se o `index.html` está na raiz
- Verifique o arquivo `.htaccess`

### Erro: Arquivos CSS/JS não carregam
- Verifique se a pasta `_next/` foi enviada completamente
- Verifique os caminhos no HTML (devem ser `/_next/...`)

### Página em branco
- Abra o console do navegador (F12)
- Verifique erros JavaScript
- Verifique se os arquivos estão sendo carregados na aba Network



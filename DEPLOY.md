# Guia de Deploy - WePink Clone na Hostinger

## Pré-requisitos

1. Acesso ao painel da Hostinger
2. Subdomínio "wepink" configurado
3. Node.js instalado no servidor (ou usar build estático)

## Opção 1: Deploy com Build Estático (Recomendado)

### Passo 1: Build do Projeto

```bash
# Instalar dependências
npm install

# Gerar build estático
npm run build
```

### Passo 2: Configurar Next.js para Export Estático

O Next.js precisa ser configurado para gerar arquivos estáticos. Adicione ao `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  reactStrictMode: true,
}

module.exports = nextConfig
```

### Passo 3: Upload dos Arquivos

1. Acesse o File Manager da Hostinger
2. Navegue até a pasta do subdomínio `wepink`
3. Faça upload de todos os arquivos da pasta `out/` (gerada após o build)
4. Certifique-se de que o arquivo `index.html` está na raiz

### Passo 4: Configurar .htaccess (se necessário)

O arquivo `.htaccess` já está incluído no projeto para redirecionamentos.

## Opção 2: Deploy com Node.js (Se disponível)

### Passo 1: Build do Projeto

```bash
npm install
npm run build
```

### Passo 2: Upload dos Arquivos

1. Faça upload de todos os arquivos do projeto para o subdomínio
2. Certifique-se de que `node_modules` está incluído ou execute `npm install` no servidor

### Passo 3: Configurar Node.js no Painel

1. Acesse o painel da Hostinger
2. Vá em "Node.js"
3. Configure o diretório do projeto
4. Defina o comando de start: `npm start`
5. Defina a porta (geralmente 3000 ou a porta fornecida pela Hostinger)

## Estrutura de Arquivos no Servidor

```
wepink/
├── .next/          (pasta gerada no build)
├── public/         (arquivos estáticos)
├── package.json
├── next.config.js
├── .htaccess
└── node_modules/   (se usar Node.js)
```

## Verificações Pós-Deploy

1. Acesse `https://wepink.seudominio.com`
2. Verifique se todas as rotas funcionam
3. Teste os links e navegação
4. Verifique se as imagens carregam corretamente

## Troubleshooting

### Problema: Página em branco
- Verifique se o build foi gerado corretamente
- Confirme que o arquivo `index.html` está na raiz

### Problema: Erro 404 nas rotas
- Verifique o arquivo `.htaccess`
- Confirme que o Next.js está configurado para export estático

### Problema: Imagens não carregam
- Verifique se a pasta `public/` foi enviada
- Confirme a configuração `images: { unoptimized: true }` no `next.config.js`



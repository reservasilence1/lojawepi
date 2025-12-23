# ⚠️ IMPORTANTE: Configuração de BasePath

## Problema Identificado

Os arquivos estão tentando carregar de:
- ❌ `https://clients.fluxytech.com.br/_next/...`

Mas deveriam carregar de:
- ✅ `https://clients.fluxytech.com.br/wepink/_next/...`

Isso significa que `wepink` é uma **subpasta** dentro de `clients.fluxytech.com.br`, não um subdomínio separado.

## Solução Aplicada

O `next.config.js` foi configurado com:
- `basePath: '/wepink'`
- `assetPrefix: '/wepink'`

## Próximos Passos

### 1. Fazer Novo Build

```bash
npm run build
```

### 2. Verificar os Caminhos

Após o build, abra o arquivo `out/index.html` e verifique se os caminhos começam com `/wepink/_next/...` ao invés de `/_next/...`

### 3. Upload Novamente

Faça upload de **TODOS os arquivos** da pasta `out/` novamente para a pasta `wepink` no servidor.

### 4. Estrutura no Servidor

A estrutura deve ser:
```
clients.fluxytech.com.br/
└── wepink/                    ← Subpasta
    ├── .htaccess
    ├── index.html
    ├── _next/                 ← Agora os caminhos serão /wepink/_next/...
    │   └── static/
    ├── body-splash/
    └── ...
```

### 5. Testar

Acesse: `https://clients.fluxytech.com.br/wepink/`

Os arquivos devem carregar corretamente agora!

## Verificação

Após o build, verifique no console do navegador se os caminhos estão corretos:
- ✅ `https://clients.fluxytech.com.br/wepink/_next/static/css/...`
- ❌ `https://clients.fluxytech.com.br/_next/static/css/...` (errado)



/** @type {import('next').NextConfig} */
// Configuração: basePath apenas quando USE_BASEPATH=true explicitamente

const useBasePath = process.env.USE_BASEPATH === 'true';

const nextConfig = {
  // Removido output: 'export' para permitir deploy no Vercel com rotas dinâmicas
  images: {
    unoptimized: true
  },
  reactStrictMode: true,
  trailingSlash: true,
  // basePath e assetPrefix apenas quando USE_BASEPATH=true
  ...(useBasePath && {
    basePath: '/wepink',
    assetPrefix: '/wepink',
  }),
}

module.exports = nextConfig


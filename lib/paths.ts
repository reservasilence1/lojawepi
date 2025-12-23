// Helper para caminhos que funcionam tanto local quanto em produção
export const getBasePath = () => {
  // Apenas usa /wepink se USE_BASEPATH estiver definido como 'true'
  if (typeof window !== 'undefined') {
    // Client-side: verifica o pathname
    return window.location.pathname.startsWith('/wepink') ? '/wepink' : '';
  }
  // Server-side: usa variável de ambiente
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
};

export const getAssetPath = (path: string) => {
  const basePath = getBasePath();
  // Remove barra inicial duplicada
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
};



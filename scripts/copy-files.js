const fs = require('fs');
const path = require('path');

// Arquivos e pastas para copiar para a pasta out/
const filesToCopy = [
  '.htaccess',
  'public/logo-primary.svg',
  'public/pix-icon.svg',
  'public/kit.jpeg',
  'public/9f8a7b1c.js',
];

// Obter o diretório raiz do projeto
const projectRoot = path.resolve(__dirname, '..');
const outDir = path.join(projectRoot, 'out');

// Copiar arquivos
filesToCopy.forEach((file) => {
  const sourcePath = path.join(__dirname, '..', file);
  const fileName = path.basename(file);
  
  // Se for da pasta public, manter na raiz do out
  let destPath;
  if (file.startsWith('public/')) {
    destPath = path.join(outDir, fileName);
  } else {
    destPath = path.join(outDir, fileName);
  }
  
  if (fs.existsSync(sourcePath)) {
    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copiado: ${file} -> ${destPath}`);
    } catch (error) {
      console.error(`❌ Erro ao copiar ${file}:`, error.message);
    }
  } else {
    console.warn(`⚠️  Arquivo não encontrado: ${sourcePath}`);
  }
});

console.log('\n✅ Arquivos copiados com sucesso!');


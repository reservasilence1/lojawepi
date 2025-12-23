# Script de build para Windows
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "out" -Recurse -Force -ErrorAction SilentlyContinue
npm run build



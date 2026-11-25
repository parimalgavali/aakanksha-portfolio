import { mkdir, cp, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const path of ['index.html', 'style.css', 'script.js', 'assets']) await cp(path, `dist/${path}`, { recursive: true });
console.log('Static portfolio built in dist/');

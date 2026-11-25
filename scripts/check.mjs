import { readFile, access } from 'node:fs/promises';
const html = await readFile('index.html', 'utf8');
for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
  if (/^(https?:|mailto:|tel:)/.test(url)) continue;
  if (url.startsWith('#')) { if (url.length > 1 && !html.includes(`id="${url.slice(1)}"`)) throw new Error(`Missing anchor ${url}`); }
  else await access(url);
}
console.log('All local assets and section links resolve.');

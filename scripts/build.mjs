import { mkdir, cp, rm, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
await cp('assets', 'dist/assets', { recursive: true });
let html = await readFile('index.html', 'utf8');
for (const path of ['style.css', 'script.js']) {
  const content = await readFile(path);
  const hash = createHash('sha256').update(content).digest('hex').slice(0, 12);
  const dot = path.lastIndexOf('.');
  const versioned = `${path.slice(0, dot)}.${hash}${path.slice(dot)}`;
  await writeFile(`dist/${versioned}`, content);
  html = html.replaceAll(`"${path}"`, `"${versioned}"`);
}
await writeFile('dist/index.html', html);
console.log('Portfolio built in dist/ with content-versioned CSS and JavaScript.');

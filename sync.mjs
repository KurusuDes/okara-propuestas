// Copia las propuestas por etapa desde Okarawork y les agrega la navegación entre etapas.
// Uso: node sync.mjs   (después, commit + push desde GitHub Desktop)
// La fuente de verdad sigue siendo Okarawork/Propuesta-okara/build/build-etapas.mjs.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, '..', 'Okarawork', 'Propuesta-okara');

const ETAPAS = [
  { dir: 'etapa-1', file: 'etapa-1-agenda' },
  { dir: 'etapa-2', file: 'etapa-2-kommo' },
  { dir: 'etapa-3', file: 'etapa-3-asesora-24-7' },
];

const NAV_CSS = `
  .pnav { max-width:210mm; margin:0 auto 1rem; display:flex; justify-content:space-between; gap:1rem; flex-wrap:wrap;
          font-family:'Inter',sans-serif; font-size:11px; letter-spacing:.2em; text-transform:uppercase; }
  .pnav a { color:var(--cocoa); text-decoration:none; padding:.5rem 0; }
  .pnav a:hover { color:var(--gold); }
  @media print { .pnav { display:none !important; } }
</style>`;

mkdirSync(join(HERE, 'pdf'), { recursive: true });
ETAPAS.forEach((e, i) => {
  let html = readFileSync(join(SRC, `${e.file}.html`), 'utf8');
  const prev = i > 0 ? `<a href="../${ETAPAS[i - 1].dir}/">← Etapa ${i}</a>` : '<span></span>';
  const next = i < ETAPAS.length - 1 ? `<a href="../${ETAPAS[i + 1].dir}/">Etapa ${i + 2} →</a>` : '<span></span>';
  const nav = `<nav class="pnav">${prev}<a href="../">Las tres etapas</a>${next}</nav>\n\n<div class="actionbar">`;
  html = html
    .replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n<meta name="robots" content="noindex, nofollow" />')
    .replace('</style>', NAV_CSS)
    .replace('<div class="actionbar">', nav);
  mkdirSync(join(HERE, e.dir), { recursive: true });
  writeFileSync(join(HERE, e.dir, 'index.html'), html, 'utf8');
  copyFileSync(join(SRC, 'pdf', `${e.file}.pdf`), join(HERE, 'pdf', `${e.file}.pdf`));
  console.log('ok', e.dir);
});

import { readFile } from 'node:fs/promises';
import fg from 'fast-glob';
import { JSDOM } from 'jsdom';

const POML_PATH = new URL('../poml/discover-landing-structure.poml', import.meta.url);

async function parseTargets() {
  try {
    const xml = await readFile(POML_PATH, 'utf-8');
    const matches = [...xml.matchAll(/<item>([^<]+)<\/item>/g)].map((m) => m[1]);
    return matches.length ? matches : ['public/**/*', 'dist/index.html'];
  } catch {
    return ['public/**/*', 'dist/index.html'];
  }
}

async function main() {
  const targets = await parseTargets();
  const files = await fg(targets, { cwd: new URL('..', import.meta.url), dot: true, onlyFiles: true, absolute: true });

  const root = new URL('..', import.meta.url);
  const toPath = (u) => u.toString().replace(root.toString(), '').replace('file://', '');

  const hasSitemap = files.some((f) => f.endsWith('public/sitemap.xml'));
  const images = files.filter((f) => f.endsWith('.png') || f.endsWith('.webp'));
  const hasOgImage = images.some((f) => f.includes('og')); // heuristic

  // Attempt to extract meta tags from dist/index.html first, fallback to public/index.html
  let metaTags = [];
  try {
    const htmlPaths = files.filter((f) => f.endsWith('dist/index.html') || f.endsWith('public/index.html'));
    if (htmlPaths.length) {
      const html = await readFile(htmlPaths[0], 'utf-8');
      const dom = new JSDOM(html);
      const head = dom.window.document.querySelector('head');
      metaTags = Array.from(head.querySelectorAll('meta, link[rel="canonical"]')).map((el) => {
        return {
          tag: el.tagName.toLowerCase(),
          name: el.getAttribute('name') || el.getAttribute('property') || el.getAttribute('rel') || '',
          content: el.getAttribute('content') || el.getAttribute('href') || ''
        };
      });
    }
  } catch {}

  const result = {
    targets,
    files: files.map(toPath),
    has_sitemap: hasSitemap,
    has_og_image: hasOgImage,
    image_count: images.length,
    meta_tags: metaTags,
  };

  const outPath = new URL('../discovery.json', import.meta.url);
  await BunOrNodeWrite(outPath, JSON.stringify(result, null, 2));
  console.log('Discovery summary written to', toPath(outPath));
}

async function BunOrNodeWrite(url, content) {
  if (typeof Bun !== 'undefined' && Bun.write) {
    await Bun.write(url, content);
  } else {
    const { writeFile } = await import('node:fs/promises');
    await writeFile(url, content, 'utf-8');
  }
}

main().catch((e) => {
  console.error('Discovery failed', e);
  process.exit(1);
});


const { readFile } = require('fs').promises;
const { JSDOM } = require('jsdom');

async function checkSEO() {
  const html = await readFile('./dist/index.html', 'utf-8');
  const dom = new JSDOM(html);
  const head = dom.window.document.querySelector('head');

  const required = [
    'description',
    'og:title',
    'og:description',
    'og:image',
    'twitter:card',
    'canonical',
  ];

  const missing = required.filter((meta) => {
    return !head.querySelector(
      `meta[name="${meta}"], meta[property="${meta}"], link[rel="canonical"]`
    );
  });

  if (missing.length > 0) {
    console.log('Missing SEO tags:', missing);
    process.exit(1);
  }

  console.log('SEO metadata validated');
}

checkSEO().catch((err) => {
  console.error('SEO check error:', err);
  process.exit(1);
});


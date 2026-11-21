import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const needle = 'developer-trust-boot.js';
const tag = '    <script src="/js/developer-trust-boot.js" defer></script>\n';

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === 'store-services-next' || name === '_next' || name === '.next') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

let touched = 0;
for (const file of walk(root)) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes(needle) && (html.includes('site-business-boot.js') || html.includes('assistant-boot.js') || html.includes('payment-config.js'))) {
    html = html.replace(
      /(<script[^>]+site-business-boot\.js[^>]*><\/script>)/,
      `$1\n${tag}`
    );
    if (!html.includes(needle)) {
      html = html.replace(
        /(<script[^>]+assistant-boot\.js[^>]*><\/script>)/,
        `$1\n${tag}`
      );
    }
    if (html.includes(needle)) {
      fs.writeFileSync(file, html);
      touched += 1;
    }
  }
}
console.log(`developer-trust-boot: ${touched} html file(s) updated`);
#!/usr/bin/env node
/* ================================================================
   Emlektabla.net — build-sitemap.js
   Runs on every Vercel deploy via package.json "build" script.
   
   1. Regenerates sitemap.xml from static pages + blog/posts/ scan
   2. Injects gtag-init.js + cookie banner into pages missing them
   ================================================================ */

const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://emlektabla.net';

/* ── Static pages (extensionless URLs, matching cleanUrls:true) ── */
const STATIC_PAGES = [
  { loc: '/',                     changefreq: 'weekly',  priority: '1.0' },
  { loc: '/emlektabla-keszites',  changefreq: 'monthly', priority: '0.9' },
  { loc: '/emlektabla-felujitas', changefreq: 'monthly', priority: '0.9' },
  { loc: '/emlektabla-tervezes',  changefreq: 'monthly', priority: '0.8' },
  { loc: '/halatabla',            changefreq: 'monthly', priority: '0.8' },
  { loc: '/tervezo',              changefreq: 'monthly', priority: '0.8' },
  { loc: '/granit-emlektabla',    changefreq: 'monthly', priority: '0.8' },
  { loc: '/marvany-emlektabla',   changefreq: 'monthly', priority: '0.8' },
  { loc: '/meszko-emlektabla',    changefreq: 'monthly', priority: '0.8' },
  { loc: '/galeria',              changefreq: 'weekly',  priority: '0.7' },
  { loc: '/blog',                 changefreq: 'daily',   priority: '0.7' },
  { loc: '/adatvedelem',          changefreq: 'yearly',  priority: '0.2' },
];

/* ── Gtag + cookie banner snippets to inject ── */
const GTAG_SCRIPT = '<script src="/js/gtag-init.js"></script>';

const COOKIE_BANNER = `<!-- Cookie consent banner -->
<div id="cookie-banner" class="cookie-banner" role="dialog" aria-label="Süti beállítások">
  <p>Ez a weboldal sütiket használ a hirdetések hatékonyságának méréséhez. <a href="/adatvedelem">Részletek</a></p>
  <div class="cookie-btns">
    <button onclick="grantConsent()" class="btn btn-primary cookie-btn">Elfogadom</button>
    <button onclick="denyConsent()" class="btn cookie-btn cookie-deny">Elutasítom</button>
  </div>
</div>`;

/* ── 1. Scan blog/posts/ for HTML files ── */
function scanBlogPosts() {
  const postsDir = path.join(__dirname, 'blog', 'posts');
  if (!fs.existsSync(postsDir)) return [];

  const posts = [];
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.html'));

  for (const file of files) {
    try {
      const html = fs.readFileSync(path.join(postsDir, file), 'utf-8');

      /* Check for noindex — skip if found */
      if (/noindex/.test(html)) continue;

      /* Extract datePublished from JSON-LD */
      let date = null;
      const ldMatch = html.match(/<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
      if (ldMatch) {
        try {
          const ld = JSON.parse(ldMatch[1]);
          date = ld.datePublished || null;
        } catch (e) {}
      }

      const slug = file.replace(/\.html$/, '');
      posts.push({
        loc: `/blog/posts/${slug}`,
        date: date,
        file: path.join(postsDir, file),
      });
    } catch (e) {
      console.warn(`⚠️  Skipping ${file}: ${e.message}`);
    }
  }

  /* Sort newest first */
  posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return posts;
}

/* ── 2. Generate sitemap.xml ── */
function generateSitemap(posts) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const page of STATIC_PAGES) {
    xml += `  <url><loc>${DOMAIN}${page.loc}</loc>`;
    xml += `<changefreq>${page.changefreq}</changefreq>`;
    xml += `<priority>${page.priority}</priority>`;
    xml += `</url>\n`;
  }

  for (const post of posts) {
    xml += `  <url><loc>${DOMAIN}${post.loc}</loc>`;
    if (post.date) {
      const day = post.date.substring(0, 10); /* YYYY-MM-DD */
      xml += `<lastmod>${day}</lastmod>`;
    }
    xml += `<changefreq>monthly</changefreq>`;
    xml += `<priority>0.6</priority>`;
    xml += `</url>\n`;
  }

  xml += '</urlset>\n';
  fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), xml, 'utf-8');
  console.log(`✅ sitemap.xml — ${STATIC_PAGES.length} static + ${posts.length} blog posts`);
}

/* ── 3. Inject gtag + cookie banner into pages missing them ── */
function injectTracking() {
  /* Collect all HTML files */
  const htmlFiles = [];

  /* Root-level HTML */
  for (const f of fs.readdirSync(__dirname)) {
    if (f.endsWith('.html')) htmlFiles.push(path.join(__dirname, f));
  }

  /* blog/index.html */
  const blogIndex = path.join(__dirname, 'blog', 'index.html');
  if (fs.existsSync(blogIndex)) htmlFiles.push(blogIndex);

  /* blog/posts/*.html */
  const postsDir = path.join(__dirname, 'blog', 'posts');
  if (fs.existsSync(postsDir)) {
    for (const f of fs.readdirSync(postsDir)) {
      if (f.endsWith('.html')) htmlFiles.push(path.join(postsDir, f));
    }
  }

  let injected = 0;

  for (const file of htmlFiles) {
    try {
      let html = fs.readFileSync(file, 'utf-8');
      let changed = false;

      /* Inject gtag-init.js if missing */
      if (!html.includes('gtag-init.js')) {
        html = html.replace(
          /(<meta\s+name="viewport"[^>]*>)/i,
          '$1\n' + GTAG_SCRIPT
        );
        changed = true;
      }

      /* Inject cookie banner if missing */
      if (!html.includes('cookie-banner')) {
        html = html.replace(
          /(<script\s+src="\/js\/scripts\.js"[^>]*><\/script>)/i,
          COOKIE_BANNER + '\n$1'
        );
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(file, html, 'utf-8');
        injected++;
        console.log(`  💉 ${path.relative(__dirname, file)}`);
      }
    } catch (e) {
      console.warn(`⚠️  Inject skip ${file}: ${e.message}`);
    }
  }

  console.log(`✅ Tracking injected into ${injected} file(s) that were missing it`);
}

/* ── Run ── */
console.log('🔨 build-sitemap.js starting...');
const posts = scanBlogPosts();
generateSitemap(posts);
injectTracking();
console.log('✅ Build complete');

# Emlektabla.net — Telepítési útmutató

## 1. Lokális tesztelés

1. Csomagold ki a zip-et egy mappába
2. Nyiss egy terminált a mappában
3. Futtasd: `python local-server.py`
4. Nyisd meg: `http://localhost:8000`
5. Ellenőrizd: menü, aloldalak, galéria szűrők, GYIK lenyílók, mobil nézet (böngésző F12 → mobil ikon)

> Az űrlap lokálisan is elküldhető, de amíg a `YOUR_WEB3FORMS_KEY` placeholder van benne, hibát fog jelezni — ez normális.

## 2. GitHub repo

1. github.com → New repository → név: `emlektabla-net` → Private → Create
2. "uploading an existing file" link → húzd be a mappa **teljes tartalmát** (nem magát a mappát!)
3. Fontos: a `blog/posts/.gitkeep` és `img/.gitkeep` is menjen fel, hogy a mappák létezzenek
4. Commit

## 3. Vercel

1. vercel.com → Add New → Project → importáld a `emlektabla-net` repót
2. Framework Preset: **Other** — semmi build parancs nem kell
3. Deploy
4. A `vercel.json` automatikusan érvényesül: clean URL-ek + security headerek

## 4. Web3Forms kulcs

1. web3forms.com → add meg az email címed, ahova az ajánlatkérések érkezzenek → kapsz egy Access Key-t
2. GitHub-on szerkeszd az `index.html`-t: cseréld a `YOUR_WEB3FORMS_KEY` értéket a kapott kulcsra (1 helyen van)
3. Commit → Vercel automatikusan újradeployol
4. Tesztüzenet küldése az éles oldalról

## 5. Domain (amikor élesítesz)

1. Vercel → Project → Settings → Domains → `emlektabla.net` hozzáadása
2. A domain szolgáltatónál állítsd be a Vercel által mutatott DNS rekordokat (A rekord + CNAME a www-hez)
3. A www → non-www átirányítást a Vercel kezeli

## 6. Élesítés utáni teendők

- [ ] Impresszum: [SZOLGÁLTATÓ NEVE], [CÍM], [ADÓSZÁM], [NYILVÁNTARTÁSI SZÁM] kitöltése
- [ ] Adatvédelem: [ADATKEZELŐ NEVE], [CÍM], [ADÓSZÁM] kitöltése
- [ ] Valós képek feltöltése az `img/` mappába, a placeholderek cseréje
- [ ] 3 valós vélemény beírása az index.html vélemények szekciójába
- [ ] Google Search Console: domain verify (DNS TXT), sitemap beküldése: `https://emlektabla.net/sitemap.xml`
- [ ] AI Blog Builder tenant beállítása erre a repóra (blog/posts/ célmappa, post-template.html formátum, BLOG-LIST-START/END markerek a blog/index.html-ben)

## Fájlstruktúra

```
emlektabla-net/
├── index.html              ← főoldal (űrlap + Web3Forms kulcs itt)
├── emlektabla-keszites.html
├── emlektabla-felujitas.html
├── emlektabla-tervezes.html
├── granit-emlektabla.html
├── marvany-emlektabla.html
├── meszko-emlektabla.html
├── galeria.html
├── adatvedelem.html        ← placeholder adatok kitöltendők
├── impresszum.html         ← placeholder adatok kitöltendők
├── blog/
│   ├── index.html          ← BLOG-LIST-START/END markerek a Blog Buildernek
│   ├── post-template.html  ← poszt formátum referencia
│   └── posts/              ← ide commitolja a Blog Builder a posztokat
├── css/styles.css
├── js/scripts.js
├── img/
│   └── og-cover.jpg        ← social megosztási kép (kész)
├── robots.txt
├── llms.txt
├── sitemap.xml
├── vercel.json             ← clean URL-ek + security headerek
└── local-server.py         ← lokális teszt szerver
```

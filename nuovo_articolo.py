#!/usr/bin/env python3
"""Crea un nuovo articolo del blog.

Uso interattivo:   python3 nuovo_articolo.py
Uso rapido:        python3 nuovo_articolo.py --titolo "Titolo" --riassunto "Breve anteprima" \
                       --testo articolo.txt [--immagine assets/img/shot-3.jpg]

Il testo dell'articolo si scrive in un normale file .txt:
  - i paragrafi sono separati da una riga vuota
  - una riga che inizia con "## " diventa un sottotitolo
  - una riga che inizia con "- " diventa un elenco puntato

Lo script crea blog-<titolo>.html, aggiunge l'articolo in js/blog-data.js (cosi' compare
nell'elenco di blog.html) e in sitemap.xml. Poi pubblica con: python3 deploy.py
"""
import argparse, datetime, html, os, re, sys, unicodedata

os.chdir(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://www.officinafotografica.pro"
MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto",
        "settembre", "ottobre", "novembre", "dicembre"]

TEMPLATE = """<!DOCTYPE html>
<html lang="it" class="scroll-smooth">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} | Blog Officina Fotografica</title>
<meta name="description" content="{excerpt}">
<link rel="canonical" href="{site}/{file}">
<meta property="og:type" content="article">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{excerpt}">
<meta property="og:image" content="{site}/{image}">
<meta property="og:url" content="{site}/{file}">
<link rel="icon" href="assets/img/logo.png">

<script src="https://cdn.tailwindcss.com"></script>
<script src="js/tailwind-config.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>

<body data-page="blog">

<div id="site-nav"></div>

<main class="page-in">
  <article>
    <header class="relative pt-44 pb-20 px-6 overflow-hidden">
      <img src="{image}" alt="" class="absolute inset-0 w-full h-full object-cover opacity-25">
      <div class="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-900/80 to-ink-900"></div>
      <div class="relative max-w-3xl mx-auto text-center">
        <p class="eyebrow mb-6"><a href="blog.html" class="hover:text-gold-300">Blog</a> &middot; {date_it}</p>
        <h1 class="serif font-light text-4xl md:text-6xl text-white leading-tight mb-8">{title}</h1>
        <div class="hairline w-40 mx-auto"></div>
      </div>
    </header>

    <div class="py-16 px-6">
      <div class="blog-body max-w-3xl mx-auto">
{body}
      </div>
      <div class="max-w-3xl mx-auto mt-16 pt-8 border-t border-gold-500/20 flex flex-wrap items-center justify-between gap-4">
        <a href="blog.html" class="btn-line px-6 py-3 text-[.7rem] uppercase tracking-[.25em]"><i class="fa-solid fa-arrow-left mr-2"></i>Tutti gli articoli</a>
        <a href="index.html#contatti" class="btn-gold px-6 py-3 text-[.7rem] font-semibold uppercase tracking-[.25em]">Contattaci</a>
      </div>
    </div>
  </article>
</main>

<div id="site-footer"></div>
<div id="site-extras"></div>

<script src="js/layout.js"></script>
<script src="js/main.js"></script>
</body>
</html>
"""


def slugify(t):
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")[:60] or "articolo"


def inline(s):
    s = html.escape(s.strip())
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"\*(.+?)\*", r"<em>\1</em>", s)
    return s


def to_html(text):
    out = []
    for block in re.split(r"\n\s*\n", text.strip()):
        lines = [l for l in block.strip().splitlines() if l.strip()]
        if not lines:
            continue
        if lines[0].startswith("## "):
            out.append("        <h2>%s</h2>" % inline(lines[0][3:]))
            lines = lines[1:]
            if not lines:
                continue
        if all(l.lstrip().startswith("- ") for l in lines):
            out.append("        <ul>\n" + "\n".join("          <li>%s</li>" % inline(l.lstrip()[2:]) for l in lines) + "\n        </ul>")
        else:
            out.append("        <p>%s</p>" % inline(" ".join(lines)))
    return "\n".join(out)


def js_str(s):
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ") + '"'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--titolo")
    ap.add_argument("--riassunto")
    ap.add_argument("--testo", help="file .txt con il testo dell'articolo")
    ap.add_argument("--immagine", default="assets/img/shot-2.jpg")
    ap.add_argument("--data", help="AAAA-MM-GG (default: oggi)")
    a = ap.parse_args()

    titolo = a.titolo or input("Titolo: ").strip()
    riassunto = a.riassunto or input("Breve anteprima (1-2 frasi): ").strip()
    testo_path = a.testo or input("File .txt con il testo dell'articolo: ").strip()
    if not titolo or not os.path.isfile(testo_path):
        sys.exit("Titolo mancante o file del testo non trovato.")
    if not os.path.isfile(a.immagine):
        sys.exit("Immagine non trovata: " + a.immagine)

    data = a.data or datetime.date.today().isoformat()
    d = datetime.date.fromisoformat(data)
    slug = slugify(titolo)
    fname = "blog-%s.html" % slug
    if os.path.exists(fname):
        sys.exit("Esiste gia' %s: scegli un altro titolo." % fname)

    with open(testo_path, encoding="utf-8") as f:
        body = to_html(f.read())

    page = TEMPLATE.format(
        title=html.escape(titolo), excerpt=html.escape(riassunto, quote=True), site=SITE, file=fname,
        image=a.immagine, date_it="%d %s %d" % (d.day, MESI[d.month - 1], d.year), body=body)
    with open(fname, "w", encoding="utf-8") as f:
        f.write(page)

    # indice degli articoli
    entry = '  {slug:%s, file:%s, title:%s, date:%s, excerpt:%s, image:%s},\n' % (
        js_str(slug), js_str(fname), js_str(titolo), js_str(data), js_str(riassunto), js_str(a.immagine))
    with open("js/blog-data.js", encoding="utf-8") as f:
        js = f.read()
    marker = "/*ARTICOLI*/\n"
    if marker not in js:
        sys.exit("js/blog-data.js: marcatore /*ARTICOLI*/ non trovato.")
    with open("js/blog-data.js", "w", encoding="utf-8") as f:
        f.write(js.replace(marker, marker + entry, 1))

    # sitemap
    with open("sitemap.xml", encoding="utf-8") as f:
        sm = f.read()
    loc = "  <url><loc>%s/%s</loc></url>\n" % (SITE, fname)
    if loc not in sm:
        with open("sitemap.xml", "w", encoding="utf-8") as f:
            f.write(sm.replace("</urlset>", loc + "</urlset>"))

    print("Creato %s e aggiunto a blog.html e sitemap.xml.\nPubblica con: python3 deploy.py" % fname)


if __name__ == "__main__":
    main()

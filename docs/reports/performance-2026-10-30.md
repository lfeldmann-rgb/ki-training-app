# Geschwindigkeitsprüfung (live) — KI-Praxis — 2026-10-30

Checks:   response, load   (db, memory, cpu, frontend: am 2026-10-29 lokal
          gemessen, seither unverändert)
Measured: LIVE, https://kurs.feldmannconsult.com — Render **Starter**
          (0,5 CPU, 512 MB), Postgres Basic-256mb, Frankfurt; commit eaafbf1.
          Lastgenerator: der Laptop des Betreibers über das Internet
          (Hausanschluss) — die Zahlen enthalten den Weg dorthin.

🚨 CRITICAL 0   ❌ HIGH 1   ⚠️ MEDIUM 1   ℹ️ LOW 0   ✅ accepted 0

## Numbers

Load target: 100 gleichzeitige Besucher (Vorlagen-Standard, vom Betreiber
bestätigt: „Mit 100 testen“, 2026-10-29). Perzentil p97.5 (autocannon misst
kein p95; p97.5 ist strenger).

| Route | p50 (1) | p97.5 (1) | 100 Verb., ohne Pause: p97.5 / Fehler | 100 Besucher, Klick alle 5 s (20/s): p97.5 / Fehler | Klick alle 10 s (10/s): p97.5 |
|---|---|---|---|---|---|
| /api/healthz | 37 ms | 75 ms | 600 ms / 0 | — | — |
| / | 89 ms | 283 ms | 9 949 ms / **67 Abbrüche (35 %)** | 1 817 ms / 0 | — |
| /plans | 64 ms | 188 ms | 8 012 ms / 0 | — | — |
| /dashboard (angemeldet) | 82 ms | 366 ms | 10 020 ms / **178 Abbrüche (89 %)** | 1 774 ms / 0 | 994 ms |

Durchsatz: höchstens **~12 Seiten pro Sekunde** (/, /dashboard) — die
Anforderung von 20/s wurde nicht erreicht, die Warteschlange wuchs.
Nach allen Läufen: `/api/healthz` 200, `errors --url` leer, kein Absturz
(der Neustart um 15:57 UTC war die Veröffentlichung der Datenschutzerklärung).

## Findings

❌ **HIGH — Der Server schafft rund 12 Seiten pro Sekunde; 100 gleichzeitig aktive Besucher brauchen 20**
- **Where:** Render-Instanz `ki-training-app`, Plan Starter (0,5 CPU)
- **Why:** Bei einem Ansturm — eine Launch-Mail, ein Webinar, das alle gleichzeitig schickt — warten Besucher 1–2 Sekunden pro Seite, und klicken alle ohne Pause, brechen Seiten nach 10 s ab (35 % der Startseiten, 89 % der Dashboards). Für den Alltag eines Kurses mit wenigen gleichzeitigen Nutzern ist das kein Problem: ein einzelner Besucher bekommt jede Seite in unter 0,4 s.
- **Fix:** (a) Render-Plan **Standard** (1 CPU, 2 GB) — kostet mehr, Preis vor der Buchung nachsehen; etwa doppelter Durchsatz erwartet, **danach messen**. (b) Die öffentlichen Seiten (`/`, `/plans`) zwischenspeichern — schon im Bericht vom 2026-10-29 als nächster Schritt genannt, kostet nichts, aber Arbeit. Erst messen, dann das andere. **Kein Geld ausgeben ohne Entscheidung des Betreibers.**
- **Evidence:** autocannon `-c 100 -d 20` und `-c 100 -R 20 -d 20` gegen die Live-Adresse, Tabelle oben

⚠️ **MEDIUM — Titelbilder werden über Adressen ausgeliefert, die nach 5 Minuten ablaufen, aber erst beim Hinscrollen geladen**
- **Where:** Startseite und Lektionen — `MEDIA_S3_PUBLIC_BASE_URL` ist nicht gesetzt, `<img loading="lazy">`
- **Why:** Wer die Startseite länger als 5 Minuten offen hat und dann weiterscrollt, bekommt für die Titelbilder abgelaufene Adressen — graue Kästen statt Bilder. Außerdem kann kein Browser die Bilder zwischenspeichern, weil jede Seite neue Adressen erzeugt.
- **Fix:** Für den Bucket eine öffentliche Adresse einrichten (bei Cloudflare R2 eine eigene Domain wie `bilder.feldmannconsult.com` oder die r2.dev-Adresse) und sie als `MEDIA_S3_PUBLIC_BASE_URL` bei Render eintragen. Nur für öffentliche Bilder: Der Bucket enthält heute ausschließlich die öffentlichen Titelbilder. Bevor jemals private Dateien in denselben Bucket kommen, ist das neu zu bewerten.
- **Evidence:** Live-Startseite: Bildadressen tragen `X-Amz-Expires=300`, fünf von sechs Bildern `loading="lazy"`; `node run.mjs media-check` meldet dasselbe

## Fixed in this run

- ❌ Durchsatz bei Ansturm, für `/` und `/plans` (abgemeldet) → **Seitenkopie im Proxy** (2026-10-31, commit 07cda11, `lib/page-cache.ts`; gebaut auf Wunsch des Betreibers gegen die Empfehlung, die Instanz zu vergrößern). Live, 100 Dauerverbindungen, 20 s:

  | Route | vorher: req/s · p97.5 · Abbrüche | nachher: req/s · p97.5 · Abbrüche |
  |---|---|---|
  | / | 6 · 9 949 ms · **67 (35 %)** | **54** · 6 096 ms · **0** |
  | /plans | 15 · 8 012 ms · 0 | **72** · 3 780 ms · 0 |

  Lokal (ohne Netzweg) 45 → 661 Seiten/s, p97.5 3,7 s → 0,21 s. Live begrenzt jetzt sehr wahrscheinlich die **Leitung des Messrechners**: eine Startseite ist ~160 KB, 54 Seiten/s sind ~70 Mbit/s am Hausanschluss — eine Messung aus dem Rechenzentrum würde das bestätigen. Angemeldete Seiten (`/dashboard`) sind davon NICHT betroffen und bleiben beim Befund.

- ⚠️ Titelbilder → behoben anders als vorgeschlagen (2026-10-31, commit 0b64386): Gültigkeit der Bildadressen 300 s → 3600 s statt öffentlicher Bucket-Adresse (eigene Domain bei R2 bräuchte die DNS bei Cloudflare; r2.dev ist gedrosselt). Live geprüft: `X-Amz-Expires=3600`, 6/6 Bilder geladen. Zwischenspeichern im Browser bleibt dadurch eingeschränkt.

## Open

- ⚠️ Durchsatz bei Ansturm auf **angemeldete** Seiten (`/dashboard`, Lektionen): unverändert ~12 Seiten/s auf Starter. Öffentliche Seiten: behoben (siehe oben).
- ℹ️ Öffentliche Bucket-Adresse für die Titelbilder — nur noch für Zwischenspeicherung, nicht mehr nötig gegen graue Bilder.

## Profil 2026-10-31 — warum das Zwischenspeichern der Seiten NICHT gebaut wurde

- **Gemessen** (CPU-Profil, Produktions-Build, lokal, `/impressum` — eine Seite ohne Digistore24-Aufruf): rund **50 ms Rechenzeit pro Seite**, fast alles im Seitenaufbau von Next.js/React selbst, nicht im Code dieser App und nicht in der Datenbank. Auf Renders 0,5 CPU ergibt das die gemessenen ~12 Seiten/s.
- **Der Digistore24-Kauflink ist kein Engpass:** er wird 20 Stunden in `buy_url_cache` gehalten (`lib/digistore/buyUrl.ts`). Lokal griff der Speicher nicht, weil das DEV-Produkt 756657 bei Digistore24 nicht mehr existiert — jeder Aufruf fragte neu und scheiterte (200–600 ms). Live, mit 757175, greift er.
- **Ganze Seiten zwischenspeichern** hieße, Start- und Preisseite unabhängig von Sprache (Cookie/Browser, ohne Sprachkürzel in der Adresse) und Anmeldestatus (Kopfzeile) zu machen, oder `cacheComponents` für die ganze App einzuschalten. Beides greift in den Kern der Vorlage ein, der für JEDE Seite gilt — ein großer, riskanter Umbau für einen Engpass, der heute keinen Kunden trifft. **Empfehlung des Assistenten** (2026-10-31, die Entscheidung liegt beim Betreiber): nicht bauen. Vor einem großen Launch lieber die Render-Instanz für die Launch-Zeit vergrößern (kostet Geld, Entscheidung des Betreibers, danach messen) und hinterher zurückstufen.

## Worth a look

- Die Lastmessung lief über den Hausanschluss des Betreibers; ein Lastgenerator im Rechenzentrum würde etwas bessere Zahlen zeigen, nicht andere Schlüsse.
- `/api/chat` und `/api/ipn` wurden bewusst nicht unter Last gesetzt (kostet KI-Geld bzw. schreibt Bestellungen).

## Accepted

— keine

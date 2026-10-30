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

— (nichts geändert; die Behebung kostet Geld oder ist eine Entscheidung)

## Open

- ❌ Durchsatz bei Ansturm — Entscheidung: Plan Standard oder Zwischenspeicher.
- ⚠️ Öffentliche Adresse für die Titelbilder.

## Worth a look

- Die Lastmessung lief über den Hausanschluss des Betreibers; ein Lastgenerator im Rechenzentrum würde etwas bessere Zahlen zeigen, nicht andere Schlüsse.
- `/api/chat` und `/api/ipn` wurden bewusst nicht unter Last gesetzt (kostet KI-Geld bzw. schreibt Bestellungen).

## Accepted

— keine

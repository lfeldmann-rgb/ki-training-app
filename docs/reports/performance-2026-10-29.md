# Geschwindigkeitsprüfung — KI-Praxis — 2026-10-29

Checks:   response, db, load, memory, frontend
          (cpu: kein Profil aufgenommen — `load` zeigt auf Rechenzeit, siehe
          Befund 1; ein Profil ist der nächste Schritt dort)
Measured: production build (`next build` + `next start -p 3100`), localhost,
          commit 55fd5c3, Windows-Laptop mit 16 Kernen, EIN Node-Prozess
          (Lastgenerator auf derselben Maschine — rund 20 % zu pessimistisch;
          ein Server beim Hoster hat andere Kerne: die Zahlen dort zählen,
          `go-live` misst sie)

🚨 CRITICAL 0   ❌ HIGH 1   ⚠️ MEDIUM 2   ℹ️ LOW 2   ✅ accepted 0

## Numbers

Load target: 100 gleichzeitige Besucher (Vorlagen-Standard — der Anbieter
kennt seine Zahl noch nicht, „teste mit 100“). Perzentil p97.5 statt p95
(autocannon misst kein p95; p97.5 ist strenger).

| Route | p50 (1 Besucher) | p97.5 (1 Besucher) | p97.5 @ 100 Dauerverbindungen | p97.5 @ 100 Besucher, Klick alle 5 s | Fehler @ 100 | Abfragen pro Aufruf |
|---|---|---|---|---|---|---|
| /api/healthz | 2 ms | 11 ms | — | — | 0 | — |
| / | 47 ms | 134 ms | 5 686 ms | 937 ms | 0 | 2 |
| /plans | 28 ms | 103 ms | 5 640 ms | — | 0 | 0 |
| /dashboard | 67 ms | 183 ms | 7 827 ms | 1 393 ms | 0 | 13 |
| /dashboard/course | 58 ms | 153 ms | — | — | — | 8 |
| /dashboard/course/ki-praxis/was-ki-kann | 61 ms | 181 ms | 9 310 ms | 1 352 ms | **4 Abbrüche (1,6 %)** | 11 |
| /dashboard/aufgabe?thema=was-ki-kann | 53 ms | 144 ms | 6 848 ms | 1 092 ms | 0 | 8 |
| /dashboard/chat | 45 ms | 142 ms | — | — | — | 6 |
| /dashboard/account | 58 ms | 165 ms | — | — | — | — |

Durchsatz eines Prozesses: `/plans` ~24 Seiten/s, `/` ~21/s, `/dashboard`
~15–16/s (bei „Klick alle 5 s“ wurden 20/s angefragt und nur ~16/s geschafft).

Browser (Lighthouse, Handy-Simulation, zwei Läufe): `/` 84–85 Punkte,
LCP 4,4 s, TBT 50 ms, CLS 0 · `/login` (Vorlage, unverändert) 87–90,
LCP 3,6–4,0 s.

Speicher des Prozesses: 545 MB direkt nach der Last, 586 MB 20 s später.

## Findings

❌ **HIGH — Ein App-Prozess schafft nur ~16–24 Seiten pro Sekunde**
- **Where:** Server-Rendering jeder Seite (alle Routen gleich betroffen)
- **Why:** Bei 100 Dauerverbindungen warten Besucher 5–9 s, auf der
  Lektionsseite brachen 4 von 244 Anfragen ab. Realistischer — 100 Besucher,
  die alle 5 s klicken — liegt die Übersicht schon bei 1,4 s und am
  Durchsatzlimit. Eine Start-Mail, auf die viele gleichzeitig klicken, stößt
  genau hier an.
- **Fix:** Die Datenbank ist NICHT die Ursache (`/plans` macht 0 Abfragen und
  staut genauso; Verbindungsvorrat 10, Datenbank erlaubt 100). Es ist
  Rechenzeit pro Seite in einem einzigen Prozess. In dieser Reihenfolge:
  1. **Messen, wo die Rechenzeit hingeht** (`cpu`-Profil) — 40–60 ms pro
     Seite sind viel für diese Seiten.
  2. **Die öffentlichen Seiten zwischenspeichern** (`/`, `/plans`): dort
     landet der Ansturm einer Start-Mail, und sie sind für alle Besucher fast
     gleich.
  3. **Mehr Rechenleistung beim Hoster** (zweiter Prozess / größere Instanz) —
     kostet Geld, Entscheidung des Anbieters beim `setup-hosting`.
  Danach erneut messen, auf dem echten Server.
- **Evidence:** Tabelle oben; autocannon `-c 100 -d 20` und
  `-c 100 -d 20 --overallRate 20`

⚠️ **MEDIUM — Das große Bild der Startseite erscheint auf Handys spät**
- **Where:** `/`, Titelbild (`components/ui/figure.tsx` über
  `lib/practice/covers.ts`), LCP 4,4 s
- **Why:** In der Handy-Simulation sieht ein Besucher die Seite erst nach
  über 4 s „fertig“ — knapp über der Grenze von 4 s. Die unveränderte
  Anmeldeseite liegt bei 3,6–4,0 s, ein Teil ist also Grundlast.
- **Fix:** eine kleinere Bildvariante für schmale Bildschirme
  (1280 px wird auch Handys geschickt); das Bild ist schon als `priority`
  markiert
- **Evidence:** Lighthouse, zwei Läufe, `largest-contentful-paint-element`
  ist das Titelbild

⚠️ **MEDIUM — Die Übersicht braucht 13 Datenbankabfragen, eine Lektion 11**
- **Where:** `/dashboard`, `/dashboard/course/ki-praxis/<lektion>`
- **Why:** nach der Vorlage-Tabelle 6–20 = MEDIUM. Die Zahl ist FEST — sie
  wächst nicht mit Lektionen oder Kunden (kein N+1). Heute kein Engpass
  (Befund 1 ist es nicht die Datenbank).
- **Fix:** Bei Gelegenheit: `practiceTopics()` wird auf der Übersicht zweimal
  gefragt (Kurs-Karte und erste Schritte) — einmal würde reichen.
- **Evidence:** `log_statement = 'all'` für einen Aufruf je Seite, gezählt in
  `.dev/db.log` (danach wieder ausgeschaltet)

ℹ️ **LOW — Speicher nach der Last nicht freigegeben (+41 MB)**
- **Where:** Node-Prozess der App
- **Why:** unter der Grenze von 50 MB; Node gibt Speicher oft verzögert frei
- **Fix:** beim Livegang über einen Tag beobachten (Hoster-Grafik)
- **Evidence:** 545 MB → 586 MB, 20 s nach der Last

ℹ️ **LOW — Lighthouse 84–85 statt ≥ 90 auf der Startseite**
- **Where:** `/`
- **Why:** fast ausschließlich der LCP-Wert aus dem MEDIUM oben
- **Fix:** derselbe
- **Evidence:** zwei Lighthouse-Läufe

## Fixed in this run

— (Bericht zuerst)

## Open

- Alle fünf Befunde. Der HIGH braucht zuerst eine Messung (Profil), dann eine
  Entscheidung — ein Teil davon (mehr Rechenleistung) kostet Geld.
- Die Last-Zahlen stammen vom Laptop. Beim Livegang auf dem echten Server
  wiederholen (`go-live`).

## Worth a look

- Ein erster Lighthouse-Lauf direkt nach dem Lasttest ergab 48 Punkte mit
  6,5 s „nicht zuordenbarer“ Blockade — ein Messfehler (Server und Rechner
  noch ausgelastet). Zwei spätere Läufe: 84–85. Gezählt sind die späteren.
- `/api/chat` und `/api/ipn` wurden bewusst nicht unter Last gesetzt (das
  eine kostet bei OpenAI Geld pro Anfrage, das andere schreibt Bestellungen).
- Die Anmeldung ohne Kennwort ist im Produktions-Build aus — richtig so. Die
  Sitzung für die Messung kam aus der Entwicklungs-App (gleiches
  `AUTH_SECRET`).

## Accepted

— (keine)

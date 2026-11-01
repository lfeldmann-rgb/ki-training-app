# Akzeptierte Geschwindigkeitswerte — KI-Praxis

Was hier steht, ist bewusst so entschieden und wird von der Geschwindigkeitsprüfung nicht als Befund gezählt — solange der gemessene Wert nicht über den akzeptierten steigt. Die Annahme gilt für eine Zahl, nicht für eine Seite.

| Route / thing | Metric | Accepted | Why | By | Date | Review |
|---|---|---|---|---|---|---|
| angemeldete Seiten (`/dashboard`, Lektionen) auf Render Starter | Durchsatz ~12 Seiten/s; bei 100 gleichzeitigen Besuchern p97.5 ~1,8 s (Klick alle 5 s), Abbrüche ohne Pause | ≥ 10 Seiten/s, p97.5 ≤ 2 s bei 20 Klicks/s | „Ich erwarte niemals 100 gleichzeitige Nutzer“ — ein Kurs für Inhaber kleiner Betriebe, Einmalkauf, kein Live-Event | Richard Lutz Feldmann | 2026-11-01 | vor einem Webinar, einer großen Launch-Mail oder wenn Render-Metriken dauerhaft > 50 % CPU zeigen |

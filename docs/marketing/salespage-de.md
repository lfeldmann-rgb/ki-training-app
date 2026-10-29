# Verkaufsseite KI-Praxis — Entwurf (Deutsch)

_Stand 2026-10-29. Stimme: `docs/marketing/voice.md`. Abschnitte: alle acht,
„du entscheidest“ des Anbieters am 2026-10-29._

## Funktionsliste (bestätigt vom Anbieter am 2026-10-29)

| Name, wie die App ihn zeigt | Wo | Was drin ist |
|---|---|---|
| Kurs „KI-Praxis für deinen Betrieb“ | Menü „Kurs“, `content/course/ki-praxis/course.json` | 5 Lektionen in 3 Abschnitten, jede mit Titelbild, Fortschrittsbalken |
| Selbsttest | Kartentitel „Selbsttest: …“ am Ende jedes Abschnitts | 3 Selbsttests mit je 4 Fragen, Auswertung sofort |
| Lernspiel „Wer macht was?“ | Kartentitel in Lektion 1 | 8 Karten: „Kann KI vorbereiten“ oder „Bleibt bei dir“ |
| Meine Aufgabe im Betrieb | Menü | KI schlägt 3 Aufgaben für den eigenen Betrieb vor, führt Schritt für Schritt hindurch, gibt Rückmeldung auf die Umsetzung |

| Lisa | `config/ai-chat.json` → `name`, Seite „Lisa fragen“ | KI-Assistentin, antwortet aus ihrem Handbuch und den Lektionen; nur für Käufer (`requiresPlan: "ki_praxis"`) |

Lisa kam am 2026-10-29 dazu, nachdem ihr Handbuch geschrieben war. Konto,
Abrechnung: keine Funktionen, die man kauft.

Preis: 149 €, einmal (aus `config/digistore-products.json`, auf der Seite über
`formatPrice()`, nie abgetippt).

---

## 1 · Einstieg

- **Überschrift:** Lass die KI den Kleinkram in Laden und Werkstatt vorbereiten.
- **Unterzeile:** Der Praxiskurs für Inhaber von Läden, Werkstätten und
  kleinen Betrieben. Du lernst, wo KI dir im Alltag Zeit spart. Und du setzt
  es gleich in deinem Betrieb um.
- **Button:** Kurs kaufen (→ zum Angebot)
- **Zweiter Link:** Was drin ist (→ Abschnitt 4)
- **Bild:** Titelbild Lektion 1 (Bäcker mit Tablet), Alt-Text aus dem Manifest

## 2 · Problem und Wende

- **Überschrift:** Dein Tag ist voll. Und nicht nur mit deiner Arbeit.
- **Text:** Du stehst auf der Leiter, und das Telefon klingelt. Eine Anfrage
  wartet seit gestern auf Antwort. Der Beitrag für Instagram ist wieder
  liegen geblieben. Und die Bestellliste steht noch auf einem Zettel an der
  Kasse.
- **Wende:** Genau dort hilft dir KI. Nicht bei deinem Handwerk, sondern
  beim Drumherum. In KI-Praxis lernst du, wo das geht. Und du setzt es selbst
  um, Schritt für Schritt.

## 3 · Was du davon hast

Überschrift: Was sich in deinem Alltag ändert

1. **Du verpasst weniger Anrufe.** In der Lektion zum KI-Telefonassistenten
   erfährst du, wie Anrufe angenommen werden, während du arbeitest.
2. **Du antwortest schneller auf Anfragen.** Mit **Meine Aufgabe im Betrieb**
   baust du dir Antwortvorlagen für die Fragen, die immer wieder kommen.
3. **Du weißt, was du abgeben kannst.** Im Lernspiel **„Wer macht was?“**
   übst du, was die KI vorbereiten kann und was bei dir bleibt.

## 4 · Das bekommst du

Überschrift: Das steckt in KI-Praxis

- **Kurs „KI-Praxis für deinen Betrieb“:** fünf Lektionen in drei
  Abschnitten. Du arbeitest sie in deinem Tempo durch.
- **Selbsttest:** am Ende jedes Abschnitts vier kurze Fragen. Du siehst
  sofort, was hängen geblieben ist.
- **Lernspiel „Wer macht was?“:** acht Aufgaben aus dem Betriebsalltag. Du
  entscheidest bei jeder: Kann die KI das vorbereiten, oder bleibt es bei
  dir?
- **Meine Aufgabe im Betrieb:** Du beschreibst deinen Betrieb in ein paar
  Stichworten. Die KI schlägt dir drei passende Aufgaben vor und führt dich
  Schritt für Schritt hindurch. Danach schreibst du auf, wie es lief, und
  bekommst eine Rückmeldung mit dem nächsten Schritt.
- **Lisa, deine KI-Assistentin:** beantwortet deine Fragen zum Kurs und zur
  App, rund um die Uhr. Bei Geld und Zugang verweist sie dich an uns.

Darunter: **Die fünf Lektionen** (mit Titelbild, Titel aus dem Kurs)
1. Was KI für deinen Betrieb tun kann – und was nicht
2. Immer erreichbar: ein KI-Telefonassistent
3. Bestellungen und Notizen einfach ins Handy sprechen
4. Marketing und Social Media mit KI
5. Kundenanfragen schneller beantworten

## 5 · Wer dahintersteht

- **Überschrift:** Von einem Berater, der kleine Betriebe kennt
- **Text:** KI-Praxis kommt von Feldmann Consult aus Pfungstadt. Seit Jahren
  bringen wir KI in kleine Betriebe: in Läden, Werkstätten und
  Handwerksbetriebe. Praxisnah und auf deinen Alltag zugeschnitten. Diesen
  Kurs haben wir aus dieser Arbeit gebaut.

_(Nur Aussagen von feldmannconsult.com. Keine Kundenstimmen — es gibt noch
keine.)_

## 6 · Das Angebot

- **Überschrift:** KI-Praxis für deinen Betrieb
- **Inhalt (aus Abschnitt 4):** 5 Lektionen mit Titelbildern · 3 Selbsttests ·
  Lernspiel „Wer macht was?“ · Meine Aufgabe im Betrieb mit KI-Vorschlägen und
  Rückmeldung · Lisa, deine KI-Assistentin für Fragen zum Kurs
- **Preis:** {formatPrice}. Einmal zahlen, kein Abo.
- **Widerruf:** Du hast das gesetzliche Widerrufsrecht von 14 Tagen. Wann es
  bei digitalen Inhalten früher endet, steht im Bestellformular.
- **Wer kassiert:** Wir verkaufen über die Plattform Digistore24. Unter diesem
  Namen erscheint die Zahlung auf deinem Kontoauszug.
- **Nach dem Kauf:** Du meldest dich mit deiner E-Mail-Adresse an und startest
  mit Lektion 1.
- **Button:** Kurs kaufen

## 7 · Häufige Fragen

1. **Brauche ich Vorwissen über KI?** Nein. Der Kurs fängt bei null an und
   kommt ohne Fachwörter aus.
2. **Wie viel Zeit brauche ich?** Die Lektionen sind kurz. Du arbeitest in
   deinem Tempo, auch zwischendurch.
3. **Passt das zu meinem Betrieb?** Der Kurs ist für Läden, Werkstätten und
   kleine Betriebe gemacht. Unter **Meine Aufgabe im Betrieb** beschreibst du
   deinen Betrieb, und die Vorschläge richten sich danach.
4. **Kostet die KI in den Aufgaben extra?** Nein. Die Vorschläge und
   Rückmeldungen sind im Preis enthalten.
5. **Ist das ein Abo?** Nein. Du zahlst einmal.
6. **Wer kassiert, und kann ich widerrufen?** Wir verkaufen über die Plattform
   Digistore24. Du hast das gesetzliche Widerrufsrecht von 14 Tagen. Wann es
   bei digitalen Inhalten früher endet, steht im Bestellformular.

## 8 · Letzter Aufruf

- **Text:** Fang mit deiner ersten Aufgabe an. Noch diese Woche.
- **Button:** Kurs kaufen

## Lektorat — 2026-10-29, Runde 1 — Urteil: zurück

Gelesen als Fremder, vom Schreiber selbst nach Schließen des Entwurfs, von der
Festplatte (ein eigener Leser konnte nicht gestartet werden). 49 Sätze.
3 × zurück, 5 Hinweise.

| # | Stelle | Kriterium | Befund | Vorschlag |
|---|---|---|---|---|
| 1 | Einstieg, Button / Angebot / Schluss | 4.5 eine Handlung, gleiche Worte | „Kurs ansehen“ oben, „Jetzt kaufen“ unten — zwei Wörter für dieselbe Handlung | überall „Kurs kaufen“ |
| 2 | Angebot, Widerruf; FAQ 6 | 8.4 Widerrufsrecht genannt | „gesetzliches Widerrufsrecht“ ohne Frist | „von 14 Tagen“ nennen, und ehrlich dazu, dass es bei digitalen Inhalten früher enden kann |
| 3 | Überschrift | 7.1 Wettbewerber-Test | „Lass die KI den Kleinkram vorbereiten.“ passt über jedes KI-Werkzeug | die Leser benennen: „… in Laden und Werkstatt …“ |
| 4 | Angebot, Wer kassiert; FAQ 6 | 1.2 unbekannter Begriff | „Digistore24“ ohne Rolle | „die Plattform Digistore24, über die wir verkaufen“ |
| 5 | Angebot | 3.3 nach dem Klick | Was passiert nach dem Kauf, steht nirgends | „Du meldest dich an und startest mit Lektion 1.“ |
| 6 | Angebot, Preis | 6.1 Gedankenstrich | „{Preis} — einmal zahlen“ | zwei Sätze |
| 7 | Wende | 6.1 Antithese (nur als Überschrift ausgeschlossen) | „Nicht bei deinem Handwerk, sondern beim Drumherum.“ | darf bleiben; im Text, nicht in einer Überschrift |
| 8 | Wer dahintersteht, Satz 4 | 8.1 nichts erfunden | „Diesen Kurs haben wir aus dieser Arbeit gebaut.“ steht nicht auf der Website — stimmt aber: der Kurs ist von Feldmann Consult | bleibt; der Anbieter bestätigt es mit der Freigabe |

Behoben in Runde 2: 1, 2, 3 (zurück) sowie 4, 5, 6 (Hinweise).

## Lektorat — 2026-10-29, Runde 2 — Urteil: freigegeben

Gelesen als Fremder, 52 Sätze. 0 × zurück, 2 Hinweise offen (7, 8 aus Runde 1,
beide bewusst stehen gelassen). Die fünf Fragen des Fremden sind innerhalb
eines Bildschirms beantwortet: was (Kurs, Überschrift + Unterzeile), für wen
(Inhaber von Läden, Werkstätten, kleinen Betrieben), was es kostet (Angebot,
ein Klick über „Kurs kaufen“), warum glauben (Feldmann Consult, ohne erfundene
Stimmen), was klicken („Kurs kaufen“, dreimal gleich). Alle vier Zeilen der
Funktionsliste stehen in Abschnitt 4 mit ihrem App-Namen; jede Zahl (5, 3, 4,
8, 3) steht so in der App. Kein Wort über die Dauer des Zugangs.

## Lektorat — 2026-10-29, Runde 3 (Nachtrag Lisa) — Urteil: freigegeben

Gelesen: die neue Zeile in Abschnitt 4 und im Angebot. 1.2: Lisa bei der ersten
Nennung mit Rolle („deine KI-Assistentin“) — erfüllt. 5.2: der Name steht so in
`config/ai-chat.json` und auf ihrer Seite „Lisa fragen“ — erfüllt. 8.3: sie ist
auf `ki_praxis` gesperrt, also genau auf das Produkt hinter dem Button —
erfüllt. 6.1: keine ausgeschlossene Konstruktion. 0 × zurück, 0 Hinweise.

**Entwurf zur Vorlage bei einer Rechtsberatung** — am 2026-10-29 mit Software aus dem Datenbestand dieser App entworfen, noch nicht rechtlich geprüft. Keine Rechtsberatung.

# Rechts-Check — KI-Praxis — 2026-10-29

Checks: scope, ai, consent, pages, rights, evidence, map
App:    local, commit 9e9476a (vor diesem Lauf)

🚨 CRITICAL 0   ❌ HIGH 3   ⚠️ MEDIUM 1   ℹ️ LOW 2   ✅ accepted 0
(nach diesem Lauf offen: ❌ HIGH 1, ⚠️ MEDIUM 1, ℹ️ LOW 2 — Impressum und Datenschutzerklärung sind als Entwurf geschrieben, siehe „Fixed in this run")

## Scope

Vom Betreiber beantwortet am 2026-10-29, gelesen von allen weiteren Checks:

| Frage | Antwort |
|---|---|
| Vertragspartner beim Kauf | **unbekannt** — Digistore24 als Wiederverkäufer oder Feldmann Consult selbst; steht im Digistore24-Vertrag |
| Beschäftigte / Umsatz | 1 Person, unter 2 Mio. € |
| Kunden | Verbraucher **und** Unternehmen |
| Sitz / Recht | Deutschland |
| Hochrisiko-Einsatz (Anhang III) | nein |
| Wozu berät der Coach | KI-Einsatz im eigenen Betrieb — nicht Gesundheit, Geld oder Recht |

Von der Platte gelesen:
- KI-Assistentin Lisa an (`config/ai-chat.json`), Aufgaben-Coach an (`config/ai-companion.json`), Anbieter OpenAI (`config/ai-models.json`, „auto" auf den OpenAI-Schlüssel).
- Kein Tracking, keine Analyse (`config/consent.json` ohne Zwecke).
- HTTP-Schnittstelle installiert, **aus**; bisher keine Schlüssel ausgegeben (Export: `apiKeys` 0).
- Verkauf: Einmalzahlung 149 €; Kurs `self-study` (zeitunabhängig), Selbsttests mit Bestehensgrenze, ein KI-Coach, der auf Umsetzungsberichte antwortet; kein `community`-Modul, kein Zertifikat versprochen.
- Mail-Dienst und Hoster: **noch nicht gewählt**.

## Findings

❌ **HIGH — Keine Verträge zur Auftragsverarbeitung, Grundlage der US-Übermittlung offen**
- **Where:** `docs/compliance/avv-register.md` — OpenAI (USA), Hoster, Mail-Dienst
- **Why:** Ohne Vertrag nach Art. 28 DSGVO darf kein Dienstleister Kundendaten verarbeiten. Für OpenAI kommt die Übermittlung in die USA hinzu, die eine Grundlage nach Art. 44 ff. DSGVO braucht. Die Datenschutzerklärung hat dafür eine markierte Lücke.
- **Fix:** im OpenAI-API-Konto das Data Processing Addendum abschließen und prüfen, ob OpenAI nach dem EU-US Data Privacy Framework zertifiziert ist. Beim Livegang dasselbe für Hoster und Mail-Dienst, dann die Lücken in der Datenschutzerklärung füllen.
- **Evidence:** `docs/data-protection.md` §5 (Empfänger), `config/ai-models.json`

⚠️ **MEDIUM — AGB und Widerrufsbelehrung hängen am unbekannten Vertragspartner**
- **Where:** `content/legal/` — es gibt keine AGB und keine Widerrufsbelehrung
- **Why:** Ist Digistore24 Wiederverkäufer, stellt Digistore24 die Kaufbedingungen. Verkauft Feldmann Consult selbst, braucht es eigene AGB, eine Widerrufsbelehrung und für digitale Inhalte die Zustimmung zum vorzeitigen Erlöschen des Widerrufsrechts (§ 356 Abs. 5 BGB). Nutzungsbedingungen für die App wären in beiden Fällen Sache des Betreibers.
- **Fix:** die Rolle im Digistore24-Vertrag nachlesen oder beim Digistore24-Support erfragen, dann mit der Rechtsberatung entscheiden.
- **Evidence:** Scope-Frage 1, Antwort „weiß ich nicht"

ℹ️ **LOW — Maßnahmen zur KI-Kompetenz nicht belegt**
- **Where:** `docs/compliance/ki-kompetenz.md`
- **Why:** Art. 4 AI Act verlangt ausreichende KI-Kompetenz bei den Menschen, die die Systeme betreiben. Sie ist hier naheliegend, aber nicht aufgeschrieben.
- **Fix:** eigene Schulungen und Erfahrung mit Datum eintragen.
- **Evidence:** Datei angelegt, Abschnitt „Offen"

ℹ️ **LOW — Bestellungen werden nach Ablauf der Aufbewahrungsfrist nicht gelöscht**
- **Where:** `docs/data-protection.md` §6, `docs/compliance/loeschkonzept.md`
- **Why:** Bestellungen dürfen 6–10 Jahre bleiben (§ 147 AO, § 257 HGB), danach nicht mehr. Kein Auftrag löscht sie.
- **Fix:** vor dem Ablauf der ersten Frist entscheiden: jährlich von Hand oder ein Löschauftrag.
- **Evidence:** `node run.mjs cron --list` — kein Auftrag für `orders`

## Fixed in this run

- ❌ → Entwurf: **Impressum** (§ 5 DDG) in de, en, es, fr — `content/legal/impressum.*.md`. Platzhalter entfernt, Entwurfs-Hinweis gesetzt.
- ❌ → Entwurf: **Datenschutzerklärung** (Art. 13 DSGVO) in de, en, es, fr — `content/legal/datenschutz.*.md`, aus `docs/data-protection.md` geschrieben. Enthält: Digistore24-Rolle je nach Vertrag, die Trennung zwischen Lisa (keine Kontodaten) und Coach (Betriebsprofil, Berichte), OpenAI USA, IP 15 Minuten, IPN-Rohdaten 60 Tage, Adressänderung 24 Stunden, KI-Kostenprotokoll und Support-Zugriffsprotokoll je 12 Monate, die Ausnahme für Bestellungen bei der Löschung, kein Tracking, die Rechte und die Antwortfrist von einem Monat. Zwei markierte Lücken („vor dem Start eintragen") für Hoster und Mail-Dienst, eine für die Grundlage der US-Übermittlung.
- ⚠️ → erledigt: **Nachweis-Paket** (Art. 5 Abs. 2) — die sieben Dokumente unter `docs/compliance/`.

## What was built

| Check | Ergebnis |
|---|---|
| `ai` | Hinweis nach Art. 50 (1) für Lisa und Coach in 4 Sprachen ✓ (`legal-check`). Rolle: Betreiber. Kein Hochrisiko. KI-Register mit einer Zeile je System. |
| `consent` | Keine Einwilligung nötig: nur Sitzungs-, Sprach- und Darstellungs-Cookie, kein Tracking. **Kein Cookie-Banner** — er wäre hier ein Fehler, keine Vorsicht (§ 25 Abs. 2 TDDDG). |
| `pages` | Impressum und Datenschutzerklärung als Entwurf, 4 Sprachen. |
| `rights` | Auskunft/Übertragbarkeit: `node run.mjs data-export` liefert für ein Testkonto Konto, Freischaltung, Betriebsprofil, Berichte, Kursfortschritt, Selbsttests, KI-Gespräche, Support-Zugriffe. `lib/privacy/export.test.ts` und `inventory.test.ts` grün (40 Tests). Löschung, Berichtigung, Sperre: in der Vorlage vorhanden. Keine automatisierte Entscheidung (kein `community`-Modul). |
| `evidence` | verarbeitungsverzeichnis, tom, loeschkonzept, avv-register, ki-register, ki-kompetenz, datenpanne. |
| Löschfristen | alle Löschaufträge sind am 2026-10-29 gelaufen (`legal-check`). |

**Weitere Regeln:**
- **BFSG (Barrierefreiheit):** erreicht dich noch nicht — Kleinstunternehmen mit Dienstleistung (unter 10 Personen und höchstens 2 Mio. €). Ab der Grenze muss die ganze Kundenoberfläche WCAG 2.1 AA erfüllen; das ist ein Projekt, kein Häkchen.
- **DSA:** die Kontaktstelle für Nutzer und Behörden gilt auch für Kleinstunternehmen. Erfüllt durch E-Mail und Telefon im Impressum, nicht nur durch einen Chat. Transparenzberichte erst ab 50 Personen und 10 Mio. €.
- **Data Act:** erreicht dich bei Geschäftskunden über Datenübertragbarkeit — der Download auf der Kontoseite deckt die eigenen Daten ab. Kein Abo, also kein Anbieterwechsel zu regeln.
- **NIS2:** nicht betroffen.
- **FernUSG:** siehe „Still needs a human".

## Open

- ❌ Verträge zur Auftragsverarbeitung und Grundlage der US-Übermittlung (OpenAI, Hoster, Mail-Dienst).
- ⚠️ AGB und Widerrufsbelehrung — erst nach Klärung des Vertragspartners.
- ℹ️ KI-Kompetenz belegen.
- ℹ️ Löschung von Bestellungen nach Ablauf der Frist.

## Worth a look

- **Titelbilder sind KI-erzeugt.** Art. 50 (2) richtet sich an Anbieter des Modells, Art. 50 (4) an täuschend echte Darstellungen — beides trifft hier nach Lage der Dinge nicht zu. Eine kurze Rückfrage bei der Rechtsberatung kostet wenig.
- **Hoster-Protokoll:** Das eigene Protokoll des Hosters kann ungeschwärzte Zeilen enthalten. Die Frist dort ist erst nach der Wahl des Hosters bekannt.

## Still needs a human

1. 🚨 **FernUSG — ob der Kurs eine Zulassung der ZFU braucht.** Gefundene Tatsachen: Der Kurs kostet Geld. Er ist zeitunabhängiges Selbststudium, die Lernenden sind also überwiegend räumlich getrennt. Ein KI-Coach liest, was die Lernenden zu ihren Aufgaben aufschreiben, und gibt Rückmeldung — eine Modell-Bewertung trägt nach der Vorlage das Merkmal „Überwachung des Lernerfolgs". Die Selbsttests mit Bestehensgrenze werden automatisch ausgewertet und tragen es für sich nicht. Ein `community`-Raum oder eine menschliche Korrektur gibt es nicht, ein Zertifikat wird nicht versprochen. Ohne nötige Zulassung ist ein Vertrag nach § 7 Abs. 1 FernUSG nichtig, auch gegenüber Unternehmen (BGH, 12.06.2025 – III ZR 109/24). **Das entscheidet eine Rechtsberatung, nicht diese Prüfung** — vor dem ersten Verkauf.
2. **Vertragspartner bei Digistore24** klären → davon hängen AGB und Widerrufsbelehrung ab.
3. **Alle Texte** (Impressum, Datenschutzerklärung, die sieben Nachweise) durch eine Rechtsberatung lesen lassen. Erst danach entfernt der Betreiber den Entwurfs-Hinweis (`<!-- ds24-appkit:draft -->` und die fette Zeile).
4. **Hoster und Mail-Dienst** beim Livegang in die Datenschutzerklärung und das AVV-Register eintragen.
5. **Bestellungen nach 10 Jahren** — Löschung entscheiden.

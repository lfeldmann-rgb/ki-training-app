**Entwurf zur Vorlage bei einer Rechtsberatung** — am 2026-10-29 mit Software aus dem Datenbestand dieser App entworfen, noch nicht rechtlich geprüft. Keine Rechtsberatung.

# Ablauf bei einer Datenpanne (Art. 33/34 DSGVO)

**Die Frist: 72 Stunden** ab Kenntnis bis zur Meldung an die Aufsichtsbehörde — auch wenn noch nicht alles bekannt ist. Fehlendes darf nachgereicht werden.

## Wer entscheidet
Richard Lutz Feldmann — die einzige Person (lf@feldmannconsult.com, 0176-3172-2853).

## Schritte
1. **Notieren:** wann bemerkt, durch wen, was genau. Dieser Zeitpunkt startet die 72 Stunden.
2. **Eindämmen:** betroffene Schlüssel beim Aussteller tauschen (OpenAI, Digistore24, Hoster, Mail-Dienst), betroffene Konten sperren, notfalls die App vom Netz nehmen.
3. **Bewerten:** welche Daten (siehe `verarbeitungsverzeichnis.md`), wie viele Personen, welches Risiko für sie.
4. **Melden**, wenn ein Risiko für die Betroffenen nicht unwahrscheinlich ist: Hessischer Beauftragter für Datenschutz und Informationsfreiheit, Wiesbaden — über das Online-Meldeformular der Behörde.
5. **Betroffene informieren** bei hohem Risiko (Art. 34): klar, in einfachen Worten, mit einer Empfehlung (zum Beispiel: Kennwort ändern).
6. **Dokumentieren** — immer, auch ohne Meldung (Art. 33 Abs. 5): in `docs/compliance/pannen/JJJJ-MM-TT.md` Sachverhalt, Folgen, Maßnahmen und die Entscheidung über die Meldung mit Begründung.
7. **Panne bei einem Dienstleister:** Die Frist beginnt mit dessen Meldung an dich.

## Hilfsmittel
- `node run.mjs data-export --email …` — was über eine Person gespeichert ist.
- `node run.mjs security-check` — Geheimnisse im Code, bekannte Schwachstellen.
- Das Protokoll der Support-Zugriffe im Betreiberbereich.

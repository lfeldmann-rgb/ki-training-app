**Entwurf zur Vorlage bei einer Rechtsberatung** — am 2026-10-29 mit Software aus dem Datenbestand dieser App entworfen, noch nicht rechtlich geprüft. Keine Rechtsberatung.

# Technische und organisatorische Maßnahmen (Art. 32 DSGVO)

Hier stehen nur Maßnahmen, die im Code dieser App tatsächlich vorhanden sind.

## Zugangs- und Zugriffskontrolle
- Anmeldung per Einmal-Link; ein optionales Kennwort wird nur als **scrypt-Hash** gespeichert (`lib/credentials/hash.ts`).
- Anmelde- und Bestätigungs-Tokens werden gehasht gespeichert und gelten nur einmal.
- Der geschützte Bereich `/dashboard` öffnet sich nur mit Sitzung (`auth.config.ts`). Jede neue Seite außerhalb davon muss in `app/route-protection.test.ts` begründet sein, sonst schlägt der Build fehl.
- Betreiberfunktionen nur über `requireOwner()` (`lib/authz.ts`); die Rolle wird bei jedem Zugriff frisch aus der Datenbank gelesen.
- Kundenaktionen über `requireActiveUser()`; keine Aktion nimmt eine Nutzer-ID aus dem Formular.
- Das Sperren eines Kontos beendet auch laufende Sitzungen.
- Zugriff auf gekaufte Inhalte nur über `hasPlan(memberId, "ki_praxis")`.
- Die HTTP-Schnittstelle (Modul `api`) ist **ausgeschaltet** (`config/api.json`).

## Integrität der Zahlungsdaten
- Jede Benachrichtigung von Digistore24 wird per **SHA-512-Signatur** geprüft; bei ungültiger Signatur wird sie abgewiesen und hat keine Wirkung (`lib/digistore/ipn.ts`).
- Eine doppelt zugestellte Benachrichtigung bucht nicht doppelt (eindeutige Schlüssel auf der Bestellnummer).
- Der Bestellstatus wird ausschließlich durch diese Benachrichtigungen gesetzt.

## Missbrauchsschutz
- Anmeldeversuche werden pro IP und Adresse begrenzt, nur im Arbeitsspeicher, 15 Minuten (`lib/rate-limit.ts`).

## Datensparsamkeit
- IP-Adressen werden nie gespeichert.
- Das KI-Kostenprotokoll enthält keine Inhalte.
- Lisa erhält keine Kontodaten; der Aufgaben-Coach nur Betriebsprofil, Berichte, Gesprächsverlauf und Lektionstitel.
- Was Kunden schreiben, geht nur abgegrenzt an die KI (`buildFencedRequest()` — Schutz vor eingeschleusten Anweisungen).
- Das Fehlerprotokoll schwärzt E-Mail-Adressen und Schlüssel.

## Support-Zugriff
- Anmelden als Kunde kann nur der Betreiber; jede Sitzung wird protokolliert und nach 30 Minuten automatisch beendet.

## Geheimnisse
- Schlüssel stehen nur in Umgebungsvariablen (lokal `.env`, live im Geheimnisspeicher des Hosters), nie im Code. Prüfung mit `node run.mjs security-check`.

## Verfügbarkeit und Belastbarkeit — **offen bis zum Livegang**
- Verschlüsselte Übertragung (HTTPS), Datenbank-Sicherungen und Serverstandort hängen vom Hoster ab — vor dem Start eintragen.

## Überprüfung
- Sicherheitsprüfung am 2026-10-29 (`docs/reports/security-2026-10-29.md`); täglicher Abgleich bekannter Schwachstellen in Paketen (`check-advisories`).

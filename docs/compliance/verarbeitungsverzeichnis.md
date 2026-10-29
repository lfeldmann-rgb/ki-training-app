**Entwurf zur Vorlage bei einer Rechtsberatung** — am 2026-10-29 mit Software aus dem Datenbestand dieser App entworfen, noch nicht rechtlich geprüft. Keine Rechtsberatung.

# Verzeichnis von Verarbeitungstätigkeiten (Art. 30 DSGVO)

**Verantwortlicher:** Feldmann Consult, Inhaber Richard Lutz Feldmann, Niedergasse 43, 64319 Pfungstadt · lf@feldmannconsult.com
**Datenschutzbeauftragter:** keiner benannt (nicht erforderlich, § 38 BDSG — eine Person)
**Quelle:** `docs/data-protection.md` (aus dem Code gelesen), `config/ai-models.json`, `config/cron.json`
**Hinweis:** Die Ausnahme nach Art. 30 Abs. 5 DSGVO greift nicht — die Verarbeitung erfolgt regelmäßig.

| # | Tätigkeit | Betroffene | Daten | Zweck | Rechtsgrundlage | Empfänger | Löschung |
|---|---|---|---|---|---|---|---|
| 1 | Konto & Anmeldung | Kunden | E-Mail, Name (optional), Kennwort-Hash (optional), Sitzung, ausstehende Adressänderung | Bereitstellung des Kurses | Art. 6 (1) b | Hoster, Mail-Dienst | mit Kontolöschung; Adressänderung ≤ 24 h |
| 2 | Kaufabwicklung | Käufer | Bestellnummer, Produkt, Betrag, Zeitpunkt, E-Mail, Name; Roh-Nachricht von Digistore24 | Freischaltung, Buchhaltung | Art. 6 (1) b, c | Digistore24 (Rolle je nach Vertrag), Hoster | Bestellungen 6–10 J. (§ 147 AO, § 257 HGB), Verknüpfung bei Kontolöschung entfernt; Roh-Nachricht 60 Tage |
| 3 | Kurs & Übungen | Kunden | erledigte Lektionen, Ergebnisse von Selbsttests und Lernspiel | Kursfortschritt | Art. 6 (1) b | Hoster | mit Kontolöschung |
| 4 | „Meine Aufgabe im Betrieb" | Kunden | Betriebsprofil (Branche, Größe, Engpass), Umsetzungsberichte, Gesprächsverlauf | passende Vorschläge und Rückmeldung | Art. 6 (1) b | OpenAI (USA), Hoster | mit Kontolöschung |
| 5 | KI-Assistentin Lisa | Kunden | Fragen, Gesprächsverlauf (keine Kontodaten an die KI) | Hilfe zur App | Art. 6 (1) b | OpenAI (USA), Hoster | mit Kontolöschung |
| 6 | KI-Kostenprotokoll | Kunden | Aufgabe, Modell, Token-Zahl, Zeitpunkt — kein Inhalt | Kostenkontrolle | Art. 6 (1) f | Hoster | 12 Monate (`prune-ai-usage`) |
| 7 | Support-Zugriff | Kunden | wer, wann, wie lange | Support, Nachvollziehbarkeit | Art. 6 (1) f | Hoster | 12 Monate (`prune-impersonations`) |
| 8 | Missbrauchsschutz | Besucher | IP-Adresse, nur im Arbeitsspeicher | Schutz vor Durchprobieren von Kennwörtern | Art. 6 (1) f | — | 15 Minuten, nie gespeichert |
| 9 | Fehlerprotokoll | Besucher, Kunden | letzte 500 Zeilen, E-Mail und Schlüssel geschwärzt, im Arbeitsspeicher | Fehlersuche | Art. 6 (1) f | Hoster (eigenes Protokoll, ungeschwärzt) | beim Neustart; Hoster-Protokoll: **offen** |
| 10 | Einrichtungs-Protokoll | Betreiber | Einrichtungsaktionen | Nachvollziehbarkeit | Art. 6 (1) f | Hoster | 24 Monate (`prune-setup-audit`) |

**Übermittlung in ein Drittland:** OpenAI, L.L.C. (USA) — Grundlage **offen** (Zertifizierung nach dem EU-US Data Privacy Framework prüfen, sonst Standardvertragsklauseln). Mail-Dienst: **noch nicht gewählt**.
**Technische und organisatorische Maßnahmen:** siehe `tom.md`.

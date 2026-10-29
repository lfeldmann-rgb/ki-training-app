**Entwurf zur Vorlage bei einer Rechtsberatung** — am 2026-10-29 mit Software aus dem Datenbestand dieser App entworfen, noch nicht rechtlich geprüft. Keine Rechtsberatung.

# Löschkonzept

Nachweis: `node run.mjs cron --list` zeigt, wann jeder Löschauftrag zuletzt lief. Zuletzt geprüft am 2026-10-29: alle liefen ohne Fehler.

| Daten | Frist | Wie | Nachweis |
|---|---|---|---|
| Konto und alles daran (Fortschritt, Ergebnisse, Betriebsprofil, Berichte, KI-Gespräche) | Kontolöschung | durch den Kunden auf `/dashboard/account` oder durch den Betreiber; Kaskade in der Datenbank | der Lösch-Dialog nennt die Ausnahme |
| Bestellungen, Rechnungen | 6–10 Jahre (§ 147 AO, § 257 HGB) | bleiben bei Kontolöschung stehen, die Verknüpfung wird entfernt (Art. 17 Abs. 3 b DSGVO) | — |
| Roh-Nachrichten von Digistore24 | 60 Tage | `prune-ipn-log`, täglich | Liste der geplanten Aufgaben |
| KI-Kostenprotokoll | 12 Monate | `prune-ai-usage`, täglich | Liste der geplanten Aufgaben |
| Protokoll der Support-Zugriffe | 12 Monate | `prune-impersonations`, täglich | Liste der geplanten Aufgaben |
| Einrichtungs-Protokoll | 24 Monate | `prune-setup-audit`, täglich | Liste der geplanten Aufgaben |
| abgebrochene Uploads | täglich | `prune-abandoned-uploads` | Liste der geplanten Aufgaben |
| ausstehende Adressänderung | 24 Stunden | läuft ab | — |
| IP-Adressen | 15 Minuten | nur im Arbeitsspeicher | — |

## Offen — Entscheidung des Betreibers
- **Bestellungen nach Ablauf der Aufbewahrungsfrist:** Nichts löscht sie automatisch. Im ersten Jahr ist das richtig, ab dem elften nicht mehr. Bis dahin entscheiden: jährlich von Hand löschen oder einen Löschauftrag einrichten.
- **Protokoll des Hosters:** Die Frist hängt vom Hoster ab — beim Livegang eintragen.

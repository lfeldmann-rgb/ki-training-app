**Entwurf zur Vorlage bei einer Rechtsberatung** — am 2026-10-29 mit Software aus dem Datenbestand dieser App entworfen, noch nicht rechtlich geprüft. Keine Rechtsberatung.

# KI-Register (EU AI Act)

**Rolle dieser App: Betreiber** (Englisch „deployer"). Die Modelle stammen von OpenAI; Feldmann Consult setzt sie unter eigenem Namen in der App ein.

| System | Wo | Modell / Anbieter | Was die KI erhält | Risikoklasse | Hinweis nach Art. 50 (1) |
|---|---|---|---|---|---|
| KI-Assistentin „Lisa" | Chat-Fenster und `/dashboard/chat` | OpenAI (Aufgabe `chat`, in `config/ai-models.json` auf „auto") | Frage und Handbuch `content/knowledge/`, **keine Kontodaten** | begrenztes Risiko (Transparenzpflicht) | ✓ in 4 Sprachen, `legal-check` am 2026-10-29 |
| Aufgaben-Coach | `/dashboard/aufgabe` | OpenAI (Aufgabe `companion`) | Betriebsprofil, Umsetzungsberichte, Gesprächsverlauf, Lektionstitel | begrenztes Risiko; berät zum KI-Einsatz im Betrieb — **nicht** zu Gesundheit, Geld oder Recht | ✓ in 4 Sprachen |
| Titelbilder | nur beim Erstellen der Kursinhalte | OpenAI (Aufgabe `image`) | Bildbeschreibungen, keine Personendaten | minimal | Die Bilder sind KI-erzeugt. Ob eine Kennzeichnung nötig ist, von der Rechtsberatung prüfen lassen (Art. 50 (2) richtet sich an Anbieter, Art. 50 (4) an täuschend echte Darstellungen) |

**Kein Hochrisiko-System** nach Anhang III: keine Bewerberauswahl, keine Bonitätsprüfung, kein Zugang zu wesentlichen Diensten.
**KI-Kompetenz (Art. 4):** siehe `ki-kompetenz.md`.


const {
  updaters,
  checkIsLatestDocument,
} = require('./updateTemplate')


const newDoc = `
2019_06_27_FSR-Sitzung.md


#+ ((?![^\n]+tasks\n))([^#]*)

(#{3,} (.+\n))([^#]*)


multiline
(#{3,} (.+\n))([^#]*)
[^#]?(#{3} (.+\n))([^#]*)
\n(#{3} (.*tasks\n))([^#\n]+\n)+

---
title: Sitzungsprotokoll FSR Geoinformatik
date: 26.06.2019, 18:27 - 19:09 Uhr
header-includes: \setcounter{secnumdepth}{2}
---

||
----------------:|:---------------------------------------------
**Protokollant:**| Norwin
**Anwesend:**    | Lennart, Felix, Nick, Phil, Fabian, ?, ?, Thomas, Max, Judith, Leverkusen, Tom, Sarah, Norwin
**Sitzungsort:** | Wersehaus!1!11

# Organisation & Übliches
Anwesend sind alle Anwesenden. Protokoll schreibt der Protokollant. Rede- und Stimmrecht für alle Anwesenden beantragt und genehmigt. Das letzte Protokoll ist geschrieben, in Ordnung und [online](https://geofs.uni-muenster.de/wp/wp-content/uploads/protokolle/2016/2019_05_19_FSR-Sitzung.pdf).

## Tasks
### Dauertasks
- **Specki, Judith**: Kuchen mitbringen!
- **alle**: Abwesenheit im Wiki vermerken oder per Mail abmelden
- **ProtokollantIn**: Diese Seite nach der Sitzung aufräumen und neue Tasks aus dem aktuellen Protokoll hier her Übertragen
- **Fabian**: Mit Marius und Barto wegen SoPra in Prüfungsordnung einpflegen


### Erledigte Tasks
- **Sarah**: Einladung zur konstituierenden FSV-Sitzung
- **Leverkusen**: Mail schreiben bezüglich T-Shirt und Pullover


### Nicht erledigte Tasks
- **Ilka** Lernstoff-Fach aufräumen (scannen und in die Cloud hochladen) (wird gemacht bis Weihnachten (welches Jahr?))
- **Specki vs. Lennart**: ifgi Drucker im FS-Raum einrichten
- **Sarah & Norwin**: Positionspapier zum status quo des MSc GI, Ideen zur Verbesserung sammeln, irgendwie ans Institut weiter geben.
- **Nick**: Konzeptpapier erstellen was im Kurs GeoSoft1 verbessert werden kann/ muss
- **Norwin**: Server Dokumentation aktualisieren
- **Leverkusen**: Plakat-Dateien in Cloud hochladen
- **Norwin, Thomas und gerne alle**: über das Ersti-Heft schauen und nach Aktuallisierungen und Verbesserungen Ausschau halten
- **Christoph**: Ersti-Heft in die Cloud hochladen
- **Christoph**: Ersti-Heft finanzielle Aspekte
- **Tackleberry**: Kassenprüfung durchführen

### Neue Tasks
- **Sarah**: Antonia wg Master Positionspapier fragen


## Berichte aus Gremien / HoPo
### FK
- 27.6. (morgen) Lange Nacht der Studienberatung!
- Campus Managementsystem dauert weiter an, Stelle weiterhin frei!

### NaWi FK
- Diskussion änderungen Hochschulgesetz: Allgemeine Anwesenheitspflicht (dagegen!)

- Diskriminierung 2-Fachbachelors & Leerämtler in vielen Studiengängen: konstruktive Vorschläge folgen nächste sitzung
- Wahlen: AG Wahlen der FK will ab 2021 digital Wählen (bis dahin muss noch der teure Wahlzettel-Drucker abbezahlt werden)
  - Dienstleister will 30ct pro Wahlberechtigte
  - angeblich Steigerung von Wahlbeteiligung von bis zu 50% möglich
- mehr Gelder im FK Topf, für Studi-Forschungsprojekte
- ZIV hat jetzt ne Cloud™, (Umzug v. geofssrv möglich!)
- Infrastrukturapokalypse: alle Drucker im ZIV kaputt
- aber: 500k vom Land für WLAN-Kabel bis Ende des Jahres
- Fortschritt in Verhandlungen mit Springer (& 2 anderen Verlagen?)
- Lehrpreis vom Land ausgelobt (Studierende & Digitale Lehre)
- der vegane Trend geht weiter: statt Kuchen gibts bald Linsen in der Informatik
- Halbzeitstudium (12 Semester Regelstudienzeit)

nächste FK am 10.7. **bei uns**!

### FBR
- Plagiat-Prüfsoftware wird vorraussichtlich uniweit angeschafft, und soll vermutlich den Studis zum Selbsttest zur Verfügung gestellt werden.
- "Fahrradprofessur": für nachhaltige Mobilität und Stadtplanung, evtl auch neues Master Programm (aber nicht unser Fachbereich?)
- Zusammenlegung Geo-Bibs? Angedacht, aber steht noch in den Sternen

## Posteingang


# Sonstiges

## GeoScienceDay
- Einladung & Anmeldung zu Absolventenfeier viel zu spät angekommen (böses Prüfungsamt?)
-
`

const fileName = '2019_06_27_FSR-Sitzung.md'

console.log(updaters['FSR-Sitzung'](newDoc, fileName))



console.log(checkIsLatestDocument(fileName))
console.log(checkIsLatestDocument('2019_09_27_FSR-Sitzung.md'))
console.log(checkIsLatestDocument('2019_01_27_FSR-Sitzung.md'))

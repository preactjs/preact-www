---
name: Projektziele
permalink: '/about/project-goals'
---

# Preacts Ziele

## Ziele

Preact zielt darauf ab, Leistung aufgrund folgender Ziele zu liefern:

- **Leistung:** Schnell und effizient rendern
- **Größe:** Leichtigkeit und kleine Größe _(ungefähr 3.5kb)_
- **Effizienz:** Effektive Speichernutzung _(Wiederverwendung, GC-Müll verhindern)_
- **Verständlichkeit:** Die Grundlagen des Codes zu Verstehen sollte nicht länger als ein paar Stunden dauern
- **Kompatibilität:** Preact zielt darauf ab, _Kompatibilität im großen Rahmen_ mit der React API zu erreichen. [preact-compat] versucht, die größtmögliche Kompatibilität mit React zu erzielen.

## Nicht-Ziele

Einige Features von React wurden absichtlich nicht in Preact integriert, da sie entweder mit Berücksichtigung der obengenannten primären Projektziele nicht umsetzbar sind oder aber nicht in den Umfang von Preacts Grundausstattung an Funktionalitäten passen.

- Die beabsichtigten Artikel unter [Was fehlt?](/guide/differences-to-react#whats-missing):

    - PropTypes, die leicht als seperate Bibliothek verwendet werden können
    - Children, da Preact immer children als Array verpackt
    - Synthetic Events, da Preact nicht versucht, Fehler in älteren Browsern (z.B. IE8) zu beheben

[preact-compat]: https://github.com/developit/preact-compat/

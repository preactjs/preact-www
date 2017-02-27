---
name: Ziele des Projekts
permalink: '/about/project-goals'
---

# Ziele des Projekts

## Ziele

Preact verfolgt einige wenige Kernziele:

- **Performance:** Schnelles und effizientes Rendering
- **Größe:** Geringe Dateigröße und _(ungefähr 3.5kb)_
- **Effizienz:** Sparsame Speichernutzung _(Recycling, Vermeidung des Bedarfs an Garbage Collection)_
- **Verständlichkeit:** Die Codebase sollte sich innerhalb weniger Stunden erschließen
- **Kompatibilität:** Preact zielt darauf ab, _weitestgehend kompatibel_ mit der React-API zu sein. [preact-compat] ist auf höchstmögliche Kompatibilität mit React angelegt.

## Nicht-Ziele

Einige Features von React fehlen in Preact bewusst, weil sie entweder nicht mit den obigen Zielen vereinbar sind oder nicht in den Rahmen der Kernfunktionalitäten von Preact passen.

- Ganz bewusst ausgelassen in [Was fehlt?](/guide/differences-to-react#whats-missing):
    - PropTypes, die problemlos als separate Library implementiert werden können
    - Children, weil diese in Preact immer als Array behandelt werden
    - Synthetische Events, weil Preact nicht darauf ausgelegt ist, Probleme veralteter Browser wie IE8 zu beheben

[preact-compat]: https://github.com/developit/preact-compat/

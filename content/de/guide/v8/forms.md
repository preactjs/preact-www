---
name: Eingabemasken
permalink: '/guide/forms'
---

# Eingabemasken

Eingabemasken funktionieren in Preact fast genauso wie in React, allerdings gibt es keine Unterstützung für "statische" (Ausgangswert) props/Attribute.

**[React Eingabemasken-Doku](https://facebook.github.io/react/docs/forms.html)**

---

<div><toc></toc></div>

---

## Kontrollierte & Unkontrollierte Komponenten

Reacts Dokumentation zu ["Kontrollierten" Komponenten](https://facebook.github.io/react/docs/forms.html#controlled-components) und ["Unkontrollierten" Komponenten](https://facebook.github.io/react/docs/forms.html#uncontrolled-components) ist ungemein nützlich, wenn man verstehen möchte, wie man HTML-Eingabemasken mit bidirektionalem Datenfluss benutzt und sich diese im Kontext eines komponentenbasierten DOM-Renderer, welche normalerweise unidirektionale Datenflüsse haben, zu Nutze macht.

Generell sollte man versuchen, immer _Kontrollierte_ Komponenten zu verwenden. Trotzdem kann es beim Erstellen von unabhängigen Komponenten oder umschließenden Drittanbieter-UI-Bibliotheken sehr nützlich sein, die Komponente einfach als Mount-Punkt für Non-Preact-Funktionalitäten zu verwenden. In diesen Fällen sind _Unkontrollierte_ Komponenten genau richtig für die Aufgabe.


## Kontrollboxen & Radio Buttons

Kontrollboxen und Radio Buttons (`<input type="checkbox|radio">`) können anfänglich für Verwirrung sorgen, wenn man kontrollierte Eingabemasken erstellt. Dies ist damit zu begründen, dass man in einer unkontrollierten Umgebung normalerweise dem Browser erlauben würden, eine Kontrollbox oder einen Radio Button für uns "umzuschalten" oder "anzukreuzen", auf Änderungsereignisse zu warten und auf den neuen Wert zu reagieren. Allerdings geht diese Technik nicht sonderlich gut in ein Weltbild über, in dem da UI immer wieder automatisch als Reaktion auf state- und prop-Änderungen aktualisiert wird.

> **Durchlauf:** Man geht davon aus, dass wir auf ein "Änderungs"ereignis einer Kontrollbox warten, welches ausgelöst wird, wenn die Kontrollbox aus- oder abgewählt wird. Der Änderungsereignis-Handler wird den neuen Wert, der von der Kontrollbox empfangen wird, einem Wert in `state` zuordnen. Dies löst das Neurendern der Komponente aus, was den Wert der Kontrollbox dem Wert von state neu zuordnen wird. Das ist allerdings unnötig, das wir gerade beim DOM einen Wert angefragt haben, ihm dann aber das Neurendern mit dem gewünschten Wert befohlen haben.

Man sollte also anstatt auf ein `change`-Ereignis auf ein `click`-Ereignis warten, welches bei jedem Click des Nutzers auf die Kontrollbox _oder ein assoziiertes `<label>`_ ausgelöst wird. Kontrollboxen schalten lediglich zwischen Boolean `true` und `false` hin und her, daher bewirkt ein Klick auf die Kontrollbox oder das Label nichts anderes als eine Invertierung des aktuellen Status, das Auslösen einer Neurenderung und das Setzen des gewünschten Wertes innerhalb der Kontrollbox.

### Kontrollboxbeispiel

```js
class MeineEingabemaske extends Component {
    toggle = e => {
        let checked = !this.state.checked;
        this.setState({ checked });
    };
    render({ }, { checked }) {
        return (
            <label>
                <input
                    type="checkbox"
                    checked={checked}
                    onClick={this.toggle} />
            </label>
        );
    }
}
```

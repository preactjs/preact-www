---
name: Formulare
permalink: '/guide/forms'
---

# Formulare


Formulare in Preact funktionieren im Wesentlichen genauso wie in React. Allerdings werden statische Props/Attribute (für Ausgangswerte) nicht unterstützt.

**[React Formulare Doku](https://facebook.github.io/react/docs/forms.html)**


## Controlled & Uncontrolled Components

Die Kapitel der React-Dokumentation über ["Controlled" Components](https://facebook.github.io/react/docs/forms.html#controlled-components) und ["Uncontrolled" Components](https://facebook.github.io/react/docs/forms.html#uncontrolled-components) sind äußerst nützlich, wenn es darum geht zu verstehen, wie HTML-Formulare, bei denen Daten in beide Richtungen fließen, im Kontext eines Virtual-DOM-Renderer auf Komponentenbasis mit unidirektionalem Datenfluss verwendet werden können.

Allgemein solltest du versuchen, immer _Controlled_ Components zu verwenden. Bei der Entwicklung von Standalone-Komponenten oder dem Wrappen von Third-Party-UI-Libraries kann es allerdings trotzdem hilfreich sein, die Komponente einfach als Mountpoint für nicht-Preact-Logik zu verwenden. In diesen Fällen bieten sich "Uncontrolled" Components wunderbar an.


## Checkboxen & Radio-Buttons

Checkboxen und Radio-Buttons (`<input type="checkbox|radio">`) können anfänglich für Verwirrung sorgen. Das liegt daran, dass wir üblicherweise in nicht-kontrollierten Umgebungen dem Browser erlauben würden, eine Checkbox oder einen Radio-Button für uns zu "toggeln" oder zu "checken", auf change-Events zu überwachen und auf neue Werte zu reagieren. Allerdings lässt sich dieses Vorgehen nicht gut auf eine Weltanschauung übertragen, inder das UI immer automatisch in Reaktion auf Änderungen von State und Props aktualisiert wird.

> **Schritt für Schritt:** Angenommen, wir überachen die "change"-Events einer Checkbox, welche ausgelöst werden, wenn die Checkbox an- oder abgewählt wird. In unserem Change-Event-Handler setzen wir einen Wert in `state` auf den neuen Wert, den wir von der Checkbox erhalten haben. Dadurch wird ein Neurendern unserer Komponente ausgelöst, welche den Wert der Checkbox auf den Wert aus dem State neu zuweist. Das ist überflüssig, da wir das DOM gerade nach einem Wert gefragt haben und das DOM dann darum gebeten haben, mit dem selben Wert neuzurendern.

Anstatt `change`-Events zu überwachen, sollten wir also `click`-Events überwachen, welche jedes Mal ausgelöst werden, wenn auf die Checkbox _oder ein verbundenes `<label>`_ geklickt wird. Checkboxes wechseln nur zwischen den boolschen Werten `true` und `false`. Beim Klick auf die Checkbox oder das Label invertieren wir also einfach den Wert, den wir im State haben, lösen dadurch ein Neurendern aus und setzen den dargestellten Wert der Checkbox auf den gewünschten.

### Checkbox-Beispiel

```js
class MyForm extends Component {
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

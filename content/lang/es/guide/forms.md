---
name: Forms
permalink: '/guide/forms'
---

# Formularios

Los Formularios en Preact funcionan de la misma manera que en React, excepto que no tienen soporte para propiedades y atributos estáticos (valor inicial).

**[Documentación de Formularios en React](https://facebook.github.io/react/docs/forms.html)**


## Componentes Con Control y Sin Control

La documentación de React sobre [Componentes "Con Control"](https://facebook.github.io/react/docs/forms.html#controlled-components) y [Componentes "Sin Control"](https://facebook.github.io/react/docs/forms.html#uncontrolled-components) es muy útil para entender cómo construir el HTML de los formularios, que tienen un flujo de datos bidireccional, y cómo hacer uso de estos en el contexto de un componente que utiliza Virtual DOM para ser renderizado, que generalmente tiene un flujo de datos unidireccional.

En general, debes intentar utilizar _Componentes "Con Control"_ para todos los casos. Sin embargo, cuando se construyen componentes independientes o componentes que hacen uso de librerías de UI de terceros, puede resultar útil utilizar tu componente para agrupar toda la funcionalidad que no sea de Preact. En estos casos, los _Componentes "Sin Control"_ se adaptan muy bien para llevar a cabo esta tarea.


## Checkboxes y Radio Buttons

Los checkboxes y radio buttons (`<input type="checkbox|radio">`) pueden causar confusión al crear formularios. Esto se debe a que normalmente permitimos que el navegador "cambie" o "marque" un checkbox o un radio button por nosotros, escuchando un evento de cambio y reaccionando ante el nuevo valor. Sin embargo, esta técnica no es la adecuada en un mundo donde la UI siempre es actualizada automáticamente cuando cambia su estado o sus propiedades.

> **Paso-a-Paso:** Digamos que escuchamos el evento "change" de un checkbox, el cual se dispara cuando el usuario marca o desmarca dicho control. En nuestra función de callback, establecemos un valor en el `state` utilizando el nuevo valor que recibimos del checkbox. Haciendo esto, vamos a disparar un redibujo de nuestro componente, el cual va a reasignar el valor del checkbox al valor del estado. Esto es innecesario, ya que acabamos de consultar al DOM por un valor, pero luego le indicamos que se redibuje con el mismo valor que acabamos de obtener.

Por lo tanto, en vez de escuhar un evento `change`, debemos escuchar el evento `click`, el cual se dispara en cualquier momento que el usuario hace click sobre el checkbox _o el `<label>` asociado_. Los checkboxes solo cambian entre los valores `true` y `false`, por lo tanto, al hacer click en el control o en el label, solamente tendríamos que invertir el valor que tengamos en el `state`, desencadenando un redibujo del componente con el nuevo valor que se tiene que mostrar.

### Ejemplo de Checkbox

```js
class MyForm extends Component {
    toggle(e) {
        let checked = !this.state.checked;
        this.setState({ checked });
    }
    render({ }, { checked }) {
        return (
            <label>
                <input
                    type="checkbox"
                    checked={checked}
                    onClick={::this.toggle} />
            </label>
        );
    }
}
```

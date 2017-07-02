---
name: Extendiendo Component
permalink: '/guide/extending-component'
---

# Extendiendo `Component`

Es posible que en algunos proyectos quieras extender `Component` con funcionalidad adicional.

Existen variadas opiniones sobre el valor de la herencia en JavaScript, pero si quieres construir tu "clase base" de la cual todos tus componentes heredan, Preact te tiene cubierto.

Quizás quieras automatizar la conexión con stores/reducers como en una arquitectura a la Flux. Quizás quieras agregar mixins basados en propiedades para sentirlo más como `React.createClass()` _note(: el [`@bind` decorator](https://github.com/developit/decko#bind) es preferible)_.

En cualquier caso, solo tienes que usar la herencia de clases de ES2016 para extender la clase `Component` de Preact:

```js
class BoundComponent extends Component {
    // example: get bound methods
    binds() {
        let list = this.bind || [],
            binds = this._binds;
        if (!binds) {
            binds = this._binds = {};
            for (let i=list.length; i--; ) {
                binds[list[i]] = this[list[i]].bind(this);
            }
        }
        return binds;
    }
}
```

Ejemplo de uso:

```js
class Link extends BoundComponent {
    bind = ['click'];
    click() {
        open(this.props.href);
    }
    render({ children }) {
        let { click } = this.binds();
        return <span onClick={ click }>{ children }</span>;
    }
}

render(
    <Link href="http://example.com">Click Me</Link>,
    document.body
);
```


Las posibilidades son ilimitadas. A continuación una versión extendida de la clase `Component` que soporta mixins rudimientarios:

```js
class MixedComponent extends Component {
    constructor() {
        super();
        (this.mixins || []).forEach( m => Object.assign(this, m) );
    }
}
```

---

> **Nota al pie:** Vale la pena notar que la herencia puede encerrarte en relaciones padre-hijo frágiles. Usualmente cuando enfrentamos a una tarea de programación que puede ser solucionada adecuadamente con herencia, hay más de una manera funcional de llegar a la misma meta que no incluye crear esta relación.

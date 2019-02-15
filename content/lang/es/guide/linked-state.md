---
name: Estado asociado
permalink: '/guide/linked-state'
---

# Estado asociado


Hay un área de Preact que va un poco más allá que React a la hora de optimizar cambios de estado. Un patrón común en código ES2015 en React es usar Arrow functions dentro del método `render()` para actualizar estado en respuesta a eventos. Creando funciones encerradas en un contexto en cada render es ineficiente y fuerza al garbage collector a hacer más trabajo que el necesario.

## La forma linda y manual

Una solución es declarar componentes asociados usando las propiedades de clase de ES7 llamadas ([propiedades de instancia de clases](https://github.com/jeffmo/es-class-fields-and-static-properties)):

```js
class Foo extends Component {
	updateText = e => {
		this.setState({ text: e.target.value });
	};
	render({ }, { text }) {
		return <input value={text} onInput={this.updateText} />;
	}
}
```

Mientras que esto consigue una mucha mejor performance en tiempo de ejecución, conlleva mucho código innecesario para conectar el estado a la UI.

> Otra solución es asociar métodos del componente _declarativamente_, usando ES7 decorators, como el `@bind` de [decko](http://git.io/decko):


## Estado asociado al rescate

Por suerte, existe una solución en la ofrma de módulo  [`linkState`](https://github.com/developit/linkstate) en Preact.

> Las versiones anteriores de Preact tenían la función `linkState ()` incorporada. Sin embargo, fue cambiado a un módulo separado. Si desea restaurar el antiguo comportamiento, busque [esa página](https://github.com/developit/linkstate#usage) para obtener informaciones sobre como usar el polyfill.


Llamar a `.linkState('text')` retorna una función que, cuando se pasa a un Evento, usa su valor asociado para actualizar la propiedad nombrada en el estado del componente. Múltiples llamadas a `linkState(name)` con el mismo nombre son cacheadas, haciendo que escencialmente no haya penalidad de performance.

Este es el ejemplo previo reescrito usando **Estado Asociado**:

```js
class Foo extends Component {
	render({ }, { text }) {
		return <input value={text} onInput={linkState(this, 'text')} />;
	}
}
```

Esto es conciso, fácil de comprender y efectivo. Maneja el estado asociado para cualquier tipo de input. Un tercero argumento `'path'` puede ser usado para proveer explícitamente el camino, separado por puntos, al espacio particular del estado que se quiere cambiar.


## Rutas de eventos personalizadas

Por defecto, `linkState()` intenta devolver el valor apropiado de un evento automáticamente. Por ejemplo, un elemento `<input>` va a setear la propiedad del estado desde `event.target.value` o `event.target.checked` dependiendo del tipo de input. Para handlers de eventos personalizados, pasando valores escalares al handler generado por `linkState()` simplemente va a usar el valor escalar. La mayor parte del tiempo, este es el comportamiento que queremos.

Hay casos donde es indeseable, sin embargo - los eventos personalizados y los radio buttons son dos de esos ejemplos. En estos casos, un tercero argumento puede ser pasado a `linkState()` para especificar la clave de la ruta separada por puntos en el evento donde el valor puede ser encontrado.

Para entender esta característica, puede ser útil adentrarse un poco en `linkState()`. El siguiente ejemplo ilustra un evento creado manualmente que persiste un valor emitido por un Evento en el estado. Es funcionalmente equivalente a la versión de `linkState(), aunque no incluye la optimización de memoization que hace `linkState()` valioso.

```js
// handler retornado por linkState:
handler = linkState(this, 'thing', 'foo.bar');

// ...es funcionalmente equivalente a:
handler = event => {
  this.setState({
    thing: event.foo.bar
  });
}
```


### Ejemplo: Radio Buttons Agrupados

El siguiente código no funciona como se espera. Si el usuario hace click en "no", `noChecked` pasa a ser `true` pero `yesChecked` se mantiene en `true`, ya que `onChange` no es disparado en el otro radio button:

```js
class Foo extends Component {
  render({ }, { yes, no }) {
    return (
      <div>
        <input type="radio" name="demo"
          value="yes" checked={yes}
          onChange={linkState(this, 'yes')}
        />
        <input type="radio" name="demo"
          value="no" checked={no}
          onChange={linkState(this, 'no')}
        />
      </div>
    );
  }
}
```


El tercero argumento de `linkState` ayuda en este caso. Te ayuda a proveer una ruta en el objeto del evento que usa como el valor asociado. Usando el ejemplo previo, digamosle explicitamente a linkState que obtenga el nuevo valor del estado desde la propiedad `value` en `event.target`:

```js
class Foo extends Component {
  render({ }, { answer }) {
    return (
      <div>
        <input type="radio" name="demo"
          value="yes" checked={answer == 'yes'}
          onChange={linkState(this, 'answer', 'target.value')}
        />
        <input type="radio" name="demo"
          value="no" checked={answer == 'no'}
          onChange={linkState(this, 'answer', 'target.value')}
        />
      </div>
    );
  }
}
```

Ahora el ejemplo funciona como queremos!

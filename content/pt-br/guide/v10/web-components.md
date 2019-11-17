---
name: Web Components
description: 'Como utilizar webcomponents com Preact.'
---

# Web Components

Devido à sua natureza leve, o Preact é uma escolha popular para escrever componentes da web. Muitos o usam para criar um sistema de componentes que é agrupado em vários componentes da web. Isso permite reutilizá-los facilmente em outros projetos em que uma estrutura completamente diferente é usada.

Uma coisa a ter em mente é que os Web Components não substituem o Preact, pois não têm os mesmos objetivos.

---

<toc></toc>

---

## Renderização de componentes da Web

Do ponto de vista do Preact, os componentes da web são apenas elementos DOM padrão. Podemos renderizá-los usando o nome da tag registrada:

```jsx
function Foo() {
  return <x-foo />;
}
```

## Acessando métodos de instância

Para poder acessar a instância do seu componente da web personalizado, podemos aproveitar `refs`.

```jsx
function Foo() {
  const myRef = useRef(null);

  useEffect(() => {
    if (myRef.current) {
      myRef.current.doSomething();
    }
  }, []);

  return <x-foo ref={myRef} />;
}
```

## Acionando eventos personalizados

Preact normaliza a caixa de eventos DOM internos padrão, e é assim que podemos passar um objeto `onChange` para `<div> `, quando o ouvinte de evento realmente exige` `change '' em minúsculas. No entanto, os Elementos personalizados geralmente acionam eventos personalizados como parte de sua API pública e não há como saber quais eventos personalizados podem ser disparados. Para garantir que os Elementos Personalizados sejam perfeitamente suportados no Preact, quaisquer objetos do manipulador de eventos não reconhecidos passados para um Elemento DOM terão sua caixa preservada.

```jsx
// evento DOM nativo -> ouve um evento "clique"
<div onClick={() => console.log('click')} />

// Elemento personalizado
// Adicionar manipulador para o evento "IonChange"
<my-foo onIonChange={() => console.log('IonChange')} />
// Adicionar manipulador para o evento "ionChange" (observe a caixa)
<my-foo onionChange={() => console.log('ionChange')} />
```

---
name: Referência da API
permalink: '/guide/api-reference'
---

# Referência da API

## `Preact.Component`

### Métodos do Ciclo de Vida

> _**Dica:** _Caso você já tenha utilizado HTML5 Custom Elements, isso é similar aos métodos de ciclo de vida `attachedCallback` e `detachedCallback`._

Preact invoca os seguintes métodos do ciclo de vida se os mesmos estiverem definidos para um Componente.


| Métodos do Ciclo de Vida    | Quando é chamado                                 							|
|-----------------------------|---------------------------------------------------------------|
| `componentWillMount`        | antes do componente ser montado no DOM 			     							|
| `componentDidMount`         | depois do componente ser montado no DOM    			 							|
| `componentWillUnmount`      | antes da remoção do Componente do DOM 					 							|
| `componentWillReceiveProps` | antes das novas props serem aceitas 						 						 	|
| `shouldComponentUpdate`     | antes de `render()`. Retorne `false` para pular a renderização|
| `componentWillUpdate`       | antes de `render()`                              							|
| `componentDidUpdate`        | depois de `render()`                             							|

---
name: Getting started
permalink: '/cli/getting-started'
description: 'Introducción documentación de preact CLI'
---

# Instalación

Para iniciar con Preact CLI, instalarlo desde [npm](https://npmjs.com/package/preact-cli):

```shell
npm i -g preact-cli
```

Esto instala `preact` como comando de acceso global, que usaremos para configurar un nuevo proyecto.

## Creación de proyectos

### Plantillas

Para comenzar usar una de las plantillas oficiales

- **Default**

Esta plantilla es excelente punto de partida para la mayoría de las aplicaciones. Viene con `preact-router` y un par de rutas de ejemplo y, por defecto, divide el código basado en rutas.

- **Simple**

Una plantilla "básica", a partir de una aplicación "Hello World". Si está buscando elegir sus propias herramientas o ya tiene una configuración en mente, esta es una buena manera de comenzar.

- **Material**

Esta plantilla viene preconfigurada con [preact-material-components] (https://material.preactjs.com) y una pequeña aplicación de ejemplo para comenzar rápida y fácilmente.

- **Netlify CMS**

¿Estás buscando configurar un blog? Esta plantilla ofrece un blog simple y elegante con Preact que se puede editar usando [Netlify CMS](https://www.netlifycms.org/).

Para comenzar con cualquiera de estas plantillas, ejecute `preact create` para crear un nuevo proyecto con la plantilla de elegida:

```sh
preact create <template-name> <app-name>
```

Ahora que el proyecto está creado y configurado, hacer `cd` al directorio creado e iniciar el servidor de desarrollo:

```sh
cd <app-name>
npm start
```

Ahora abra su editor y comience a escribir. Para la mayoría de las plantillas, el mejor lugar para comenzar es `src/index.js` o `src/components/app/index.js`.

## Construcciones de producción

El comando `npm run build` compila la app lista para producción y la coloca en el directorio` build` en la raíz del proyecto.

Las compilaciones de producción se pueden ajustar para satisfacer sus necesidades con una serie de flags. Encuentra la lista completa de flags [aquí](https://github.com/preactjs/preact-cli#preact-build).

**Ejemplo de uso:**

p.ej.

Esto generará el asset json de webpack que se puede usar en un webpack [analyzer](https://chrisbateman.github.io/webpack-visualizer/).

```sh
preact build --json
```

## Edición index.html

Si se desea agregar o editar el marcado generado por `preact-cli` para agregar meta etiquetas, scripts personalizados o fuentes, puede editar `src/template.html`:
Esto es generado por `preact-cli` v3.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title><% preact.title %></title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <% preact.headEnd %>
  </head>
  <body>
    <% preact.bodyEnd %>
  </body>
</html>
```

> **Note:** si se está actualizando desde una versión anterior, puede crear un `src/template.html`, y se usará la próxima vez que construya la aplicación o inicie el servidor de desarrollo.

---
name: Getting started
permalink: '/cli/getting-started'
description: 'Getting started with preact CLI documentation'
---

# Commencer

## Création de projet

### Modèles de templates

Utilisez l'un de nos modèles officiels pour commencer

- **Default**

Ce modèle est un bon point de départ pour la plupart des applications. Il est livré avec `preact-router` , quelques exemples de route et propose par défaut le fractionnement du code basé sur ces routes.

- **Simple**

Un modèle "rudimentaire", à partir d'une application "Hello World". Si vous cherchez à choisir vos propres outils ou si vous avez déjà une configuration en tête, c'est un bon choix pour commencer.

- **Netlify CMS**

Vous cherchez à crééer un blog ? Ne cherchez plus ! Ce modèle vous propose un blog simple et élégant que vous pouvez modifier via [Netlify CMS](https://www.netlifycms.org/).

Pour commencer avec l'un de ces modèles, `npx preact-cli create` pour créer un nouveau projet suivi du nom du modèle de template de votre choix puis du nom de votre projet:

```sh
npx preact-cli create <template-name> <app-name>
```

Maintenant que votre projet est configuré, vous pouvez utiliser la commande `cd` pour accéder au répertoirne nouvellement créé et lancer votre serveur de développement:

```sh
cd <app-name>
npm run dev
```

Ouvrez maintenant votre éditeur et commencez à travailler! Pour la plupart des modèles, le point d'entré de l'application se trouve dans `src/index.js` ou `src/components/app/index.js`.

## Builds de production

La commande `npm run build` compile une version de production dans le répertoire `build` à la racine du projet.

Les builds de production peuvent être paramétrés pour répondre à vos besoins à l'aide d'une série de drapeaux. Retrouvez en la liste complète [ici](https://github.com/preactjs/preact-cli#preact-build).

**Exemple d'utilisation:**

e.g.

Cette commande génèrera l'asset pour webpack au format json qui peut être utilisé par un [analyseur de webpack](https://chrisbateman.github.io/webpack-visualizer/).

```sh
preact build --json
```

## Édition de index.html

Si vous souhaitez apporter des modifications au fichier html généré par `preact-cli` pour ajouter des balises meta, des scripts ou des fonts, vous pouvez modifier le fichier de template situé dans `src/template.html`: 
`preact-cli` v3 génère ce modèle de template en utilisant [EJS](https://ejs.co/).

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

> **Remarque:** Si vous effectuez une mise à jour à partir d'une ancienne version, vous pouvez créer un fichier `src/template.html`, et il sera utilisé à la prochaine compilation de l'application ou lorsque vous démarerez le serveur de développement.

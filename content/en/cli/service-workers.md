---
name: CLI's Service worker
permalink: '/cli/service-workers'
description: 'Preact CLI documentation'
---

# Installation
Getting started with Preact-CLi is just about download preact-cli node module.

```shell
npm i -g preact-cli
```

This installs a global command `preact`, which can be used to create, develop and build preact PWAs henceforth.

## Project creation

### Templates
Use one of our official templates to get started

- **Default**

  This template comes configured with `preact` and `preact-router` to get you started with your app development without any bloat.

- **Simple**

  This tempalte is an open playing groung. With no deps installed, you are free to choose your own tools.

- **Material**

  If you are a material design lover this template comes pre-configured with `preact-material-components` so that you can start using material design without any hassle.

- **Netlify CMS**

  If you're looking for your next blog, look no further. This template has Netlify CMS pre-configured and gives you a simple elegant blog for you.

To get started with these templates just do

```shell
preact create <template-name> <app-name>
```

This will create the folder and install all the dependencies.

```shell
cd <app-name>
npm run dev/build
```

## Production builds
Run `npm run build` to create production build which will reside in `build` directory in the app folder.

Production builds can be fine tuned to match your needs with a series of flags. Find the full linst of flags [here](https://github.com/preactjs/preact-cli#preact-build).

**Usage**

e.g.

This will generate webpack's asset json which can be used in a webpack [analyzer](https://chrisbateman.github.io/webpack-visualizer/).

```shell
preact build --json
```

## Editing index.html
There are use cases where you would like to add something to the markup generated. These can be adding meta tags, adding additional scripts, or adding link tags for fonts.
The projects scaffolded by preact-cli v3 should have a `template.html` in `src` folder.
Also, if you're upgrading from an old version you can create `index.html` in `src` folder and will be picked automatically.

The default markup looks like the following

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

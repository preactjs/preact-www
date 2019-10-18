---
name: CLI
permalink: '/cli/about'
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
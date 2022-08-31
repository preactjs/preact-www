---
name: はじめに
permalink: '/cli/getting-started'
description: 'Preact CLIを始める'
---

# はじめに

最初にPreact CLIを[npm](https://npmjs.com/package/preact-cli)からインストールします。

```shell
npm i -g preact-cli
```

これで`preact`コマンドがグローバルにインストールされます。
これを使用して新しいプロジェクトを作成していきます。

## プロジェクトの作成

### テンプレート

プロジェクトを作成するために以下の公式テンプレートがあります。

- **Default**

ほとんどのアプリケーションには、このテンプレートが適しています。
これには`preact-router`とデフォルトで仮のrouteが付属しています。そして、routeベースのcode-splittingになっています。

- **Simple**

"Hello, World"アプリケーションから始めるような骨組だけのテンプレートです。
自分でツールを選択したい場合や既に構成が決まっている場合はこれで始めると良いでしょう。

- **Material**

このテンプレートには[preact-material-components](https://material.preactjs.com)が付属していて、さらに例として小さいアプリケーションが用意されているので手軽に開発を始めることができます。

- **Netlify CMS**

ブログを始めたいと思っていますか？ここに良いものがあります。
このテンプレートは[Netlify CMS](https://www.netlifycms.org/)を使って編集することができるシンプルでエレガントなブログを提供します。

これらのテンプレートを使うには以下のように`preact create`コマンドでテンプレートを指定して新しいプロジェクトを作成します。

```sh
preact create <template-name> <app-name>
```

これでプロジェクトが作成されました。
以下のように、新たに作成されたディレクトリに`cd`で移動します。そして、開発サーバを起動します。

```sh
cd <app-name>
npm run dev
```

エディタを開いて編集を始めましょう。
ほとんどのテンプレートでは`start/index.js`か`src/components/app/index.js`から編集し始めると良いでしょう。

## Productionビルド

`npm run build`コマンドはアプリケーションをProductionビルドします。そして、それをプロジェクトルートの下の`build`ディレクトリに配置します。

Productionビルドはフラグをセットすることによって必要に応じて微調整することができます。フラグの完全なリストは[こちら](https://github.com/preactjs/preact-cli#preact-build)を見てください。

**使用例**

例えば、以下のコマンドでは[webpack analyzer](https://chrisbateman.github.io/webpack-visualizer/)用のwebpackのアセットのJSONを生成します。

```sh
preact build --json
```

## index.htmlを編集する

`preact-cli`によって生成されるマークアップのメタタグやカスタムスクリプトやフォントを編集したい場合は、`src/template.html`を編集します。
この機能は`preact-cli` v3で利用可能です。レンダリングに[EJS](https://ejs.co/)を使っています。

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

> 古いバージョンからアップグレードした時は`src/template.html`を作成することで次回以降、アプリケーションをビルドした時や開発サーバを起動した時にそれが使われます。

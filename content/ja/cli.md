---
name: CLI
permalink: '/cli'
description: 'Preact CLIの説明'
---

# Preact CLI

[Preact CLI](https://github.com/preactjs/preact-cli/)を使えばたった数秒で超高速のPreact PWAの開発を始めることができます。

Preact CLIは新しいプロジェクトを始める際の手間を省くことができます。そして、理解しやすい小さいプロジェクト構成で即座に開発を進めることができます。
Preact CLIはWebpack、Babel、Terserなど定番のオープンソースのツールで構成されています。そして、それを設定なしで使うことができます。
そして、ホットリロードからクリティカルCSSのインライン化まですべてが最適になるように用意されます。

Preact CLIに沿って開発すればハイパフォーマンスなアプリケーションを開発することができます。
Preact CLIが作成したできたてのプロジェクトのJavaScriptはProductionビルドでわずか4.5kBです。
これは遅い端末と遅いネットワークでさえ3秒以内で操作可能になります。

## 機能

Preact CLIは以下の機能をデフォルトで使うことができます。

- デフォルトで100/100 Lighthouseスコア([証拠](https://googlechrome.github.io/lighthouse/viewer/?gist=142af6838482417af741d966e7804346)).
- 完全自動なrouteごとのcode-splitting(コード分割)
- asyncを付けるだけでcode-splittingします
- JavaScriptの変更を検知しオートリロードする
- Workboxベースのオフラインキャッシュを可能にするService Workerの自動生成
- 効率的なロードを実現するPRPLパターンのサポート
- 設定なしでプリレンダリング/サーバサイドレンダリングで生成されたDOMのhydrationの実行
- Autoprefixerを適用したCSS Modules、LESS、Sass、Stylusのサポート
- bundle/chunkサイズを監視するトラッキング機能
- 自動的なアプリケーションのマウント、デバックヘルパー、Hot Module Replacement
- Preact
- preact-router
- 必要に応じてロードされる1.5kbのfetchとPromiseのpolyfill

詳しく知りたい場合は[はじめに](/cli/getting-started)を読んでください。

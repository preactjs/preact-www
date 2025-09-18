---
title: Первые шаги
description: Как начать работу с Preact. Мы научимся настраивать инструменты (если они нужны) и приступим к написанию приложения
---

# Первые шаги

Новичок в Preact? Новичок в Virtual DOM? Ознакомьтесь с [руководством](/tutorial).

Это руководство поможет вам начать работу и приступить к разработке приложений Preact, используя 3 популярных варианта.
Если вы новичок в Preact, мы рекомендуем начать с [Vite](#create-a-vite-powered-preact-app).

---

<toc></toc>

---

## Вариант без инструментов сборки

Preact упакован для прямого использования в браузере и не требует никаких инструментов сборки:

```html
<script type="module">
	import { h, render } from 'https://esm.sh/preact';

	// Создайте ваше приложение
	const app = h('h1', null, 'Привет, мир!');

	render(app, document.body);
</script>
```

[🔨 Изменить на Glitch](https://glitch.com/~preact-no-build-tools)

Основной недостаток разработки таким способом — отсутствие JSX, которое требует шага сборки. Эргономичная и производительная альтернатива JSX документирована в следующем разделе.

### Альтернативы JSX

Написание необработанных вызовов `h` или `createElement` может быть утомительным. JSX имеет преимущество в том, что он похож на HTML, что, по нашему опыту, облегчает понимание для многих разработчиков. Однако JSX требует этапа сборки, поэтому мы настоятельно рекомендуем альтернативу под названием [HTM][htm].

[HTM][htm] — это синтаксис, похожий на JSX, который работает в стандартном JavaScript. Вместо этапа сборки он использует собственный синтаксис [тегированных шаблонов](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates) JavaScript, добавленный в 2015 году и поддерживаемый [во всех современных браузерах](https://caniuse.com/#feat=template-literals). Это всё более популярный способ написания приложений Preact, поскольку он требует понимания меньшего количества компонентов, чем традиционная настройка инструментов для фронтенд-разработки.

```html
<script type="module">
	import { h, render } from 'https://esm.sh/preact';
	import htm from 'https://esm.sh/htm';

	// Инициализируем htm с Preact
	const html = htm.bind(h);

	function App(props) {
		return html`
			<h1>Hello ${props.name}!</h1>
		`;
	}

	render(
		html`<${App} name="World" />`,
		document.body
	);
</script>
```

[🔨 Изменить на Glitch](https://glitch.com/~preact-with-htm)

> **Совет:** HTM также предоставляет удобную однокомпонентную версию Preact:
>
> `import { html, render } from 'https://esm.sh/htm/preact/standalone'`

Для более масштабируемого решения, см. [Карты импорта -- Базовое использование](/guide/v10/no-build-workflows#basic-usage), а для дополнительной информации о HTM, ознакомьтесь с его [документацией][htm].

[htm]: https://github.com/developit/htm

## Создание приложения Preact на Vite

[Vite](https://vitejs.dev) стал невероятно популярным инструментом для сборки приложений по многим фреймворкам за последние пару лет, и Preact не исключение. Он построен на популярных инструментах вроде ES модулей, Rollup и ESBuild. Vite, через наш инициализатор или их шаблон Preact, не требует никакой конфигурации или предварительных знаний для начала, и эта простота делает его очень популярным способом использования Preact.

Для быстрого начала работы с Vite вы можете использовать наш инициализатор `create-preact`. Это интерактивное приложение командной строки (CLI), которое можно запустить в терминале на вашей машине. Используя его, вы можете создать новое приложение, выполнив команду:

```bash
npm init preact
```

Это проведёт вас через создание нового приложения Preact и даст вам некоторые варианты, такие как TypeScript, маршрутизация (через `preact-iso`) и поддержка ESLint.

> **Совет:** Ни одно из этих решений не должно быть окончательным, вы всегда можете добавить или удалить их из вашего проекта позже, если передумаете.

### Подготовка к разработке

Теперь мы готовы запустить наше приложение. Чтобы запустить сервер разработки, выполните следующую команду внутри вновь сгенерированной папки проекта:

```bash
# Перейдите в сгенерированную папку проекта
cd my-preact-app

# Запустите сервер разработки
npm run dev
```

Как только сервер запустится, он выведет локальный URL разработки для открытия в вашем браузере.
Теперь вы готовы начать писать код вашего приложения!

### Создание продакшен-сборки

Приходит время, когда вам нужно где-то развернуть ваше приложение. Vite поставляется с удобной командой `build`, которая сгенерирует высокооптимизированную продакшен-сборку.

```bash
npm run build
```

По завершении у вас будет новая папка `dist/`, которую можно развернуть напрямую на сервер.

> Для полного списка всех доступных команд и их опций, ознакомьтесь с [Документацией Vite CLI](https://vitejs.dev/guide/cli.html).

## Интеграция в существующий пайплайн

Если у вас уже настроен существующий пайплайн инструментов, очень вероятно, что он включает бандлер. Самые популярные варианты — [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org) или [parcel](https://parceljs.org/). Preact работает из коробки со всеми ними, никаких существенных изменений не требуется!

### Настройка JSX

Для транспиляции JSX вам нужен плагин Babel, который преобразует его в допустимый код JavaScript. Тот, который мы все используем — [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx). После установки вам нужно указать функцию для JSX, которая должна использоваться:

```json
{
	"plugins": [
		[
			"@babel/plugin-transform-react-jsx",
			{
				"pragma": "h",
				"pragmaFrag": "Fragment"
			}
		]
	]
}
```

> [Babel](https://babeljs.io/) имеет одну из лучших документаций. Мы настоятельно рекомендуем ознакомиться с ней для вопросов по Babel и его настройке.

### Алиасинг React на Preact

В какой-то момент вы, вероятно, захотите воспользоваться обширной экосистемой React. Библиотеки и Компоненты, изначально написанные для React, работают без проблем с нашим слоем совместимости. Чтобы воспользоваться им, нам нужно направить все импорты `react` и `react-dom` на Preact. Этот шаг называется _алиасингом._

> **Примечание:** Если вы используете Vite (через `@preact/preset-vite`), Preact CLI или WMR, эти алиасы обрабатываются автоматически по умолчанию.

#### Алиасинг в Webpack

Чтобы создать алиас для любого пакета в Webpack, вам нужно добавить секцию `resolve.alias`
в вашу конфигурацию. В зависимости от конфигурации, которую вы используете, эта секция может
уже присутствовать, но с отсутствующими алиасами для Preact.

```js
const config = {
	// ...сниппет
	resolve: {
		alias: {
			react: 'preact/compat',
			'react-dom/test-utils': 'preact/test-utils',
			'react-dom': 'preact/compat', // Должен быть ниже test-utils
			'react/jsx-runtime': 'preact/jsx-runtime'
		}
	}
};
```

#### Алиасинг в Node

При запуске в Node алиасы бандлера (Webpack, Rollup и т. д.) не будут работать, как
можно увидеть в NextJS. Чтобы исправить это, мы можем использовать алиасы напрямую в нашем `package.json`:

```json
{
	"dependencies": {
		"react": "npm:@preact/compat",
		"react-dom": "npm:@preact/compat"
	}
}
```

#### Алиасинг в Parcel

Parcel использует стандартный файл `package.json` для чтения параметров конфигурации под
ключом `alias`.

```json
{
	"alias": {
		"react": "preact/compat",
		"react-dom/test-utils": "preact/test-utils",
		"react-dom": "preact/compat",
		"react/jsx-runtime": "preact/jsx-runtime"
	}
}
```

#### Алиасинг в Rollup

Для алиасинга в Rollup вам нужно установить [@rollup/plugin-alias](https://github.com/rollup/plugins/tree/master/packages/alias).
Плагин должен быть размещён перед вашим [@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve)

```js
import alias from '@rollup/plugin-alias';

module.exports = {
	plugins: [
		alias({
			entries: [
				{ find: 'react', replacement: 'preact/compat' },
				{ find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
				{ find: 'react-dom', replacement: 'preact/compat' },
				{ find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' }
			]
		})
	]
};
```

#### Алиасинг в Jest

[Jest](https://jestjs.io/) позволяет перезапись путей модулей аналогично бандлерам.
Эти перезаписи настраиваются с использованием регулярных выражений в вашей конфигурации Jest:

```json
{
	"moduleNameMapper": {
		"^react$": "preact/compat",
		"^react-dom/test-utils$": "preact/test-utils",
		"^react-dom$": "preact/compat",
		"^react/jsx-runtime$": "preact/jsx-runtime"
	}
}
```

#### Алиасинг в TypeScript

TypeScript, даже при использовании с бандлером, имеет свой собственный процесс разрешения типов.
Чтобы гарантировать использование типов Preact вместо типов React, вам нужно добавить
следующую конфигурацию в ваш `tsconfig.json` (или `jsconfig.json`):

```json
{
  "compilerOptions": {
    ...
    "skipLibCheck": true,
    "baseUrl": "./",
    "paths": {
      "react": ["./node_modules/preact/compat/"],
      "react/jsx-runtime": ["./node_modules/preact/jsx-runtime"],
      "react-dom": ["./node_modules/preact/compat/"],
      "react-dom/*": ["./node_modules/preact/compat/*"]
    }
  }
}
```

Дополнительно, вы можете захотеть включить `skipLibCheck`, как мы делаем в примере выше. Некоторые
библиотеки React используют типы, которые могут не предоставляться `preact/compat` (хотя мы делаем
всё возможное, чтобы исправить эти), и как таковые, эти библиотеки могли бы быть источником ошибок компиляции TypeScript.
Установив `skipLibCheck`, вы можете сказать TS, что ему не нужно делать полную проверку всех
`.d.ts` файлов (обычно эти ограничены вашими библиотеками в `node_modules`), что исправит эти ошибки.

#### Алиасинг с картами импорта

```html
<script type="importmap">
	{
		"imports": {
			"preact": "https://esm.sh/preact@10.23.1",
			"preact/": "https://esm.sh/preact@10.23.1/",
			"react": "https://esm.sh/preact@10.23.1/compat",
			"react/": "https://esm.sh/preact@10.23.1/compat/",
			"react-dom": "https://esm.sh/preact@10.23.1/compat"
		}
	}
</script>
```

См. также [Карты импорта -- Рецепты и распространённые паттерны](/guide/v10/no-build-workflows#recipes-and-common-patterns) для большего количества примеров.

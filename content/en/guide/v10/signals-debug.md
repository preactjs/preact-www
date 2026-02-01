---
title: Signals Debug
description: A powerful debugging toolkit for Preact Signals that provides detailed console insights into signal updates, effects, and computed values.
---

# Signals Debug

`@preact/signals-debug` is a development tool that helps you understand and debug your signal-based application by providing detailed console output about signal updates, effect executions, and computed value recalculations.

---

<toc></toc>

---

## Installation

```bash
npm install @preact/signals-debug
```

> :bulb: **Important**: Import this package at the root of your application to ensure all signals are tracked from the start.

## Quick Start

Simply import the package at your application's entry point:

```jsx
// index.jsx or main.jsx
import '@preact/signals-debug';
import { signal, computed, effect } from '@preact/signals';

// All signal operations will now be logged to the console
const count = signal(0);
const doubled = computed(() => count.value * 2);

effect(() => {
	console.log('Count is:', count.value);
});

count.value = 5; // This will be logged by the debug package
```

## Features

The debug package provides comprehensive tracking for all signal operations:

- **Value Changes**: Tracks and logs all signal value changes with before/after comparisons
- **Effect Tracking**: Monitors effect executions and their dependencies
- **Computed Values**: Tracks computed value recalculations and their dependencies
- **Update Grouping**: Groups related updates for better visualization in the console
- **Dependency Graph**: Tracks signal dependencies for visualization in DevTools

## Configuration

Use `setDebugOptions()` to configure debugging behavior:

```typescript
import { setDebugOptions } from '@preact/signals-debug';

setDebugOptions({
	// Group related updates in console output (default: true)
	grouped: true,
	
	// Enable/disable debugging entirely (default: true)
	enabled: true,
	
	// Enable/disable console logging (default: true)
	consoleLogging: true,
	
	// Number of spaces for nested update indentation (default: 2)
	// Useful for non-browser environments
	spacing: 2,
});
```

### Disabling Console Output

If you're using the DevTools extension and don't want duplicate console output:

```typescript
import { setDebugOptions } from '@preact/signals-debug';

// Disable console logging, keep DevTools integration
setDebugOptions({
	consoleLogging: false,
});
```

## Signal Naming

For more meaningful debug output, you can name your signals using the `name` option:

```typescript
import { signal, computed } from '@preact/signals';

const count = signal(0, { name: 'count' });
const doubled = computed(() => count.value * 2, { name: 'doubled' });
```

### Automatic Naming with Babel Transforms

For automatic signal naming in development, use the appropriate Babel transform for your framework:

#### Preact

```bash
npm install --save-dev @preact/signals-preact-transform
```

```js
// babel.config.js
module.exports = {
	plugins: [['module:@preact/signals-preact-transform']],
};
```

#### React

```bash
npm install --save-dev @preact/signals-react-transform
```

```js
// babel.config.js
module.exports = {
	plugins: [
		[
			'@preact/signals-react-transform',
			{
				mode: 'auto',
				experimental: {
					// Enable automatic naming for debugging
					debug: true,
				},
			},
		],
	],
};
```

Both transforms automatically add names based on variable names:

```typescript
// Before transform
const count = signal(0);

// After transform (conceptually)
const count = signal(0, { name: 'count' });
```

## DevTools Integration

The debug package exposes a global API (`window.__PREACT_SIGNALS_DEVTOOLS__`) that the [Preact Signals DevTools extension](/guide/v10/signals-devtools-ui) and embedded DevTools UI can use to:

- Receive real-time signal updates
- Track signal disposal events
- Configure debug settings remotely
- Build dependency graphs

For embedded debugging UI, see the [DevTools UI documentation](/guide/v10/signals-devtools-ui).

## Related Packages

- [`@preact/signals`](/guide/v10/signals) - Core signals library for Preact
- [`@preact/signals-devtools-ui`](/guide/v10/signals-devtools) - Visual DevTools UI for debugging signals

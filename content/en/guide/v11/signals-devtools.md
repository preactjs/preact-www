---
title: Signals DevTools
description: Visual DevTools UI for debugging and visualizing Preact Signals in real-time.
---

# Signals DevTools

The Preact Signals DevTools provides a visual interface for debugging signals. You can embed it directly in your page for demos, or integrate it into custom tooling.

---

<toc></toc>

---

## Embedded DevTools

For demos, blog posts, or development overlays, you can embed the DevTools directly in your page.

### Installation

```bash
npm install @preact/signals-devtools-ui @preact/signals-devtools-adapter
```

> :bulb: **Important**: Ensure `@preact/signals-debug` is imported in your application's entry point to register signals with the DevTools.

### Quick Start

```tsx
import '@preact/signals-debug';
import { signal, computed } from '@preact/signals';
import { mount } from '@preact/signals-devtools-ui';
import { createDirectAdapter } from '@preact/signals-devtools-adapter';
import '@preact/signals-devtools-ui/styles';

// Your signals
const count = signal(0, { name: 'count' });
const doubled = computed(() => count.value * 2, { name: 'doubled' });

// Mount the DevTools UI
const adapter = createDirectAdapter();
const unmount = await mount({
	adapter,
	container: document.getElementById('devtools-container')!,
});

// Later, to cleanup:
unmount();
```

## Features

### Updates Tab

Real-time monitoring of signal changes:

- **Real-time Updates**: View signal value changes as they happen
- **Dependency Depth**: See update hierarchy with indented visualization  
- **Value Comparison**: Compare previous and new values side-by-side
- **Statistics**: Monitor update counts and timestamps
- **Type Indicators**: Color-coded indicators for signals, computed values, and effects

### Dependency Graph Tab

Visualize signal relationships:

- **Interactive Graph**: See how signals, computed values, and effects are connected
- **Depth-based Layout**: Nodes positioned by dependency depth
- **Color Coding**:
  - Blue: Signals
  - Orange: Computed values
  - Green: Effects

### Controls

- **Pause/Resume**: Temporarily stop receiving updates
- **Clear**: Reset the update history
- **Filter**: Use regex patterns to show only specific signals
- **Settings**: Configure grouping, rate limiting, and console logging

## Adapters

Adapters handle communication between the DevTools UI and the signals debug system. Choose the right adapter for your use case:

### DirectAdapter

For embedding DevTools in the same page as your signals:

```typescript
import { createDirectAdapter } from '@preact/signals-devtools-adapter';

const adapter = createDirectAdapter({
	targetWindow: window,      // Optional: target window (default: current)
	pollInterval: 100,         // Optional: polling interval in ms
	maxWaitTime: 10000,        // Optional: max wait time in ms
});
```

### PostMessageAdapter

For cross-window/iframe communication:

```typescript
import { createPostMessageAdapter } from '@preact/signals-devtools-adapter';

const adapter = createPostMessageAdapter({
	sourceWindow: window,
	sourceOrigin: 'https://your-app.com',
	targetWindow: window.parent,
	targetOrigin: 'https://your-app.com',
});
```

### BrowserExtensionAdapter

For use within browser extensions:

```typescript
import { createBrowserExtensionAdapter } from '@preact/signals-devtools-adapter';

const adapter = createBrowserExtensionAdapter();
```

## mount() Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `adapter` | `DevToolsAdapter` | Yes | The communication adapter to use |
| `container` | `HTMLElement` | Yes | The DOM element to render into |
| `hideHeader` | `boolean` | No | Hide the header bar |
| `initialTab` | `'updates' \| 'graph'` | No | Which tab to show initially |

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<title>Signals DevTools Demo</title>
	<style>
		.demo-container {
			display: flex;
			gap: 20px;
			max-width: 1400px;
			margin: 0 auto;
		}
		.app-section, .devtools-section {
			flex: 1;
			background: white;
			border-radius: 8px;
			padding: 20px;
		}
		#devtools-container {
			min-height: 400px;
		}
	</style>
	<link rel="stylesheet" href="@preact/signals-devtools-ui/styles.css" />
</head>
<body>
	<div class="demo-container">
		<div class="app-section">
			<h2>Demo App</h2>
			<div id="counter-display">0</div>
			<button id="increment">Increment</button>
		</div>

		<div class="devtools-section">
			<div id="devtools-container"></div>
		</div>
	</div>

	<script type="module">
		// Import debug package first
		import '@preact/signals-debug';
		import { signal, computed, effect } from '@preact/signals';

		// Create signals
		const count = signal(0, { name: 'count' });
		const doubled = computed(() => count.value * 2, { name: 'doubled' });

		// Update display
		effect(() => {
			document.getElementById('counter-display').textContent = count.value;
		});

		// Button handler
		document.getElementById('increment').addEventListener('click', () => {
			count.value++;
		});

		// Mount DevTools
		import { mount } from '@preact/signals-devtools-ui';
		import { createDirectAdapter } from '@preact/signals-devtools-adapter';

		const adapter = createDirectAdapter();
		mount({
			adapter,
			container: document.getElementById('devtools-container'),
		});
	</script>
</body>
</html>
```

## Preact Component

```tsx
import { useEffect, useRef } from 'preact/hooks';
import { mount } from '@preact/signals-devtools-ui';
import { createDirectAdapter } from '@preact/signals-devtools-adapter';
import '@preact/signals-devtools-ui/styles';

export function EmbeddedDevTools() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const adapter = createDirectAdapter();
		let cleanup: (() => void) | null = null;

		mount({
			adapter,
			container: containerRef.current,
			initialTab: 'updates',
		}).then((unmount) => {
			cleanup = unmount;
		});

		return () => {
			if (cleanup) cleanup();
		};
	}, []);

	return (
		<div
			ref={containerRef}
			style={{ minHeight: '400px', background: 'white' }}
		/>
	);
}
```

## Using Individual Components

For custom layouts:

```tsx
import {
	initDevTools,
	Header,
	UpdatesContainer,
	GraphVisualization,
	SettingsPanel,
} from '@preact/signals-devtools-ui';
import { createDirectAdapter } from '@preact/signals-devtools-adapter';
import '@preact/signals-devtools-ui/styles';

const adapter = createDirectAdapter();
await adapter.connect();
initDevTools(adapter);

function MyCustomDevTools() {
	return (
		<div className="my-devtools-layout">
			<Header />
			<div className="my-panels">
				<UpdatesContainer />
				<GraphVisualization />
			</div>
			<SettingsPanel />
		</div>
	);
}
```

## Styling

Import the styles:

```typescript
import '@preact/signals-devtools-ui/styles';
```

Or link the CSS file:

```html
<link rel="stylesheet" href="node_modules/@preact/signals-devtools-ui/dist/styles.css" />
```

## Creating Custom Adapters

Extend `BaseAdapter` for custom communication:

```typescript
import { BaseAdapter, type Settings } from '@preact/signals-devtools-adapter';

class MyCustomAdapter extends BaseAdapter {
	async connect(): Promise<void> {
		// Subscribe to your data source
		myDataSource.onUpdate((updates) => {
			this.emit('signalUpdate', updates);
		});
		
		this.setConnectionStatus({ status: 'connected', message: 'Connected' });
		this.setSignalsAvailable(true);
	}

	disconnect(): void {
		this.setConnectionStatus({ status: 'disconnected', message: 'Disconnected' });
	}

	sendConfig(config: Settings): void {
		// Send config to debug system
	}

	requestState(): void {
		// Request current state
	}
}
```

## Related Packages

- [`@preact/signals-debug`](/guide/v10/signals-debug) - Console debugging for signals
- [`@preact/signals`](/guide/v10/signals) - Core signals library for Preact

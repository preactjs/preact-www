jest.setTimeout(10000);

const URL = 'http://localhost:4444';

async function getCoverageData(customPage = page) {
	const [js, css] = await Promise.all([
		customPage.coverage.stopJSCoverage(),
		customPage.coverage.stopCSSCoverage()
	]);

	function calc(arr) {
		let total = 0;
		let used = 0;
		for (const entry of arr) {
			total += entry.text.length;
			for (const range of entry.ranges) {
				used += range.end - range.start - 1;
			}
		}
		return { total, used };
	}

	return {
		js: calc(js),
		css: calc(css)
	};
}

function click(selector, customPage = page) {
	return customPage.evaluate(selector => {
		document.querySelector(selector).click();
	}, selector);
}

beforeAll(async () => {
	await page.setCacheEnabled(false);
	page._client.send('Network.setBypassServiceWorker', { bypass: true });
});

describe('Homepage', () => {
	it('should display "Preact" text on page', async () => {
		await page.goto(URL);
		await expect(page).toMatch('A different kind of library');
		await expect(page).toMatch('Todo List Component');
	});

	it('should not load extra code', async () => {
		await Promise.all([
			page.coverage.startJSCoverage(),
			page.coverage.startCSSCoverage()
		]);
		await page.goto(URL, {
			waitUntil: 'domcontentloaded'
		});
		await page.waitForFunction('preact != null');
		const { js, css } = await getCoverageData();
		console.log(
			`
			JS shipped:  ${(js.total / 1000).toFixed(1)}kB (${((js.used / js.total) * 100) |
				0}% used by page)
			CSS shipped: ${(css.total / 1000).toFixed(1)}kB (${((css.used / css.total) *
				100) |
				0}% used by page)
		`
				.replace(/^\s*/gm, '')
				.trim()
		);
		expect(js.total).toBeLessThan(150000);
		expect(css.total).toBeLessThan(100000);
		expect(js.used / js.total).toBeGreaterThan(0.4);
		expect(css.used / css.total).toBeGreaterThan(0.4); // note: css coverage looks a bit high here because of critical CSS inlining
	});

	it('should navigate to guide without reloading', async () => {
		await page.goto(URL, {
			waitUntil: 'load'
		});

		await page.waitForSelector('[href="/guide/getting-started"]');

		const spy = jest.fn();
		page.once('domcontentloaded', spy);

		await click('a[href="/guide/getting-started"]');

		await expect(page).toMatch('Import what you need');

		expect(spy).not.toHaveBeenCalled();
	});

	it('should load the REPL', async () => {
		await page.goto(URL + '/repl');
		await page.waitFor('a[href="https://github.com/preactjs/preact-www"]');
		await expect(page).toMatch('preactjs/preact-www');
	});
});

describe('No JS', () => {
	beforeAll(async () => {
		await page.setJavaScriptEnabled(false);
	});

	afterAll(async () => {
		await page.setJavaScriptEnabled(true);
	});

	it('should display "Preact" text on page', async () => {
		await page.goto(URL);
		await expect(page).toMatch('A different kind of library');
		await expect(page).toMatch('Todo List Component');
	});

	it('should navigate to guide', async () => {
		await page.goto(URL, {
			waitUntil: 'load'
		});
		await Promise.all([
			page.waitForNavigation(),
			click('[href="/guide/getting-started"]')
		]);
		expect(await page.url()).toMatch('/guide/getting-started');
		expect(await page.content()).toMatch('Import what you need');
	});
});

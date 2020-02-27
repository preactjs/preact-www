jest.setTimeout(10000);

const URL = 'http://localhost:4444';

/**
 * Filters out external resources and duplicate coverage information
 */
function getUniqueResources(arr) {
	const seen = new Map();
	arr
		.filter(x => x.url.startsWith('http://localhost'))
		.forEach(x => seen.set(x.url, x));
	return Array.from(seen).map(x => x[1]);
}

async function getCoverageData(customPage = page) {
	const [js, css] = await Promise.all([
		customPage.coverage.stopJSCoverage(),
		customPage.coverage.stopCSSCoverage()
	]);

	function calc(arr) {
		let total = 0;
		let used = 0;
		// eslint-disable-next-line no-unused-vars
		for (const entry of arr) {
			total += entry.text.length;
			// eslint-disable-next-line no-unused-vars
			for (const range of entry.ranges) {
				used += range.end - range.start - 1;
			}
		}
		return { total, used };
	}

	return {
		js: calc(getUniqueResources(js)),
		css: calc(getUniqueResources(css))
	};
}

function click(selector, customPage = page) {
	return customPage.evaluate(selector => {
		document.querySelector(selector).click();
	}, selector);
}

describe('Homepage', () => {
	beforeAll(async () => {
		await page.setCacheEnabled(false);
		page._client.send('Network.setBypassServiceWorker', { bypass: true });
	});

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
			waitUntil: 'networkidle0'
		});
		await page.waitForFunction('preact != null');
		const { js, css } = await getCoverageData();
		// eslint-disable-next-line no-console
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

		await page.waitForSelector('[href="/guide/v10/getting-started"]');

		const spy = jest.fn();
		page.once('domcontentloaded', spy);

		await click('a[href="/guide/v10/getting-started"]');

		await expect(page).toMatch('No build tools');

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
			click('[href="/guide/v10/getting-started"]')
		]);
		expect(await page.url()).toMatch('/guide/v10/getting-started');
		expect(await page.content()).toMatch('No build tools');
	});
});

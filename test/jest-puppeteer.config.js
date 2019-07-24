module.exports = {
	launch: {
		headless: process.env.HEADLESS !== 'false',
		devtools: process.env.HEADLESS === 'false'
	},
	server: {
		command: 'PORT=4444 npm run server',
		port: 4444
	}
};

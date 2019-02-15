import { resolve } from 'path'
const CopyPlugin = require('copy-webpack-plugin');

export default function (config, env, helpers) {
  config.resolve.alias.src = resolve(__dirname, 'src')
  config.resolve.alias.components = resolve(__dirname, './src/components')
	config.resolve.alias.style = resolve(__dirname, './src/style')
	config.resolve.alias.lib = resolve(__dirname, './src/lib')
	config.module.rules.map( loader => {
		if ( loader.use && loader.use[0] && loader.use[0]['options'] && loader.use[0]['options']['options'] && loader.use[0]['options']['options']['paths']) {
			delete loader.use[0]['options']['options']['paths']
		}
		return loader
	})
	config.output.globalObject = 'this';
	config.plugins.push(new CopyPlugin([
		{ from: resolve(__dirname, './content'), to: resolve(__dirname, './build/content/') }
	]))
  return config
}

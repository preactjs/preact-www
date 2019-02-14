import { resolve } from 'path'

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
  return config
}

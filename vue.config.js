const {
	defineConfig
} = require('@vue/cli-service')
module.exports = defineConfig({
	transpileDependencies: true,
	lintOnSave: false,
	devServer: {
		host: 'localhost',
		port: 8080,
		open: true,
		proxy: {
			'/api': {
				target: 'http://localhost:8888',
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				}
			},
		}
	}
})
const HtmlWebpackPlugin = require("html-webpack-plugin")
const HtmlWebpackTemplate = require("html-webpack-template")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = (webpackConfig, env) => {
	if (env === "production" && webpackConfig.module) {
		// ClassnameHash
		webpackConfig.module.rules.map((item) => {
			if (item.use && item.use[0] === "style") {
				return item.use.map((iitem) => {
					if (iitem && iitem.loader === "css") {
						iitem.options.localIdentName = "[hash:base64:5]"
					}
					return iitem
				})
			}
			return item
		})
	}

	webpackConfig.plugins = webpackConfig.plugins.concat([
		new CopyWebpackPlugin([
			{
				from: "public",
				to: webpackConfig.output.outputPath
			}
		]),
		new HtmlWebpackPlugin({
			hash: true,
			mobile: true,
			title: "主数据中心",
			inject: false,
			appMountId: "root",
			template: `!!ejs-loader!${HtmlWebpackTemplate}`,
			filename: "index.html",
			minify: {
				collapseWhitespace: true
			},
			scripts: env === "production" ? null : ["/roadhog.dll.js"]
		})
	])

	// Alias
	webpackConfig.resolve.alias = {
		assets: `${__dirname}/src/assets`,
		components: `${__dirname}/src/components`,
		utils: `${__dirname}/src/utils`,
		constants: `${__dirname}/src/constants`,
		services: `${__dirname}/src/services`,
		validators: `${__dirname}/src/validators`,
		models: `${__dirname}/src/models`,
		routes: `${__dirname}/src/routes`,
		themes: `${__dirname}/src/themes`
	}

	return webpackConfig
}

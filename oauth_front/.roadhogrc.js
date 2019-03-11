const path = require("path")

const svgSpriteDirs = [
	require.resolve("antd").replace(/index\.js$/, ""),
	path.resolve(__dirname, "src/svg/")
]

export default {
	svgSpriteLoaderDirs: svgSpriteDirs,
	entry: "src/index.js",
	hash: true,
	proxy: [
		{
			context: ["/api/**"],
			target: "http://localhost:8080/",
			changeOrigin: true,
			pathRewrite: {"^/api": ""}
		}
	],
	extraBabelPlugins: [
		"transform-runtime",
		["import", {libraryName: "antd", style: true}]
	],
	extraBabelPresets: [
		"flow"
	],
	env: {
		development: {
			extraBabelPlugins: [
				"dva-hmr"
			]
		}
	},
	dllPlugin: {
		exclude: ["babel-runtime", "roadhog", "cross-env"]
	},
	theme: "./theme.config.js"
}

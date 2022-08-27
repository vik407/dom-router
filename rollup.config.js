import pkg from "./package.json";
const {terser} = require("rollup-plugin-terser");

export default [
	{
		input: "./src/router.js",
		output: [
			{
				file: `dist/${pkg.name}.cjs.js`,
				format: "cjs",
				exports: "named"
			},
			{
				file: `dist/${pkg.name}.esm.js`,
				format: "es",
				compact: true,
				plugins: [terser()]
			},
			{
				file: `dist/${pkg.name}.js`,
				name: "afm",
				format: "umd",
				compact: true,
				plugins: [terser()]
			}
		]
	}
];

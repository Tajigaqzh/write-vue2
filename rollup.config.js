import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import cleanup from "rollup-plugin-cleanup";
import resolve from "@rollup/plugin-node-resolve";

export default {
	input: "src/index.js",
	output: {
		file: "dist/vue.js",
		name: "Vue", // 指定打包后全局变量的名字global.Vue
		format: "umd",
		// 指定打包后的模块化类型,常见的有esm es6模块,commonjs(node中使用),life(自执行函数),umd(兼容所有)
		sourcemap: true, // 生成sourcemap文件,可以跟踪调试源码
	},
	plugins: [
		babel({
			exclude: "node_modules/**", // 排除node_modules下的文件
		}),
		// terser(), //压缩
		cleanup(), //清除注释
		resolve(),
	],
};

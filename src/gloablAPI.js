import { isFunction } from "./shared/utils";
import { mergeOptions } from "./util";

export function initGlobalAPI(Vue) {
	// 静态方法

	Vue.options = {
		_base: Vue,
	};
	Vue.mixin = function (mixin) {
		// 我们期望将用户的选项和 全局的options进行合并 '
		this.options = mergeOptions(this.options, mixin);
		return this;
	};
	//初始化components
	Vue.options.components = {};
	//可以通过extend进行组件挂载
	Vue.extend = function (options) {
		//根据用户传递的参数，返回一个构造函数
		function Sub(options = {}) {
			// 最终使用一个组件 就是new一个实例
			this._init(options);
			// 就是默认对子类进行初始化操作
		}
		//让sub继承自vue
		Sub.prototype = Object.create(Vue.prototype);
		// 挂载构造方法
		Sub.prototype.constructor = Sub;
		//合并用户传递的选项
		Sub.options = mergeOptions(Vue.options, options);

		return Sub;
	};

	//如果defination是函数的话，保存，是对象的话使用extend创建后保存
	// 全局的指令 Vue.otpions.directives
	Vue.component = function (id, definition) {
		// 如果definition已经是一个函数了 说明用户自己调用了Vue.extend
		definition = typeof isFunction(definition)
			? definition
			: Vue.extend(definition);
		Vue.options.components[id] = definition;
	};
}

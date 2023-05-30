//初始化文件，用于初始化vue实例
import { initState } from "./state";
import { compileToFunction } from "./compiler";
import { mountComponent } from "./lifecycle";
import { mergeOptions } from "./util";

export function initMixins(Vue) {
	Vue.prototype._init = function (options) {
		// vue  vm.$options 就是获取用户的配置
		// 我们使用的 vue的时候 $nextTick $data $attr.....

		const vm = this;
		////把用户的配置挂载到实例上
		// vm.$options = options;

		// 我们定义的全局指令和过滤器.... 都会挂载到实力上
		vm.$options = mergeOptions(this.constructor.options, options); // 将用户的选项挂载到实例上
		//初始化状态
		initState(vm);

		// 如果用户传入了el属性，需要将页面渲染出来
		if (options.el) {
			vm.$mount(options.el);
		}
	};

	Vue.prototype.$mount = function (el) {
		const vm = this;
		el = document.querySelector(el);
		let ops = vm.$options;
		if (!ops.render) {
			//先查找有没有render方法，没有render方法会采用template，template也没有就用el中的内容
			let template;
			if (!ops.template && el) {
				template = el.outerHTML;
			} else {
				if (el) {
					template = ops.template;
				}
			}

			// console.log(template);

			if (template) {
				//需要将template编译成render函数
				//1.需要将template转换成AST语法树 -> 生成render函数 -> 生成虚拟DOM -> 真实DOM
				// console.log(template);
				// console.log(compileToFunction);
				const render = compileToFunction(template);
				ops.render = render; //jsx最终会被编译成h()函数
			}
		}

		//挂载，产生虚拟dom
		mountComponent(vm, el);
		//script标签引用的vue.global.js,这个编译过程是在浏览器中完成的
		//如果是使用webpack打包的vue,这个编译过程是在node中完成的
		//runtime是不包含模板编译的，整个编译是打包的时候通过loader来转义.vue文件的
	};
}

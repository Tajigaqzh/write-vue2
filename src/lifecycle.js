import { createElementVNode, createTextVNode } from "./vdom/index";
import Watcher from "./observer/watcher";
import { patch } from "./vdom/patch";

//扩展生命周期，渲染函数
export function initLifecycle(Vue) {
	Vue.prototype._render = function () {
		// console.log("渲染虚拟dom");
		//通过ast语法转义后生成的render方法
		return this.$options.render.call(this); //_c,_v函数没有定义时调用会报错
	};
	//把VNode转换成真实dom
	Vue.prototype._update = function (vnode) {
		// console.log("虚拟dom", vnode);
		// console.log("变成真实dom");
		const vm = this;
		const el = vm.$el;

		// patch既有初始化的功能  又有更新
		vm.$el = patch(el, vnode);
	};

	Vue.prototype._c = function () {
		return createElementVNode(this, ...arguments);
	};
	Vue.prototype._v = function () {
		return createTextVNode(this, ...arguments);
	};
	Vue.prototype._s = function (value) {
		if (typeof value !== "object") return value;
		return JSON.stringify(value);
	};
}
//组件挂载
export function mountComponent(vm, el) {
	//// 这里的el 是通过querySelector处理过的
	vm.$el = el;
	//1.调用render产生虚拟dom

	const updateComponent = () => {
		vm._update(vm._render()); // vm.$options.render() 虚拟节点
	};
	// vm._update(vm._render());
	// debugger;
	const watcher = new Watcher(vm, updateComponent, true); // true用于标识是一个渲染watcher

	// console.log(watcher);

	//2.根据虚拟dom生成真实dom

	//3.放到真实dom中
}

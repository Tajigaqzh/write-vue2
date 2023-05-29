import { createElementVNode, createTextVNode } from "./vdom/index";
import Watcher from "./observer/watcher";
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

function patch(oldVNode, vnode) {
	// 写的是初渲染流程
	const isRealElement = oldVNode.nodeType;
	if (isRealElement) {
		const elm = oldVNode; // 获取真实元素
		const parentElm = elm.parentNode; // 拿到父元素
		let newElm = createElm(vnode); //新元素
		parentElm.insertBefore(newElm, elm.nextSibling);
		parentElm.removeChild(elm); // 删除老节点

		return newElm; //返回新dom
	} else {
		// diff算法
	}
}
//根据vnode创建真实元素
function createElm(vnode) {
	let { tag, data, children, text } = vnode;
	if (typeof tag === "string") {
		// 标签
		vnode.el = document.createElement(tag);
		// 这里将真实节点和虚拟节点对应起来，后续如果修改属性了
		patchProps(vnode.el, data);
		children.forEach((child) => {
			vnode.el.appendChild(createElm(child));
		});
	} else {
		vnode.el = document.createTextNode(text);
	}
	return vnode.el;
}

/**
 * 更新属性
 */
function patchProps(el, props) {
	for (let key in props) {
		if (key === "style") {
			// style{color:'red'}
			for (let styleName in props.style) {
				el.style[styleName] = props.style[styleName];
			}
		} else {
			el.setAttribute(key, props[key]);
		}
	}
}
//vue核心流程：
//1.创造响应式数据
//2.将模板转换成ast语法树，
//3.将ast语法树转换成render函数
//4.后续每次更新只调用render

//render会产生虚拟节点（使用响应式数据）
//根据生成的虚拟节点生成真实dom

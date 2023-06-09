//给构建虚拟节点提供一些方法

import { isObject, isReservedTag } from "../shared/utils";

//h(),_c()
export function createElementVNode(vm, tag, data, ...children) {
	//demo
	if (data == null) {
		data = {};
	}
	let key = data.key;
	if (key) {
		delete data.key;
	}
	if (isReservedTag(tag)) {
		return vnode(vm, tag, key, data, children);
	} else {
		// 创造一个组件的虚拟节点  (包含组件的构造函数)
		let Ctor = vm.$options.components[tag]; // 组件的构造函数
		// Ctor就是组件的定义 可能是一个Sub类 还有可能是组件的obj选项
		// console.log(Ctor);
		return createComponentVnode(vm, tag, key, data, children, Ctor);
	}
	// return vnode(vm, tag, key, data, children);
}

//_v()
export function createTextVNode(vm, text) {
	return vnode(vm, undefined, undefined, undefined, undefined, text);
}

// vnode和ast一样吗？
//ast做的是语法层面的转化 他描述的是语法本身 (可以描述js css html)
// 我们的虚拟dom 是描述的dom元素，可以增加一些自定义属性  (描述dom的)
function vnode(vm, tag, key, data, children, text, componentOptions) {
	return {
		vm,
		tag,
		key,
		data,
		children,
		text,
		// ....
		componentOptions,
	};
}
export function isSameVnode(vnode1, vnode2) {
	return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key;
}
/**
 * 根据组件创建Vnode
 * @param {Vue} vm
 * @param {string} tag html标签
 * @param {*} key key
 * @param {*} data 数据
 * @param {*} children 子节点
 * @param {*} Ctor
 * @returns
 */
function createComponentVnode(vm, tag, key, data, children, Ctor) {
	if (isObject(Ctor)) {
		Ctor = vm.$options._base.extend(Ctor);
	}
	// console.log("hook", vnode);
	debugger;
	data.hook = {
		init(vnode) {
			// 稍后创造真实节点的时候 如果是组件则调用此init方法
			// 保存组件的实例到虚拟节点上

			instance.$mount(); // instance.$el

			console.log(instance);
		},
	};
	return vnode(vm, tag, key, data, children, null, { Ctor });
}

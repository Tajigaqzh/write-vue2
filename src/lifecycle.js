import { createElementVNode, createTextVNode } from "./vdom/index";
import Watcher from "./observer/watcher";
import { patch } from "./vdom/patch";

//扩展生命周期，渲染函数
export function initLifecycle(Vue) {
  Vue.prototype._render = function () {
    //通过ast语法转义后生成的render方法

    // debugger;
    return this.$options.render.call(this); //_c,_v函数没有定义时调用会报错
  };
  //把VNode转换成真实dom
  Vue.prototype._update = function (vnode) {
    const vm = this;
    const el = vm.$el;
    const prevVnode = vm._vnode;

    vm._vnode = vnode; // 把组件第一次产生的虚拟节点保存到_vnode上
    if (prevVnode) {
      // 之前渲染过了
      vm.$el = patch(prevVnode, vnode);
    } else {
      vm.$el = patch(el, vnode);
    }
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

  //2.根据虚拟dom生成真实dom

  //3.放到真实dom中
}

// vue核心流程 1） 创造了响应式数据  2） 模板转换成ast语法树
// 3) 将ast语法树转换了render函数 4) 后续每次数据更新可以只执行render函数 (无需再次执行ast转化的过程)
// render函数会去产生虚拟节点（使用响应式数据）
// 根据生成的虚拟节点创造真实的DOM

export function callHook(vm, hook) {
  // 调用钩子函数

  const handlers = vm.$options[hook];

  if (handlers) {
    handlers.forEach((handler) => handler.call(vm));
  }
}

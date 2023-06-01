import { observe } from "./observer";
import { isFunction } from "./shared/utils";
import { initComputed } from "./computed/index";
import Watcher, { nextTick } from "./observer/watcher";
import { initWatch } from "./watch/index";

export function initStateMixin(Vue) {
  Vue.prototype.$nextTick = nextTick;
  // 最终调用的都是这个方法
  Vue.prototype.$watch = function (exprOrFn, cb) {
    // firstname
    // ()=>vm.firstname

    // firstname的值变化了 直接执行cb函数即可
    new Watcher(this, exprOrFn, { user: true }, cb);
  };
}

//初始化状态,this是undefined
export function initState(vm) {
  const options = vm.$options;
  if (options.data) {
    initData(vm);
  } else {
    const ob = observe((vm._data = {}));
    ob && ob.vmCount++;
  }

  if (options.computed) {
    initComputed(vm);
  }
  if (options.watch) {
    initWatch(vm);
  }
}

//初始化data，this是undefined
function initData(vm) {
  let data = vm.$options.data;
  //data可能是函数，也可能是对象
  data = isFunction(data) ? data.call(vm) : data;
  vm._data = data; //data是用户返回的对象

  /* const keys = Object.keys(data);
	let i = keys.length;
	while (i--) {
		const key = keys[i];
		if (isReserved(key)) {
			proxy(vm, "_data", key);
		}
	} */
  //数据劫持
  const ob = observe(data);
  ob && ob.vmCount++;

  //将data代理到vm上
  for (let key in data) {
    proxy(vm, "_data", key);
  }
}
/**
 * 将_data上的属性代理到vm上
 * @param {*} vm
 * @param {*} target
 * @param {*} key
 */
function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key];
    },
    set(newValue) {
      vm[target][key] = newValue;
    },
  });
}

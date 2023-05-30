<<<<<<< HEAD
import { isArray } from "../shared/utils";
export function initWatch(vm) {
	let watch = vm.$options.watch;
	for (let key in watch) {
		const handler = watch[key]; // 字符串 数组 函数
		if (isArray(handler)) {
			for (let i = 0; i < handler.length; i++) {
				createWatcher(vm, key, handler[i]);
			}
		} else {
			createWatcher(vm, key, handler);
		}
	}
}
function createWatcher(vm, key, handler) {
	// 字符串  函数
	if (typeof handler === "string") {
		handler = vm[handler];
	}
	return vm.$watch(key, handler);
}
=======
import Watcher from "../observer/watcher";
import { isString } from "../shared/utils";

export function watch(exprOrFunction, handler, options = {}) {
  //不考虑deep，immediate
  //exprOrFunction可能是firstname字符串，或者回调函数

  //$watch的核心就是创建了一个watcher
  const watcher = new Watcher(this, exprOrFunction, { user: true }, cb);
}

export function createWatcher(vm, exprOrFunction, handler) {
  if (isString(handler)) {
    handler = vm[handler];
  }
  return vm.$watch(exprOrFunction, handler);
}
>>>>>>> 7e14f782b9efce87c898fbfc5e21daab5a7a3e7f

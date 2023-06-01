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

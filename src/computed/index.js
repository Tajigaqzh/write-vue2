import { isFunction } from "../shared/utils";
import Dep from "../observer/dep";
import Watcher from "../observer/watcher";
export function initComputed(vm) {
	const computed = vm.$options.computed;
	const watchers = (vm._computedWatchers = {}); // 将计算属性watcher保存到vm上
	for (let key in computed) {
		let useDef = computed[key];
		let fn = isFunction(useDef) ? useDef : useDef.get;
		//如果直接使用watcher会立即执行，可以传递一个lazy参数
		watchers[key] = new Watcher(vm, fn, { lazy: true });
		// 我们需要监控 计算属性中get的变化
		// 如果直接new Watcher 默认就会执行fn, 将属性和watcher对应起来
		// console.log(useDef);
		defineComputed(vm, key, useDef);
	}
}
function defineComputed(target, key, useDef) {
	// const getter = isFunction(useDef) ? useDef : useDef.get;
	// console.log("get", getter);

	const setter = useDef.set || (() => {});
	// console.log(setter);
	//利用defineProperty监听，这样也实现了computed，但是没有缓存，会被反复执行，可以创建watcher
	// 可以通过实例拿到对应的属性
	Object.defineProperty(target, key, {
		get: createComputedGetter(key),
		set: setter,
	});
}
// 计算属性根本不会收集依赖 ，只会让自己的依赖属性去收集依赖
function createComputedGetter(key) {
	//要检测是否执行该getter
	return function () {
		//这时需要拿到watcher判断lazy属性，但是无法直接拿，因为this是vm,可以把所有的计算属性保存到vm上
		const watcher = this._computedWatchers[key]; //通过vm获取到对应属性的watcher

		// console.log(w);
		if (watcher.dirty) {
			//如果是脏的，就执行用户的get
			watcher.evaluate(); // 求值后 dirty变为了false ,下次就不求值了
		}
		if (Dep.target) {
			// 计算属性出栈后 还要渲染watcher， 我应该让计算属性watcher里面的属性 也去收集上一层watcher
			watcher.depend();
		}
		return watcher.value; // 最后返回的是watcher上的值
	};
}

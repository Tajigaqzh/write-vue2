import Dep, { popTarget, pushTarget } from "./dep";
//当我们创建渲染watcher的时候我们会把当前的渲染watcher放到dep.targetget上
//调用_render()会取值，走到get方法
let id = 0;
//观察者模式
//每个属性都有一个dep（属性是被观察者），watcher就是观察者（属性变化了会通知观察者更新）
class Watcher {
	//不同组件有不同的watcher
	constructor(vm, exprOrFn, options, cb) {
		this.id = id++;
		this.renderWatcher = options; // 是一个渲染watcher

		if (typeof exprOrFn === "string") {
			this.getter = function () {
				return vm[exprOrFn];
			};
		} else {
			this.getter = exprOrFn; // getter意味着调用这个函数可以发生取值操作
		}

		this.depsId = new Set();

		this.deps = []; //watcher记录dep，后续实现计算属性和一些清理工作需要使用
		this.cb = cb;
		this.lazy = options.lazy;
		this.dirty = this.lazy; //缓存
		// this.lazy ? undefined : this.get();
		// this.get();
		this.vm = vm;
		this.user = options.user; // 标识是否是用户自己的watcher

		this.value = this.lazy ? undefined : this.get(); //第一次的时候lazy为undefined，不会取值
	}
	get() {
		pushTarget(this);
		// Dep.target = this; ///添加一个静态属性,把当前watcher暴露到全局上，放到dep上
		let value = this.getter.call(this.vm); //会去vm上取值  vm._update(vm._render) 取name 和age
		// Dep.target = null; //渲染后清空
		popTarget();
		return value;
	}
	//一个组件对应多个属性重复的属性也不用记录，可以利用Set去重
	addDep(dep) {
		let id = dep.id;
		if (!this.depsId.has(id)) {
			//watcher记住dep以及depId
			this.deps.push(dep);
			this.depsId.add(id);
			//dep记住watcher
			dep.addSub(this);
			// watcher已经记住了dep了而且去重了，此时让dep也记住watcher
		}
	}
	evaluate() {
		this.value = this.get(); // 获取到用户函数的返回值 并且还要标识为脏
		//通过调用get把计算属性也放入队列中
		//该队列中的内容：渲染watcher、computed的watcher
		this.dirty = false;
	}
	// watcher的depend 就是让watcher中dep去depend
	depend() {
		let i = this.deps.length;

		while (i--) {
			this.deps[i].depend(); // 让计算属性watcher 也收集渲染watcher
		}
	}

	update() {
		// this.get(); //更新，重新渲染
		// console.log("update 被执行了");
		//把多次操作，一次执行
		if (this.lazy) {
			// 如果是计算属性  依赖的值变化了 就标识计算属性是脏值了
			this.dirty = true;
		} else {
			queueWatcher(this); // 把当前的watcher 暂存起来
			// this.get(); // 重新渲染
		}
	}
	run() {
		//watch
		let oldValue = this.value;
		let newValue = this.get(); // 渲染的时候用的是最新的vm来渲染的
		if (this.user) {
			this.cb.call(this.vm, newValue, oldValue);
		}
	}
}

let queue = [];
let has = {};
let pending = false; // 防抖
//利用对象去重，也可以使用set
/**
 * 观察器队列
 * @param {*} watcher
 */
function queueWatcher(watcher) {
	//去重
	const id = watcher.id;

	if (!has[id]) {
		queue.push(watcher);
		has[id] = true;
		//不管update执行多少次，最终只会执行一次刷新操作

		if (!pending) {
			nextTick(flushSchedulerQueue, 0);
			//这样直接调还有问题，就是如果用户使用的Promise的话还是不行，
			//解决办法，无论用户使用的是setTimeout，还是Promise我们统一使用nextTick包裹

			pending = true;
		}
	}
}
let callbacks = [];
let waiting = false;
/**
 * nextTick
 */
export function nextTick(cb) {
	callbacks.push(cb); //放进去的时候是同步
	if (!waiting) {
		//真实的vue代码中并没有直接采用setTimeout方法来实现，而是采用优雅降级的方式
		//vue代码中内部先采用Promise（IE不兼容），然后使用HTML5的APIMutationObserver，如果还不兼容，
		//使用IE专享的setImmediate，再降级使用setTimeout
		/* setTimeout(() => {
			//刷新是异步
			timerFunction(flushCallbacks);
		}, 0); */
		timerFunc();
		// Promise.resolve().then(flushCallbacks)
		waiting = true;
	}
}

let timerFunc;
if (Promise) {
	timerFunc = () => {
		Promise.resolve().then(flushCallbacks);
	};
} else if (MutationObserver) {
	let observer = new MutationObserver(flushCallbacks);
	// 这里传入的回调是异步执行的
	let textNode = document.createTextNode(1);
	observer.observe(textNode, {
		characterData: true,
	});
	timerFunc = () => {
		textNode.textContent = 2;
	};
} else if (setImmediate) {
	timerFunc = () => {
		setImmediate(flushCallbacks);
	};
} else {
	timerFunc = () => {
		setTimeout(flushCallbacks);
	};
}

function flushCallbacks() {
	let cbs = callbacks.slice(0);
	waiting = false;
	callbacks = [];
	cbs.forEach((cb) => cb());
}
/**
 *批量指定队列中的渲染
 */
function flushSchedulerQueue() {
	let flushQueue = queue.slice(0); //在刷新的过程中，有可能会有新的放到队列，所以拷贝一份

	queue = [];
	has = {};
	pending = false;
	flushQueue.forEach((q) => q.run());
}

//需要给每个属性增加一个dep，目的就是收集watcher

//一个组件中，有多少个属性（n个属性会对应一个视图），n个dep对应一个watcher
//一个属性对应多个视图（组件），一个dep对应多个watcher
//多对多关系

export default Watcher;

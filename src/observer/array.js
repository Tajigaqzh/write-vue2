//重写数组中的部分方法
let oldArrayProtoMethods = Array.prototype; //获取数组原型上的方法
export let newArrayProtoMethods = Object.create(oldArrayProtoMethods); //传的参数是旧的原型

let methods = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"];

// newArrayProtoMethods.push = function (value) {};
methods.forEach((method) => {
	//重写原有的方法
	newArrayProtoMethods[method] = function (...args) {
		//this就是调用的数组arr,谁调用的push方法，this就是谁
		const result = oldArrayProtoMethods[method].call(this, ...args); //内部还是调用原有的方法
		//如果新增的元素是对象，还要对对象进行劫持
		let inserted;
		let ob = this.__ob__;
		switch (method) {
			case "push":
			case "unshift":
				inserted = args;
				break;
			case "splice": //splice(0,1,xxx)
				inserted = args.slice(2);
				break;

			default:
				break;
		}
		// console.log("inserted", inserted);

		if (inserted) {
			//如果新增的元素是对象，还要对对象进行劫持
			ob.observeArray(inserted);
		}
		//数组变化啦通知对应的watche
		// debugger;
		ob.dep.notify();
		console.log("更新啦", ob);

		return result;
	};
});

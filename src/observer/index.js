//数据劫持
import { newArrayProtoMethods } from "./array";
import { hasOwn, isArray } from "../shared/utils";
import Dep from "./dep";

/**
 * 用于观测的类
 */

class Observer {
	constructor(data) {
		//给每个对象都做依赖收集
		this.dep = new Dep();
		//Object.defineProperty()只能对对象原有的属性进行劫持，如果新增的或者删除的，他并不能监控到
		//vue2为此专门写了一些API比如$set,$delete，而vue3中使用了Proxy，proxy可以监控到对象（数组）的所有属性

		// Object.defineProperty只能劫持已经存在的属性 （vue里面会为此单独写一些api  $set $delete）
		Object.defineProperty(data, "__ob__", {
			value: this,
			enumerable: false, // 将__ob__ 变成不可枚举 （循环的时候无法获取到）
		});
		// data.__ob__ = this;//直接这样搞会死循环，因为observe中会判断是否已经被劫持了

		if (isArray(data)) {
			//如果是数组，要重写数组的方法,7个变异方法
			//如果数组中的元素是对象，还要对对象进行劫持
			data.__proto__ = newArrayProtoMethods;
			this.observeArray(data);
		} else {
			this.walk(data);
		}
	}
	/**
	 * 遍历对象的所有属性，对其进行劫持，重新定义属性，性能差
	 */
	walk(data) {
		//判断是否是对象
		Object.keys(data).forEach((key) => {
			//对每个属性进行劫持，重新定义属性
			defineReactive(data, key, data[key]);
		});
	}
	/**
	 * 数组对象监视器,监视数组中的对象
	 * @param {*} data
	 */
	observeArray(data) {
		//如果数组中的元素是对象，还要对对象进行劫持
		data.forEach((item) => observe(item));
	}
}
/**
 * 劫持对象的属性
 * 缺点：
 * 1.defineProperty只能对对象原有的属性进行劫持，如果新增的或者删除的，他并不能监控到
 * 2.性能差，需要一上来就递归，把所有的属性都进行劫持，如果属性值是对象，还要继续递归
 * 3.不能对数组进行劫持，不是不能劫持，而是劫持数组会给每一个元素添加get和set，
 * 性能太差，并且用户修改数组一般也不是通过arr[index]来修改的，
 * 都是通过push、shift等方法来修改的，所以vue重写了这些方法
 * 4.只能对属性进行劫持，不能对整个对象进行劫持
 * @param {*} data
 * @param {*} key
 * @param {*} value
 */
export function defineReactive(data, key, value) {
	//value放到闭包中，不会被销毁
	//深层劫持，如果value是对象，也要进行劫持
	let childOb = observe(value); //childOb.dep 用来收集依赖的

	let dep = new Dep(); //每一个属性都有dep
	//实现劫持
	Object.defineProperty(data, key, {
		get() {
			//收集依赖

			// console.log("get被调用了");
			// console.log("dt", Dep.target);
			if (Dep.target) {
				//记住这个属性的watcher
				dep.depend();

				if (childOb) {
					//依赖收集
					childOb.dep.depend(); //让数组和对象本身也实现依赖收集
					if (isArray(value)) {
						dependArray(value);
					}
				}
			}
			return value;
		},
		set(newValue) {
			//触发依赖更新
			//如果新值和旧值一样，直接返回
			if (newValue === value) return;
			//如果设置的值是对象，也要进行劫持
			observe(newValue);
			//重新赋值
			value = newValue;
			dep.notify(); //通知更新
		},
	});
}
/**
 *
 * @param {*} data 监视器
 * @returns Observer实例
 */
export function observe(data) {
	// debugger;
	//只对对象进行劫持
	if (typeof data !== "object" || data == null) {
		return;
	}
	//如果不是对象，就不需要监视了
	if (data.__ob__ instanceof Observer) {
		return data.__ob__;
	}

	//如果一个对象被劫持过了，那就不需要再被劫持了
	//（要判断一个对象是否被劫持，可以增加一个实例，用实例来判断是否被劫持过）
	return new Observer(data);
}
// 深层次嵌套会递归，递归多了性能差，不存在的属性监控不到，存在的属性要重写方法  vue3-> proxy
function dependArray(value) {
	for (let i = 0; i < value.length; i++) {
		let current = value[i];
		current.__ob__ && current.__ob__.dep.depend();
		if (Array.isArray(current)) {
			dependArray(current);
		}
	}
}

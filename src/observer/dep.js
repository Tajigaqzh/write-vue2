let id = 0;
class Dep {
	constructor() {
		this.id = id++; //属性的dep收集watcher
		this.subs = []; //存放着当前属性对应的watchher
	}

	depend() {
		//这里不希望放重复的内容，而且只是一个单向的关系dep->watcher
		//让watcher记录dep，比如组件卸载，
		//在这里记录watcher会重复
		// this.subs.push(Dep.target);
		// console.log("添加后：", this.subs);

		Dep.target.addDep(this); // 让watcher记住dep
	}
	//dep记住watcher的方法
	addSub(watcher) {
		this.subs.push(watcher);
	}

	notify() {
		console.log("notify被调用了");
		this.subs.forEach((watcher) => {
			watcher.update(); //告诉watcher要更新了
		});
	}
}
Dep.target = null;
//用于存放watcher
let stack = [];
export function pushTarget(watcher) {
	stack.push(watcher);
	Dep.target = watcher;
}
export function popTarget() {
	stack.pop();
	Dep.target = stack[stack.length - 1];
}
export default Dep;

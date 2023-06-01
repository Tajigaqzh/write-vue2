import { initMixins } from "./init";
import { initLifecycle } from "./lifecycle";
import { initStateMixin } from "./state";
import { initGlobalAPI } from "./gloablAPI";
function Vue(options) {
	this._init(options); //默认调用了init
}

initMixins(Vue); //扩展了init方法
initLifecycle(Vue);
initStateMixin(Vue); // 实现了nextTick $watch
initGlobalAPI(Vue);

// -------------------------------观察前后的虚拟节点

/* let render1 = compileToFunction(`<li key='a' style="color:blue">{{name}}</li>`);

let vm1 = new Vue({ data: { name: "zs" } });
let prevNode = render1.call(vm1);
let el = createElm(prevNode);
document.body.appendChild(el);

let render2 = compileToFunction(`<li key='a' style="color:blue"></li>`);

let vm2 = new Vue({ data: { name: "zs" } });
let nextNode = render2.call(vm2);

setTimeout(() => {
	patch(prevNode, nextNode);
}, 1000); */

export default Vue;

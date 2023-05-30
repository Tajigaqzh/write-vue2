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

export default Vue;

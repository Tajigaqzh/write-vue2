import { initMixins } from "./init";
import { initLifecycle } from "./lifecycle";
<<<<<<< HEAD
import { initStateMixin } from "./state";

import { initGlobalAPI } from "./initGlobal";
=======
import { nextTick } from "./observer/watcher";
import { watch } from "./watch";
>>>>>>> 7e14f782b9efce87c898fbfc5e21daab5a7a3e7f
function Vue(options) {
  this._init(options); //默认调用了init
}
<<<<<<< HEAD
=======
Vue.prototype.$watch = watch;
Vue.prototype.$nextTick = nextTick;
>>>>>>> 7e14f782b9efce87c898fbfc5e21daab5a7a3e7f
initMixins(Vue); //扩展了init方法
initLifecycle(Vue);
initStateMixin(Vue); // 实现了nextTick $watch
initGlobalAPI(Vue);

export default Vue;

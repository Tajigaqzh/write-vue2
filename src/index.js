import { initMixins } from "./init";
import { initLifecycle } from "./lifecycle";
import { nextTick } from "./observer/watcher";
import { watch } from "./watch";
function Vue(options) {
  this._init(options); //默认调用了init
}
Vue.prototype.$watch = watch;
Vue.prototype.$nextTick = nextTick;
initMixins(Vue); //扩展了init方法
initLifecycle(Vue);
export default Vue;

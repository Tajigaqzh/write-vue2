import Watcher from "../observer/watcher";
import { isString } from "../shared/utils";

export function watch(exprOrFunction, handler, options = {}) {
  //不考虑deep，immediate
  //exprOrFunction可能是firstname字符串，或者回调函数

  //$watch的核心就是创建了一个watcher
  const watcher = new Watcher(this, exprOrFunction, { user: true }, cb);
}

export function createWatcher(vm, exprOrFunction, handler) {
  if (isString(handler)) {
    handler = vm[handler];
  }
  return vm.$watch(exprOrFunction, handler);
}

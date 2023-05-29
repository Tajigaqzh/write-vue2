/**
 * 是否有自己的属性
 */
export function hasOwn(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}
/**
 * 判断是否是函数
 * @param {*} val
 * @returns
 */
export function isFunction(val) {
	return typeof val === "function";
}
/**
 * 判断是否是Array
 */
export const isArray = Array.isArray;

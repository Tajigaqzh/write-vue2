# 手写vue源码

## rollup搭建

略

为什么vue2不支持IE9以下版本，因为Object.defineProperty不支持IE9以下版本

proxy是es6的语法，IE不支持

## vue

vue并没有采用类的形式，而是采用了函数的形式，这样做的好处是，不用new，直接调用函数即可
采用class，耦合性高，不利于扩展,
采用函数的好处：
可以把不同的功能放到不同的文件中，放到不同的函数中，便于管理

另一方面使用函数，可以在不破坏原有代码的情况下，对函数进行增强（高阶函数）

```js
vue.prototype.XXX
class Vue{
    XXX

}
```

```js
function Vue(options) {
    this._init(options)
}
```

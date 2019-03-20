---

## uxcore-select-form-field [![Dependency Status](http://img.shields.io/david/uxcore/uxcore-select-form-field.svg?style=flat-square)](https://david-dm.org/uxcore/uxcore-select-form-field) [![devDependency Status](http://img.shields.io/david/dev/uxcore/uxcore-select-form-field.svg?style=flat-square)](https://david-dm.org/uxcore/uxcore-select-form-field#info=devDependencies) 

## TL;DR

uxcore-select-form-field ui component for react

#### setup develop environment

```sh
$ git clone https://github.com/uxcore/uxcore-select-form-field
$ cd uxcore-select-form-field
$ npm install
$ npm run start
```

## Usage

## demo
http://uxcore.coding.me/

## API

## Props

| 配置项 | 类型 | 必填 | 默认值 | 功能/备注 |
|---|---|---|---|---|
| renderView | func | N | undefined | 自定义 VIEW 模式下的 value 渲染，回调时会回传当前已选中的项目，值全部是 [{ value, text }] 格式 |
| loadingView | string/jsx | N | undefined | 自定义异步加载的 loading 视图，默认为 kuma-loading-s 样式，不建议自定义 |
| valueStrictMode | bool | N | false | value 的数据类型是否严格匹配，在 0.4.16 版本之前 Option 的 value 始终会转成字符串，会导致表单值传入 Number 时无法匹配到 Option，打开这个属性之后不会做格式转换 |

备注：valueStrictMode 是为了保证业务向下兼容的无奈之举，实际上 value 类型本来就应该是匹配的，但是之前 rc-select 层是通过 key 这个特殊的 prop 来传递 Option 的 value 的，key 始终会被 React 转为字符串，导致 Number 类型的 value 匹配出问题。rc-select 在后续版本增加了 value 属性的传递解决了这个问题，但是为了避免业务中已经使用了 `Form.field.value === '2'` 且 `Option.value === 2` 的时候匹配出现兼容问题，因此加了这样一个开关，因此建议新业务这个开关始终打开。

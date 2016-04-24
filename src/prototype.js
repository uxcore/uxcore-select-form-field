
const React = require('react');
const {Bundle} = require('engine');
const {BoolSetter, TextSetter, ChoiceSetter, JsonSetter, NumberSetter} = require('engine-utils');

module.exports = Bundle.createPrototype({
    title: "选择",
    category: "表单",
    icon: require("./logo.svg"), // todo: require("./logo.svg"),
    componentName: "SelectFormField",
    canHovering: true,
    canSelecting: true,
    canDraging: true,
    isInline: true,
    isContainer: false,
    canDropto: true,
    conDroping: false,
    configure: [{
            name: "style",
            title: "样式",
            defaultValue: {},
            required: false,
            fieldStyle: "accordion",
            fieldCollapsed: false,
            setter: <JsonSetter />
        }, {
            name: "placeholder",
            title: "占位符",
            defaultValue: "",
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <TextSetter multiline={true} rows={2} />
        }, {
            name: "searchPlaceholder",
            title: "搜索框占位符",
            defaultValue: "",
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <TextSetter multiline={true} rows={2} />
        }, {
            name: "combobox",
            title: "combo 模式",
            defaultValue: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <BoolSetter />
        }, {
            name: "jsxdata",
            title: "数据源",
            defaultValue: {},
            required: false,
            fieldStyle: "accordion",
            fieldCollapsed: false,
            setter: <JsonSetter />
        }, {
            name: "showSearch",
            title: "显示搜索框",
            defaultValue: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <BoolSetter />
        }, {
            name: "tags",
            title: "tag 模式",
            defaultValue: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <BoolSetter />
        }, {
            name: "multiple",
            title: "是否多选",
            defaultValue: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <BoolSetter />
        }, {
            name: "allowClear",
            title: "是否显示清空按钮",
            defaultValue: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <BoolSetter />
        }, {
            name: "dataType",
            title: "请求的类型",
            defaultValue: 'json',
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <TextSetter multiline={true} rows={2} />
        }, {
            name: "instantValidate",
            title: "即时校验",
            defaultValue: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <BoolSetter />
        }, {
            name: "jsxshow",
            title: "是否显示",
            defaultValue: true,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <BoolSetter />
        }, {
            name: "jsxmode",
            title: "模式",
            defaultValue: "",
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <TextSetter multiline={true} rows={2} />
        }, {
            name: "jsxshowLabel",
            title: "是否显示标签",
            defaultValue: true,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <BoolSetter />
        }, {
            name: "jsxflex",
            title: "弹性比例(flex)",
            defaultValue: 1,
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <NumberSetter />
        }, {
            name: "jsxname",
            title: "表单域name",
            defaultValue: "",
            required: true,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <TextSetter multiline={true} rows={2} />
        }, {
            name: "jsxlabel",
            title: "标签名",
            defaultValue: "",
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <TextSetter multiline={true} rows={2} />
        }, {
            name: "jsxtips",
            title: "提示文案",
            defaultValue: "",
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <TextSetter multiline={true} rows={2} />
        }]
});

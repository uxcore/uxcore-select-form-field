
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
    canDropto: function(container) {
        let name = container.getComponentName();
        return /FormRow|Form/.test(name);
    },
    canDroping: false,
    configure: [{
            name: "jsxlabel",
            title: "标签名",
            defaultValue: "表单一",
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <TextSetter multiline={true} rows={2} />
        }, {
            name: "jsxname",
            title: "表单域name",
            defaultValue: "select1",
            required: true,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <TextSetter multiline={true} rows={2} />
        }, {
            name: "jsxdata",
            title: "数据源",
            defaultValue: {
                a: '选项A',
                b: '选项B'
            },
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
            name: "jsxtips",
            title: "提示文案",
            defaultValue: "",
            required: false,
            fieldStyle: "block",
            fieldCollapsed: false,
            setter: <TextSetter multiline={true} rows={2} />
        }]
});

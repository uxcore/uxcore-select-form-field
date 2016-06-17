/**
 * Created by xy on 15/4/13.
 */
const React = require('react');
const FormField = require('uxcore-form-field');
const Constants = require("uxcore-const");
const Select = require('uxcore-select2');
const assign = require('object-assign');
const Validator = require('uxcore-validator');
const {isObject, isArray} = Validator;
const {Option} = Select;
const selectOptions = ['onSelect', 'onDeselect', 'getPopupContainer', 'multiple', 'filterOption', 'allowClear', 'combobox', 'searchPlaceholder', 'tags', 'disabled', 'showSearch', 'placeholder', 'optionLabelProp', 'maxTagTextLength', 'dropdownMatchSelectWidth', 'dropdownClassName', 'notFoundContent'];

class SelectFormField extends FormField {
    constructor(props) {
        super(props);
        let me = this;
        assign(me.state, {
            data: me._processData(props.jsxdata)
        })
    }

    componentWillReceiveProps(nextProps) {
        let me = this;
        if (!me._isEqual(nextProps.value, me.props.value)) {
            me.handleDataChange(me._processValue(nextProps.value), true);
        }
        if (!me._isEqual(nextProps.jsxdata, me.props.jsxdata)) {
            me.setState({
                data: me._processData(nextProps.jsxdata)
            });
        }
    }

    componentWillMount() {
        let me = this;
        if (me.props.jsxfetchUrl) {
            me.fetchData();
        }
    }

    componentDidMount() {
        let me = this;
        if (!me.props.standalone) {
            me.props.attachFormField(me);
            me.props.handleDataChange(me, {
                value: me._processValue(me.props.value),
                pass: true
            }, true);
        }
        me.hasDeprecatedProps();
    }

    handleDataChange(value, fromReset) {
        let me = this;
        me.setState({
            value: value,
            formatValue: me.formatValue(value),
            error: !!fromReset ? false : me.state.error,
            /*
             * why set state fromReset? some field like editor cannot be reset in the common way
             * so set this state to tell the field that you need to reset by yourself.
             */
            fromReset: fromReset
        }, () => {
            let pass = true
            if (!fromReset) {
                pass = me.doValidate();
            }
            me.props.handleDataChange(me, {
                value: value,
                pass: pass
            });
        });
    }

    fetchData(value) {
        let me = this;
        let ajaxOptions = {
            url: me.props.jsxfetchUrl,
            dataType: me.props.dataType,
            data: me.props.beforeFetch({
                q: value
            }),
            success: (data) => {
                let fetchData = me._processData(me.props.afterFetch(data));
                if (!!me.props.jsxdata) {
                    fetchData = me._processData(me.props.jsxdata).concat(fetchData)
                }
                me.setState({
                    data: fetchData
                });
            },
            fail: () => {
                console.log("Fetch Data failed");
            }
        }
        if (/\.jsonp/.test(me.props.jsxfetchUrl)) {
            ajaxOptions.dataType = "jsonp"
        }
        $.ajax(ajaxOptions);
    }

    handleChange(value, label) {
        let me = this;
        me.handleDataChange(value, false, label);
    }
    handleSearch(value) {
        let me = this;
        if (me.props.jsxfetchUrl) {
            me.fetchData(value);
        } else {
            me.props.onSearch && me.props.onSearch(value);
        }
    }
    /**
     * jsxdata can be one of two types: hash map or array
     * hash map is like {value: text}
     * array is like [{value: xxx, text: xxx}]
     */

    _processData(data) {
        let values = [];
        if (typeof data == 'object' && !(data instanceof Array)) {
            let keys = Object.keys(data);
            values = keys.map((key) => {
                return {
                    value: key,
                    text: data[key]
                }
            });
        }
        else {
            values = data;
        }
        return values;
    }

    _transferDataToObj(data) {
        let obj = {};
        data.forEach((item, index) => {
            let key = (item.value == "" ? "__all__" : item.value);
            obj[key] = item.text;
        })
        return obj;
    }
    _generateOptionsFromData() {
        let me = this;
        let values = me.state.data;
        let children = me.props.children;
        if (!values.length) {
            // console.warn("You need to pass data to initialize Select.");
            if (!!children) {
                return children;
            }
        } else {
            let arr = values.map(function(item, index) {
                let {multiple, jsxmultiple, combobox, jsxcombobox} = me.props;

                return <Option key={item.value} title={item.text}>
                         {item.text}
                       </Option>
            });
            return arr;
        }
    }

    _processValue(value) {
        let me = this;
        value = value || me.state.value;
        if (!me.props.jsxfetchUrl && !me.props.onSearch) {
            return value;
        }
        if (typeof value == "string") {
            return {
                key: value
            }
        } else if (value instanceof Array) {
            return value.map((item) => {
                if (typeof item == "string") {
                    return {
                        key: item
                    }
                } else {
                    return item;
                }
            })
        } else {
            return value;
        }
    }

    addSpecificClass() {
        let me = this;
        if (me.props.jsxprefixCls == "kuma-uxform-field") {
            return me.props.jsxprefixCls + " kuma-select-uxform-field";
        } else {
            return me.props.jsxprefixCls
        }
    }

    getValuePropValue(child) {
        let key = "";
        if ('value' in child.props) {
            key = child.props.value;
        }
        else {
            key = child.key;
        }
        return key;
    }

    hasDeprecatedProps() {
        let arr = ['jsxmultiple', 'jsxallowClear', 'jsxcombobox', 'jsxsearchPlaceholder', 'jsxtags', 'jsxdisabled', 'jsxshowSearch', 'jsxplaceholder'];
        let me = this;
        let keys = Object.keys(me.props);
        let hasDeprecated = keys.some((item, index) => {
            return arr.indexOf(item) != -1
        });
        if (hasDeprecated) {
            console.warn("SelectFormField: props same as uxcore-select2 can be passed without prefix 'jsx' now (exclude style). we will remove the support of the props mentioned above with prefix 'jsx' at uxcore-form@1.3.0 .");
        }
    }

    renderField() {
        let me = this;
        let arr = [];
        let mode = me.props.jsxmode || me.props.mode;

        if (mode == Constants.MODE.EDIT) {
            let options = {
                ref: "el",
                key: "select",
                optionLabelProp: me.props.optionLabelProp,
                style: me.props.jsxstyle,
                multiple: me.props.jsxmultiple,
                allowClear: me.props.jsxallowClear,
                combobox: me.props.jsxcombobox,
                searchPlaceholder: me.props.jsxsearchPlaceholder,
                tags: me.props.jsxtags,
                optionFilterProp: me.props.optionFilterProp,
                disabled: !!me.props.jsxdisabled,
                showSearch: me.props.jsxshowSearch,
                placeholder: me.props.jsxplaceholder,
                onChange: me.handleChange.bind(me),
                onSearch: me.handleSearch.bind(me)
            };


            selectOptions.forEach((item, index) => {
                if (item in me.props) {
                    options[item] = me.props[item];
                }
            });

            // only jsxfetchUrl mode need pass label, for the options always change.
            // when mount, state.label is undefined, which cause defalutValue cannot be used.
            if (!!me.props.jsxfetchUrl || !!me.props.onSearch) {
                options.labelInValue = true;
            }

            if (!me.props.combobox || me.state.fromReset) {
                options.value = me._processValue() || [];
            }

            if (!!me.props.jsxfetchUrl) {
                options.filterOption = false;
            }
            arr.push(<Select {...options}>
                       {me._generateOptionsFromData()}
                     </Select>);
        } else if (mode == Constants.MODE.VIEW) {
            let str = '';
            if (me.state.value) {
                let value = me._processValue();
                let values = !isArray(value) ? [value] : value;
                // labelInValue mode
                if (me.props.jsxfetchUrl || me.props.onSearch || me.props.labelInValue) {
                    str = values.map((item) => {
                        return item.label;
                    }).join(" ");
                }
                // <Option> mode
                else if (me.props.children) { 
                    me.props.children && me.props.children.forEach((child, index) => {
                        let valuePropValue = me.getValuePropValue(child);
                        if (values.indexOf(valuePropValue) !== -1) {
                            str += child.props[me.props.optionLabelProp] + " ";
                        }
                    })
                }
                // only jsxdata
                else {
                    values.forEach((value, index) => {      
                        str += me._transferDataToObj(me.state.data)[value == "" ? "__all__" : value] + " ";        
                    });
                }
            }
            arr.push(<span key="select">{str}</span>);
        }
        return arr;
    }
}

SelectFormField.Option = Option;
SelectFormField.displayName = "SelectFormField";
SelectFormField.propTypes = assign({}, FormField.propTypes, {
    jsxstyle: React.PropTypes.object,
    jsxplaceholder: React.PropTypes.string,
    jsxcombobox: React.PropTypes.bool,
    jsxdata: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
    ]),
    beforeFetch: React.PropTypes.func,
    afterFetch: React.PropTypes.func,
    jsxshowSearch: React.PropTypes.bool,
    jsxtags: React.PropTypes.bool,
    jsxmultiple: React.PropTypes.bool,
    jsxallowClear: React.PropTypes.bool,
    jsxsearchPlaceholder: React.PropTypes.string,
    optionFilterProp: React.PropTypes.string,
    dataType: React.PropTypes.string
});

SelectFormField.defaultProps = assign({}, FormField.defaultProps, {
    jsxstyle: {},
    jsxplaceholder: "请下拉选择",
    jsxcombobox: false,
    jsxdata: {},
    beforeFetch: (obj) => {
        return obj
    },
    afterFetch: (obj) => {
        return obj
    },
    jsxshowSearch: true,
    jsxallowClear: false,
    jsxtags: false,
    jsxmultiple: false,
    jsxsearchPlaceholder: "",
    optionFilterProp: "children",
    optionLabelProp: "children",
    dataType: 'json'
});

module.exports = SelectFormField;

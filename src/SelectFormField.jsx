/**
 * Created by xy on 15/4/13.
 */
const React = require('react');
const FormField = require('uxcore-form-field');
const Constants = require('uxcore-const');
const Select = require('uxcore-select2');
const assign = require('object-assign');
const Validator = require('uxcore-validator');
const isEqual = require('lodash/isEqual');
const NattyFetch = require('natty-fetch/dist/natty-fetch.pc');
const Promise = require('lie');

const util = require('./util');

const { processData, transferDataToObj, getValuePropValue } = util;

const { isArray } = Validator;
const { Option } = Select;
const selectOptions = ['onDeselect', 'getPopupContainer',
  'multiple', 'filterOption', 'allowClear', 'combobox', 'searchPlaceholder',
  'tags', 'disabled', 'showSearch', 'placeholder', 'optionLabelProp',
  'maxTagTextLength', 'dropdownMatchSelectWidth', 'dropdownClassName',
  'notFoundContent', 'labelInValue', 'defaultActiveFirstOption', 'onFocus', 'onBlur'];

class SelectFormField extends FormField {
  constructor(props) {
    super(props);
    const me = this;
    assign(me.state, {
      data: processData(props.jsxdata),
    });
  }

  componentWillReceiveProps(nextProps) {
    const me = this;
    super.componentWillReceiveProps(nextProps);
    if (!isEqual(nextProps.jsxdata, me.props.jsxdata)) {
      me.setState({
        data: processData(nextProps.jsxdata),
      });
    }
  }

  componentDidMount() {
    const me = this;
    if (me.props.jsxfetchUrl && me.props.fetchDataOnMount) {
      me.fetchData();
    }
    if (!me.props.standalone) {
      me.props.attachFormField(me);
      me.props.handleDataChange(me, {
        value: me.processValue(me.props.value),
        pass: true,
      }, true);
    }
    me.hasDeprecatedProps();
  }

  componentDidUpdate(prevProps) {
    const { jsxfetchUrl } = this.props;
    if (jsxfetchUrl && prevProps.jsxfetchUrl !== jsxfetchUrl) {
      this.fetchData();
    }
  }

  /**
   * select inner method is used, not very reliable
   */

  resetSelect() {
    const me = this;
    const { multiple, closeOnSelect } = me.props;
    if (multiple && closeOnSelect) {
      if (typeof me.select.setInputValue === 'function') {
        me.select.setInputValue('');
      } else {
        console.warn('select.setInputValue is invalid');
      }
      if (typeof me.select.setOpenState === 'function') {
        me.select.setOpenState(false, false);
      } else {
        console.warn('select.setOpenState is invalid');
      }
    }
  }

  fetchData(value) {
    const me = this;
    if (me.fetch) {
      me.fetch.abort();
    }
    me.fetch = NattyFetch.create({
      url: me.props.jsxfetchUrl,
      jsonp: me.props.dataType
        ? me.props.dataType === 'jsonp'
        : (/\.jsonp/.test(me.props.jsxfetchUrl)),
      data: me.props.beforeFetch({
        q: value,
      }),
      fit: me.props.fitResponse,
      Promise,
    });
    me.fetch().then((content) => {
      let fetchData = processData(me.props.afterFetch(content));
      if (me.props.jsxdata) {
        fetchData = processData(me.props.jsxdata).concat(fetchData);
      }
      me.setState({
        data: fetchData,
      });
    }).catch((e) => {
      console.error(e.stack);
    });
  }

  handleChange(value, label) {
    const me = this;
    me.handleDataChange(value, false, label);
  }

  handleSearch(value) {
    const me = this;
    if (me.searchTimer) {
      clearTimeout(me.searchTimer);
    }
    me.searchTimer = setTimeout(() => {
      if (me.props.jsxfetchUrl) {
        me.fetchData(value);
      } else if (me.props.onSearch) {
        me.props.onSearch(value);
      }
    }, me.props.searchDelay);
  }

  _generateOptionsFromData() {
    const me = this;
    const values = me.state.data;
    const children = me.props.children;
    if (!values.length) {
      // console.warn("You need to pass data to initialize Select.");
      if (children) {
        return children;
      }
    }
    const arr = values.map(item =>
      <Option key={item.value} title={item.text}>
        {item.text}
      </Option>
    );
    return arr;
  }

  /**
   * transfer 'a' to { key: 'a' }
   * transfer ['a'] to [{ key: 'a' }]
   */
  processValue(value) {
    const me = this;
    let newValue = value;
    if (value === undefined) {
      newValue = me.state.value;
    }
    if (!me.props.jsxfetchUrl && !me.props.onSearch) {
      return newValue;
    }
    if (typeof newValue === 'string') {
      return {
        key: newValue,
      };
    } else if (newValue instanceof Array) {
      return newValue.map((item) => {
        if (typeof item === 'string') {
          return {
            key: item,
          };
        }
        return item;
      });
    }
    return newValue;
  }

  addSpecificClass() {
    const me = this;
    if (me.props.jsxprefixCls === 'kuma-uxform-field') {
      return `${me.props.jsxprefixCls} kuma-select-uxform-field`;
    }
    return me.props.jsxprefixCls;
  }

  hasDeprecatedProps() {
    const arr = ['jsxmultiple', 'jsxallowClear', 'jsxcombobox',
      'jsxsearchPlaceholder', 'jsxtags', 'jsxdisabled', 'jsxshowSearch',
      'jsxplaceholder'];
    const me = this;
    const keys = Object.keys(me.props);
    const hasDeprecated = keys.some(item => arr.indexOf(item) !== -1);
    if (hasDeprecated) {
      console.warn(`SelectFormField: props same as 
        uxcore-select2 can be passed without prefix 'jsx' now (exclude style). 
        we will remove the support of the props mentioned 
        above with prefix 'jsx' at uxcore-form@1.3.0 .`);
    }
  }

  renderField() {
    const me = this;
    const arr = [];
    const mode = me.props.jsxmode || me.props.mode;

    if (mode === Constants.MODE.EDIT) {
      const options = {
        ref: (c) => { this.select = c; },
        key: 'select',
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
        onSearch: me.handleSearch.bind(me),
        onSelect: (...args) => {
          this.resetSelect();
          if (this.props.onSelect) {
            this.props.onSelect(...args);
          }
        },
      };


      selectOptions.forEach((item) => {
        if (item in me.props) {
          options[item] = me.props[item];
        }
      });

      // only jsxfetchUrl mode need pass label, for the options always change.
      // when mount, state.label is undefined, which cause defalutValue cannot be used.
      if (me.props.jsxfetchUrl || me.props.onSearch) {
        options.labelInValue = true;
      }

      if (!me.props.combobox || me.state.fromReset) {
        options.value = me.processValue() || [];
      }

      if (me.props.jsxfetchUrl) {
        options.filterOption = false;
      }
      /* eslint-disable no-underscore-dangle */
      /* used in SearchFormField */
      arr.push(<Select {...options}>
        {me._generateOptionsFromData()}
      </Select>);
      /* eslint-enable no-underscore-dangle */
    } else if (mode === Constants.MODE.VIEW) {
      let str = '';
      if (me.state.value) {
        const value = me.processValue();
        const values = !isArray(value) ? [value] : value;
        // labelInValue mode
        if (me.props.jsxfetchUrl || me.props.onSearch || me.props.labelInValue) {
          str = values.map(item => (item.label || item.key)).join(' ');
        } else if (me.props.children) {
          // <Option> mode
          if (me.props.children) {
            me.props.children.forEach((child) => {
              const valuePropValue = getValuePropValue(child);
              if (values.indexOf(valuePropValue) !== -1) {
                str += `${child.props[me.props.optionLabelProp]} `;
              }
            });
            if (str === '') {
              str = values.join(' ');
            }
          }
        } else {
          // only jsxdata
          values.forEach((item) => {
            const label = transferDataToObj(me.state.data)[item === '' ? '__all__' : item];
            str += `${label || item} `;
          });
        }
      }
      arr.push(<span key="select">{str}</span>);
    }
    return arr;
  }
}

SelectFormField.Option = Option;
SelectFormField.displayName = 'SelectFormField';
SelectFormField.propTypes = assign({}, FormField.propTypes, {
  jsxstyle: React.PropTypes.object,
  jsxplaceholder: React.PropTypes.string,
  jsxcombobox: React.PropTypes.bool,
  jsxdata: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array,
  ]),
  searchDelay: React.PropTypes.number,
  beforeFetch: React.PropTypes.func,
  afterFetch: React.PropTypes.func,
  jsxshowSearch: React.PropTypes.bool,
  jsxtags: React.PropTypes.bool,
  jsxmultiple: React.PropTypes.bool,
  jsxallowClear: React.PropTypes.bool,
  jsxsearchPlaceholder: React.PropTypes.string,
  optionFilterProp: React.PropTypes.string,
  dataType: React.PropTypes.string,
  fetchDataOnMount: React.PropTypes.bool,
});

SelectFormField.defaultProps = assign({}, FormField.defaultProps, {
  jsxstyle: {},
  jsxplaceholder: '请下拉选择',
  jsxcombobox: false,
  jsxdata: {},
  searchDelay: 100,
  beforeFetch: obj => obj,
  afterFetch: obj => obj,
  fitResponse: response =>
  ({
    content: response.content || response,
    success: response.success === undefined ? true : response.success,
  }),
  jsxshowSearch: true,
  jsxallowClear: false,
  jsxtags: false,
  jsxmultiple: false,
  jsxsearchPlaceholder: '',
  optionFilterProp: 'children',
  optionLabelProp: 'children',
  fetchDataOnMount: true,
});

module.exports = SelectFormField;

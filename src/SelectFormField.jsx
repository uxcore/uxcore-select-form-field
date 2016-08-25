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

const { isArray } = Validator;
const { Option } = Select;
const selectOptions = ['onSelect', 'onDeselect', 'getPopupContainer',
  'multiple', 'filterOption', 'allowClear', 'combobox', 'searchPlaceholder',
  'tags', 'disabled', 'showSearch', 'placeholder', 'optionLabelProp',
  'maxTagTextLength', 'dropdownMatchSelectWidth', 'dropdownClassName',
  'notFoundContent', 'labelInValue'];

class SelectFormField extends FormField {
  constructor(props) {
    super(props);
    const me = this;
    assign(me.state, {
      data: me.processData(props.jsxdata),
    });
  }

  componentWillReceiveProps(nextProps) {
    const me = this;
    if (!isEqual(nextProps.value, me.props.value)) {
      me.handleDataChange(me.processValue(nextProps.value), true, true);
    }
    if (!isEqual(nextProps.jsxdata, me.props.jsxdata)) {
      me.setState({
        data: me.processData(nextProps.jsxdata),
      });
    }
  }

  componentWillMount() {
    const me = this;
    if (me.props.jsxfetchUrl) {
      me.fetchData();
    }
  }

  componentDidMount() {
    const me = this;
    if (!me.props.standalone) {
      me.props.attachFormField(me);
      me.props.handleDataChange(me, {
        value: me.processValue(me.props.value),
        pass: true,
      }, true);
    }
    me.hasDeprecatedProps();
  }

  handleDataChange(value, fromReset) {
    const me = this;
    me.setState({
      value,
      formatValue: me.formatValue(value),
      error: fromReset ? false : me.state.error,
      /*
       * why set state fromReset? some field like editor cannot be reset in the common way
       * so set this state to tell the field that you need to reset by yourself.
       */
      fromReset,
    }, () => {
      let pass = true;
      if (!fromReset) {
        pass = me.doValidate();
      }
      me.props.handleDataChange(me, {
        value,
        pass,
      });
    });
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
      let fetchData = me.processData(me.props.afterFetch(content));
      if (me.props.jsxdata) {
        fetchData = me.processData(me.props.jsxdata).concat(fetchData);
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

  /**
   * jsxdata can be one of two types: hash map or array
   * hash map is like {value: text}
   * array is like [{value: xxx, text: xxx}]
   */

  processData(data) {
    let values = [];
    if (typeof data === 'object' && !(data instanceof Array)) {
      const keys = Object.keys(data);
      values = keys.map((key) =>
        ({
          value: key,
          text: data[key],
        })
      );
    } else {
      values = data;
    }
    return values;
  }

  transferDataToObj(data) {
    const obj = {};
    data.forEach((item) => {
      const key = (item.value === '' ? '__all__' : item.value);
      obj[key] = item.text;
    });
    return obj;
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
    const arr = values.map((item) =>
      <Option key={item.value} title={item.text}>
        {item.text}
      </Option>
    );
    return arr;
  }

  processValue(value) {
    const me = this;
    const newValue = value || me.state.value;
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

  getValuePropValue(child) {
    let key = '';
    if ('value' in child.props) {
      key = child.props.value;
    } else {
      key = child.key;
    }
    return key;
  }

  hasDeprecatedProps() {
    const arr = ['jsxmultiple', 'jsxallowClear', 'jsxcombobox',
      'jsxsearchPlaceholder', 'jsxtags', 'jsxdisabled', 'jsxshowSearch',
      'jsxplaceholder'];
    const me = this;
    const keys = Object.keys(me.props);
    const hasDeprecated = keys.some((item) => arr.indexOf(item) !== -1);
    if (hasDeprecated) {
      console.warn(`SelectFormField: props same as 
        uxcore-select2 can be passed without prefix \'jsx\' now (exclude style). 
        we will remove the support of the props mentioned 
        above with prefix \'jsx\' at uxcore-form@1.3.0 .`);
    }
  }

  renderField() {
    const me = this;
    const arr = [];
    const mode = me.props.jsxmode || me.props.mode;

    if (mode === Constants.MODE.EDIT) {
      const options = {
        ref: 'el',
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
      arr.push(<Select {...options}>
        {me._generateOptionsFromData()}
      </Select>);
    } else if (mode === Constants.MODE.VIEW) {
      let str = '';
      if (me.state.value) {
        const value = me.processValue();
        const values = !isArray(value) ? [value] : value;
        // labelInValue mode
        if (me.props.jsxfetchUrl || me.props.onSearch || me.props.labelInValue) {
          str = values.map((item) => item.label).join(' ');
        } else if (me.props.children) {
          // <Option> mode
          if (me.props.children) {
            me.props.children.forEach((child) => {
              const valuePropValue = me.getValuePropValue(child);
              if (values.indexOf(valuePropValue) !== -1) {
                str += `${child.props[me.props.optionLabelProp]} `;
              }
            });
          }
        } else {
          // only jsxdata
          values.forEach((item) => {
            str += `${me.transferDataToObj(me.state.data)[item === '' ? '__all__' : item]} `;
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
});

SelectFormField.defaultProps = assign({}, FormField.defaultProps, {
  jsxstyle: {},
  jsxplaceholder: '请下拉选择',
  jsxcombobox: false,
  jsxdata: {},
  searchDelay: 100,
  beforeFetch: (obj) => obj,
  afterFetch: (obj) => obj,
  fitResponse: (response) =>
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
});

module.exports = SelectFormField;

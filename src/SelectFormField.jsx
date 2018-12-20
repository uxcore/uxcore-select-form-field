/**
 * Created by xy on 15/4/13.
 */
import React from 'react';
import PropTypes from 'prop-types';
import FormField from 'uxcore-form-field';
import Constants from 'uxcore-const';
import Select from 'uxcore-select2';
import assign from 'object-assign';
import isObject from 'lodash/isObject';
import isEqual from 'lodash/isEqual';
import NattyFetch from 'natty-fetch';
import Promise from 'lie';
import find from 'lodash/find';
import util from './util';

const { processData, transferDataToObj, getValuePropValue } = util;

const { Option } = Select;
const selectOptions = [
  'allowClear',
  'autoClearSearchValue',
  'autoFocus',
  'backfill',
  'combobox',
  'defaultActiveFirstOption',
  'defaultOpen',
  'disabled',
  'dropdownAlign',
  'dropdownClassName',
  'dropdownMatchSelectWidth',
  'dropdownMenuStyle',
  'dropdownRender',
  'dropdownStyle',
  'filterOption',
  'firstActiveValue',
  'getInputElement',
  'getPopupContainer',
  'labelInValue',
  'loading',
  'maxTagCount',
  'maxTagPlaceholder',
  'maxTagTextLength',
  'menuItemSelectedIcon',
  'multiple',
  'notFoundContent',
  'onBlur',
  'onDeselect',
  'onFocus',
  'onInputKeyDown',
  'onPopupScroll',
  'open',
  'optionFilterProp',
  'optionLabelProp',
  'placeholder',
  'searchPlaceholder',
  'showAction',
  'showArrow',
  'showSearch',
  'tags',
];

class SelectFormField extends FormField {
  static getDerivedStateFromProps = (props, state) => {
    const baseUpdate = FormField.getDerivedStateFromProps(props, state);
    const { jsxdata } = props;
    if (!isEqual(jsxdata, state.prevPropsData)) {
      return {
        ...baseUpdate,
        data: processData(props.jsxdata),
        prevPropsData: props.jsxdata,
      };
    }
    return baseUpdate;
  }

  constructor(props) {
    super(props);
    const me = this;
    const { jsxdata } = props;
    assign(me.state, {
      data: processData(jsxdata),
      prevPropsData: jsxdata,
    });
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.jsxfetchUrl && this.props.fetchDataOnMount) {
      this.fetchData();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);
    const { jsxfetchUrl } = this.props;
    if (jsxfetchUrl && prevProps.jsxfetchUrl !== jsxfetchUrl) {
      this.fetchData();
    }
  }

  /**
   * select inner method is used, not very reliable
   * 
   * @deprecated
   */
  resetSelect() {
    const me = this;
    const { multiple, closeOnSelect } = me.props;
    if (multiple && closeOnSelect) {
      if (typeof me.select.setInputValue === 'function') {
        me.select.setInputValue('');
      }
      if (typeof me.select.setOpenState === 'function') {
        me.select.setOpenState(false, false);
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
      method: me.props.method,
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

  handleChange(value) {
    const {
      useValueText, jsxfetchUrl, onSearch, labelInValue,
    } = this.props;
    const labelInValueMode = !!jsxfetchUrl || !!onSearch || labelInValue;
    if (labelInValueMode && useValueText) {
      let newValue = value;
      if (Array.isArray(value)) {
        newValue = value.map(item => ({
          value: item.key,
          text: item.label,
        }));
      }
      if (typeof value === 'object' && value !== null) {
        newValue = {
          value: value.key,
          text: value.label,
        };
      }
      this.handleDataChange(newValue);
    } else {
      this.handleDataChange(value);
    }
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
    const { children, optionTextRender } = me.props;
    if (!values.length) {
      if (children) {
        return children;
      }
    }
    const arr = values.map((item) => {
      const { value, text, ...others } = item;
      return (
        <Option key={value} title={text} {...others}>
          {optionTextRender ? optionTextRender(item.text, item) : item.text}
        </Option>
      );
    });
    return arr;
  }

  /**
   * 获取当前已经选择项的完整数据
   * 多选时返回数组，单选时返回 object
   * 新增 value is object。
   */
  getFullData() {
    const { data, value } = this.state;
    if (Array.isArray(value)) {
      return value.map((selectItem) => {
        if (isObject(selectItem)) {
          return find(data, item => item.value === selectItem.key);
        }
        return find(data, item => item.value === selectItem);
      }).filter(i => i !== undefined);
    }
    if (isObject(value)) {
      return find(data, item => item.value === value.key);
    }
    return find(data, item => item.value === value);
  }

  /**
   * transfer 'a' to { key: 'a' }
   * transfer ['a'] to [{ key: 'a' }]
   * transfer { value: 'a', text: 'A' } to { key: 'a', label: 'A' }
   * transfer [{ value: 'a', text: 'A' }] to [{ key: 'x', label: 'A' }]
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
    }
    if (newValue instanceof Array) {
      return newValue.map(item => this.processValue(item));
    }
    if (typeof newValue === 'object' && newValue !== null) {
      return {
        key: newValue.value || newValue.key,
        label: newValue.text || newValue.label,
      };
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

  renderField() {
    const me = this;
    const arr = [];
    const mode = me.props.jsxmode || me.props.mode;

    if (mode === Constants.MODE.EDIT) {
      const options = {
        ref: (c) => { this.select = c; },
        key: 'select',
        style: me.props.jsxstyle,
        multiple: me.props.jsxmultiple,
        allowClear: me.props.jsxallowClear,
        combobox: me.props.jsxcombobox,
        searchPlaceholder: me.props.jsxsearchPlaceholder,
        tags: me.props.jsxtags,
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
        size: me.getSize(),
      };

      if (me.props.jsxfetchUrl) {
        options.filterOption = false;
      }

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

      options.value = me.processValue() || [];


      /* eslint-disable no-underscore-dangle */
      /* used in SearchFormField */
      arr.push(
        <Select {...options}>
          {me._generateOptionsFromData()}
        </Select>,
      );
      /* eslint-enable no-underscore-dangle */
    } else if (mode === Constants.MODE.VIEW) {
      let str = '';
      const renderValues = [];
      const splitter = ', \u00a0';
      if (me.state.value) {
        const value = me.processValue();
        const values = !Array.isArray(value) ? [value] : value;
        if (me.props.jsxfetchUrl || me.props.onSearch || me.props.labelInValue) {
          // labelInValue mode
          str = values.map((item) => {
            const label = item.label || item.key;

            renderValues.push({
              value: item.key,
              text: label,
            });

            return label;
          }).join(splitter);
        } else if (me.props.children) {
          // <Option> mode
          const optionsLabel = [];
          me.props.children.forEach((child) => {
            const valuePropValue = getValuePropValue(child);
            if (values.indexOf(valuePropValue) !== -1) {
              const label = `${child.props[me.props.optionLabelProp]}`;

              optionsLabel.push(label);

              renderValues.push({
                value: valuePropValue,
                text: label,
              });
            }
          });

          str = optionsLabel.length ? optionsLabel.join(splitter) : values.join(splitter);
        } else {
          // only jsxdata
          str = values.map((item) => {
            const label = transferDataToObj(me.state.data)[item === '' ? '__all__' : item];

            renderValues.push({
              value: item,
              text: label || item,
            });

            return label || item;
          }).join(splitter);
        }
      }

      if (me.props.renderView) {
        str = me.props.renderView(renderValues);
      }

      arr.push(
        <span key="select">
          {str}
        </span>,
      );
    }
    return arr;
  }
}

SelectFormField.Option = Option;
SelectFormField.displayName = 'SelectFormField';
SelectFormField.propTypes = assign({}, FormField.propTypes, {
  jsxstyle: PropTypes.object,
  jsxplaceholder: PropTypes.string,
  jsxcombobox: PropTypes.bool,
  jsxdata: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  searchDelay: PropTypes.number,
  beforeFetch: PropTypes.func,
  afterFetch: PropTypes.func,
  jsxshowSearch: PropTypes.bool,
  jsxtags: PropTypes.bool,
  jsxmultiple: PropTypes.bool,
  jsxallowClear: PropTypes.bool,
  jsxsearchPlaceholder: PropTypes.string,
  optionFilterProp: PropTypes.string,
  dataType: PropTypes.string,
  fetchDataOnMount: PropTypes.bool,
  useValueText: PropTypes.bool,
  method: PropTypes.string,
  dropdownAlign: PropTypes.object,
  optionTextRender: PropTypes.func,
  renderView: PropTypes.func,
});

SelectFormField.defaultProps = assign({}, FormField.defaultProps, {
  jsxstyle: {},
  jsxplaceholder: '请下拉选择',
  jsxcombobox: false,
  jsxdata: {},
  searchDelay: 100,
  beforeFetch: obj => obj,
  afterFetch: obj => obj,
  fitResponse: response => ({
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
  useValueText: false,
  method: 'GET',
  dropdownAlign: {
    points: ['tl', 'bl', 'tr', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: true,
      adjustY: true,
    },
  },
  optionTextRender: text => text,
  renderView: undefined,
});

export default SelectFormField;

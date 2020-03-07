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
const defaultLabels = {
  placeholder: {
    'zh-cn': '请下拉选择',
    'en-us': 'Please select',
    en: 'Please select',
  },
  notFoundContent: {
    'zh-cn': '未查询到备选项',
    'en-us': 'No Options Found',
    en: 'No Options Found',
  },
  searchTips: {
    'zh-cn': '仅展示 {count} 条记录。若未找到，请试试输入关键字搜索...',
    'en-us': 'Only show {count} options by default, enter keywords to search for more...',
    en: 'Only show {count} options by default, enter keywords to search for more...',
  },
};

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
  'rcRef',
  'searchPlaceholder',
  'showAction',
  'showArrow',
  'showSearch',
  'tags',
];

class SelectFormField extends FormField {
  static getDerivedStateFromProps(props, state) {
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

    const {
      jsxdata,
      locale,
    } = props;

    this.safeLocale = 'zh-cn';
    if (['zh-cn', 'en', 'en-us'].indexOf(locale) !== -1) {
      this.safeLocale = locale;
    }

    assign(this.state, {
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
  /* eslint-disable */
  resetSelect() {
    console.warn('Method resetSelect is deprecated');
  }
  /* eslint-enable */

  fetchData(value) {
    if (this.fetch) {
      this.fetch.abort();
    }

    const formerData = this.state.data;

    this.setState({
      data: [],
      loading: true,
    });

    const {
      jsxfetchUrl,
      dataType,
      searchKey = 'q',
      beforeFetch,
      afterFetch,
      method,
      fetchMethod,
      fetchHeader,
      fetchSizeOptions,
      fitResponse,
      jsxdata,
    } = this.props;

    const data = beforeFetch({
      [searchKey]: value,
    });
    if (fetchSizeOptions && fetchSizeOptions.size) {
      const key = fetchSizeOptions.key || 'size';
      data[key] = fetchSizeOptions.size;
    }

    const param = {
      url: jsxfetchUrl,
      jsonp: dataType
        ? dataType === 'jsonp'
        : (/\.jsonp/.test(jsxfetchUrl)),
      data,
      method: fetchMethod || method,
      fit: fitResponse,
      Promise,
    };
    if (fetchHeader) {
      param.header = fetchHeader;
    }
    this.fetch = NattyFetch.create(param);

    this.fetch().then((content) => {
      let fetchData = processData(afterFetch(content));
      if (jsxdata) {
        fetchData = processData(jsxdata).concat(fetchData);
      }
      this.setState({
        data: fetchData,
        loading: false,
      });
    }).catch((e) => {
      console.error(e.stack);

      this.setState({
        data: formerData,
        loading: false,
      });
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
      } else if (typeof value === 'object' && value !== null) {
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
    const {
      jsxfetchUrl,
      onSearch,
      searchDelay = 300,
    } = this.props;

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      if (jsxfetchUrl) {
        this.fetchData(value);
      } else if (onSearch) {
        onSearch(value);
      }
    }, searchDelay);
  }

  /* eslint-disable no-underscore-dangle */
  _generateOptionsFromData() {
    const {
      optionTextRender,
      valueStrictMode,
      fetchSizeOptions,
      children,
    } = this.props;

    const {
      data: values,
    } = this.state;

    if ((!Array.isArray(values) || !values.length) && children) {
      return children;
    }

    const options = values.map((item) => {
      const { value, text, ...others } = item;
      if (valueStrictMode) {
        others.value = value;
      }

      return (
        <Option key={value} title={text} {...others}>
          {optionTextRender ? optionTextRender(item.text, item) : item.text}
        </Option>
      );
    });

    // 在备选项最后加上一个 disabled 状态的提示选项
    if (fetchSizeOptions && fetchSizeOptions.size && (values.length >= fetchSizeOptions.size)) {
      const tipsText = fetchSizeOptions.text || defaultLabels.searchTips[this.safeLocale];
      const tipsContent = `${tipsText}`.replace('{count}', fetchSizeOptions.size);
      const tipsStyle = {
        color: '#9e9e9e',
        whiteSpace: 'normal',
        ...fetchSizeOptions.style,
      };
      options.push(<Option disabled key="search-tips" style={tipsStyle}>{tipsContent}</Option>);
    }

    return options;
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
    let newValue = value;
    if (value === undefined) {
      newValue = this.state.value;
    }
    if (!this.props.jsxfetchUrl && !this.props.onSearch) {
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
        title: newValue.title || newValue.text || newValue.label
      };
    }
    return newValue;
  }

  addSpecificClass() {
    if (this.props.jsxprefixCls === 'kuma-uxform-field') {
      return `${this.props.jsxprefixCls} kuma-select-uxform-field`;
    }
    return this.props.jsxprefixCls;
  }

  renderField() {
    const arr = [];
    const mode = this.props.jsxmode || this.props.mode;

    const loadingView = <div className="kuma-loading-s kuma-select-uxform-options-loading" />;

    if (mode === Constants.MODE.EDIT) {
      const options = {
        ref: (c) => { this.select = c; },
        key: 'select',
        style: this.props.jsxstyle,
        multiple: this.props.jsxmultiple,
        allowClear: this.props.jsxallowClear,
        combobox: this.props.jsxcombobox,
        searchPlaceholder: this.props.jsxsearchPlaceholder,
        tags: this.props.jsxtags,
        disabled: !!this.props.jsxdisabled,
        showSearch: this.props.jsxshowSearch,
        placeholder: this.props.jsxplaceholder || defaultLabels.placeholder[this.safeLocale],
        onChange: this.handleChange.bind(this),
        onSearch: this.handleSearch.bind(this),
        onSelect: (...args) => {
          if (this.props.onSelect) {
            this.props.onSelect(...args);
          }
        },
        size: this.getSize(),
      };

      if (this.props.jsxfetchUrl) {
        options.filterOption = false;
      }

      selectOptions.forEach((item) => {
        if (item in this.props) {
          options[item] = this.props[item];
        }
      });

      if (!{}.hasOwnProperty.call(this.props, 'notFoundContent')) {
        options.notFoundContent = defaultLabels.notFoundContent[this.safeLocale];
      }

      if (this.state.loading) {
        options.notFoundContent = this.props.loadingView || loadingView;
      }

      // only jsxfetchUrl mode need pass label, for the options always change.
      // when mount, state.label is undefined, which cause defalutValue cannot be used.
      if (this.props.jsxfetchUrl || this.props.onSearch) {
        options.labelInValue = true;
      }

      options.value = this.processValue() || [];

      /* eslint-disable no-underscore-dangle */
      /* used in SearchFormField */
      arr.push(
        <Select {...options}>
          {this._generateOptionsFromData()}
        </Select>,
      );
      /* eslint-enable no-underscore-dangle */
    } else if (mode === Constants.MODE.VIEW) {
      let str = '';
      const renderValues = [];
      const splitter = ', \u00a0';
      if (this.state.value) {
        const value = this.processValue();
        const values = !Array.isArray(value) ? [value] : value;
        if (this.props.jsxfetchUrl || this.props.onSearch || this.props.labelInValue) {
          // labelInValue mode
          str = values.map((item) => {
            const label = item.label || item.key;

            renderValues.push({
              value: item.key,
              text: label,
            });

            return label;
          }).join(splitter);
        } else if (this.props.children) {
          // <Option> mode
          const optionsLabel = [];
          this.props.children.forEach((child) => {
            const valuePropValue = getValuePropValue(child);
            if (values.indexOf(valuePropValue) !== -1) {
              const label = `${child.props[this.props.optionLabelProp]}`;

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
            const label = transferDataToObj(this.state.data)[item === '' ? '__all__' : item];

            renderValues.push({
              value: item,
              text: label || item,
            });

            return label || item;
          }).join(splitter);
        }
      }

      if (this.props.renderView) {
        str = this.props.renderView(renderValues);
      }

      arr.push(
        <span key="select">
          {str || '--'}
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
  searchKey: PropTypes.string,
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
  fetchMethod: PropTypes.string,
  fetchHeader: PropTypes.object,
  fetchSizeOptions: PropTypes.object,
  dropdownAlign: PropTypes.object,
  optionTextRender: PropTypes.func,
  renderView: PropTypes.func,
  loadingView: PropTypes.node,
  valueStrictMode: PropTypes.bool,
});

SelectFormField.defaultProps = assign({}, FormField.defaultProps, {
  jsxstyle: {},
  jsxplaceholder: undefined,
  jsxcombobox: false,
  jsxdata: {},
  searchDelay: 100,
  searchKey: 'q',
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
  fetchMethod: undefined,
  fetchHeader: undefined,
  fetchSizeOptions: undefined,
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
  loadingView: undefined,
  valueStrictMode: false,
});

export default SelectFormField;

/**
 * SelectFormField Component Demo for uxcore
 * @author eternalsky
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */


import React from 'react';
import Form from 'uxcore-form';
import Constants from 'uxcore-const';
import Validators from 'uxcore-validator';
import Button from 'uxcore-button';
import SelectFormField from '../src/SelectFormField';

const { FormRow, OtherFormField } = Form;
const { Option } = SelectFormField;

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsxdata: {
        bj: '北',
        nj: '南',
        dj: '东',
        xj: '西',
      },
      jsxdata2: [
        { value: 'bj', text: '蚂蚁金服-支付宝事业群-支付宝技术部-商家及开放技术部-商家开放质量技术部-开放与平台质量技术部-开放与平台基础质量组-开放与平台基础质量组' },
        { value: 'nj2', text: '蚂蚁金服-支付宝事业群-支付宝技术部-商家及开放技术部-商家开放质量技术部-开放与平台质量技术部-开放与平台基础质量组-尖刀质量技术组' },
        { value: 'nj3', text: '蚂蚁金服-支付宝事业群-支付宝技术部-商家及开放技术部-商家开放质量技术部-开放与平台质量技术部-开放与平台基础质量组-开放渠道与运营中台质量组' },
        { value: 'long', text: '蚂蚁金服-支付宝事业群-支付宝技术部-商家及开放技术部-商家开放质量技术部-开放与平台质量技术部-开放与平台基础质量组-产品平台与开发者中心质量组' },
      ],
      mode: Constants.MODE.EDIT,
      value: 'aaa',
    };

    this.selectRefs = {};
    this.change = this.change.bind(this);
  }

  handleOptionChange() {
    const me = this;
    me.setState({
      jsxdata: {
        bj: '北',
        nj: '南',
      },
    });
  }

  handleModeChange() {
    const me = this;
    me.setState({
      mode: me.state.mode === Constants.MODE.EDIT ? Constants.MODE.VIEW : Constants.MODE.EDIT,
    });
  }

  handleClear() {
    this.setState({
      value: null,
    });
  }

  change(value, name) {
    console.log(value, name);
    console.log(this.selectRefs[name].getFullData());
  }

  renderOptions() {
    const me = this;
    let arr = [];
    if (me.state.jsxdata instanceof Array) {
      arr = me.state.jsxdata.map(item => (
        <Option key={item.value}>
          {item.text}
        </Option>
      ));
    } else {
      const key = Object.keys(me.state.jsxdata);
      key.forEach((v) => {
        arr.push(
          <Option key={v}>
            {me.state.jsxdata[v]}
          </Option>,
        );
      });
    }
    return arr;
  }

  render() {
    const me = this;
    return (
      <div style={{ margin: 50 }}>
        <Form
          jsxmode={me.state.mode}
          jsxvalues={{ city: this.state.value, city2: '*' }}
          jsxonChange={this.change}
        >
          <FormRow>
            <SelectFormField
              ref={(r) => { this.selectRefs.select1 = r; }}
              jsxstyle={{ width: '300px' }}
              jsxlabel="长选项截断"
              jsxname="select1"
              allowClear
              dropdownClassName="select-dropdown-max-width"
              dropdownMatchSelectWidth={false}
              jsxrules={{ validator: Validators.isNotEmpty, errMsg: '不能为空' }}
              disabled={false}
              jsxdata={me.state.jsxdata2}
              optionTextRender={(text) => {
                let shortText = text;
                const fullLength = text.length;
                if (fullLength > 60) {
                  shortText = `${text.substring(0, 20)}......${text.substring(fullLength - 20)}`;
                }
                return <p style={{ whiteSpace: 'normal' }}>{shortText}</p>;
              }}
              onFocus={() => { console.log('focus'); }}
              onBlur={() => { console.log('blur'); }}
            />
          </FormRow>
          <FormRow>
            <SelectFormField
              ref={(r) => { this.selectRefs.select2 = r; }}
              jsxstyle={{ width: '300px' }}
              jsxlabel="长选项换行"
              jsxname="select2"
              allowClear
              dropdownClassName="select-dropdown-max-width"
              dropdownMatchSelectWidth={false}
              jsxrules={{ validator: Validators.isNotEmpty, errMsg: '不能为空' }}
              disabled={false}
              jsxdata={me.state.jsxdata2}
              dropdownAlign={{
                points: ['tr', 'br', 'tl', 'bl'],
                offset: [0, 4],
                overflow: {
                  adjustX: 1,
                  adjustY: 1,
                },
              }}
              optionTextRender={(text) => {
                return <p style={{ whiteSpace: 'normal' }}>{text}</p>;
              }}
              onFocus={() => { console.log('focus'); }}
              onBlur={() => { console.log('blur'); }}
            />
          </FormRow>
          <FormRow>
            <OtherFormField />
            <SelectFormField
              ref={(r) => { this.selectRefs.select3 = r; }}
              jsxstyle={{ width: '300px' }}
              jsxlabel="长选项自适应"
              jsxname="select3"
              allowClear
              dropdownClassName="select-dropdown-max-width"
              dropdownMatchSelectWidth={false}
              jsxrules={{ validator: Validators.isNotEmpty, errMsg: '不能为空' }}
              disabled={false}
              jsxdata={me.state.jsxdata2}
              optionTextRender={(text) => {
                return <p style={{ whiteSpace: 'normal' }}>{text}</p>;
              }}
              onFocus={() => { console.log('focus'); }}
              onBlur={() => { console.log('blur'); }}
            />
            <OtherFormField />
          </FormRow>
          <FormRow>
            <OtherFormField />
            <OtherFormField />
            <SelectFormField
              ref={(r) => { this.selectRefs.select7 = r; }}
              jsxstyle={{ width: '300px' }}
              jsxlabel="长选项自适应"
              jsxname="select7"
              allowClear
              dropdownClassName="select-dropdown-max-width"
              dropdownMatchSelectWidth={false}
              jsxrules={{ validator: Validators.isNotEmpty, errMsg: '不能为空' }}
              disabled={false}
              jsxdata={me.state.jsxdata2}
              optionTextRender={(text) => {
                return <p style={{ whiteSpace: 'normal' }}>{text}</p>;
              }}
              onFocus={() => { console.log('focus'); }}
              onBlur={() => { console.log('blur'); }}
            />
          </FormRow>
          <SelectFormField
            jsxlabel="单选"
            jsxname="select4"
            allowClear
            ref={(r) => { this.selectRefs.select4 = r; }}
          >
            {me.renderOptions()}
          </SelectFormField>
          <SelectFormField
            ref={(r) => { this.selectRefs.select5 = r; }}
            jsxlabel="多选模式"
            closeOnSelect
            onSelect={(...args) => { console.log(...args); }}
            jsxname="select5"
            multiple
            jsxfetchUrl="http://suggest.taobao.com/sug"
            dataType="jsonp"
            beforeFetch={(data) => {
              const newData = { ...data };
              if (newData.q === undefined) {
                newData.q = 'a';
              }
              return newData;
            }}
            afterFetch={(obj) => {
              const data = {};
              obj.result.forEach((item) => {
                data[item[1]] = item[0];
              });
              return data;
            }}
          />
        </Form>
        <Button onClick={me.handleModeChange.bind(me)}>
          切换模式
        </Button>&nbsp;
        <Button onClick={me.handleOptionChange.bind(me)}>
          更改选项
        </Button>&nbsp;
        <Button onClick={() => { me.handleClear(); }}>
          清空值
        </Button>
      </div>
    );
  }
}

export default Demo;

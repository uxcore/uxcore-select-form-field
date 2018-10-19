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
        { value: 'bj', text: '北京' },
        { value: 'nj', text: '南京' },
      ],
      mode: Constants.MODE.EDIT,
      value: 'aaa',
    };

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
    console.log(this.refs[name].getFullData());
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
      <div>
        <Form
          jsxmode={me.state.mode}
          jsxvalues={{ city: this.state.value, city2: '*' }}
          jsxonChange={this.change}
        >
          <SelectFormField
            ref="city"
            jsxstyle={{ width: '800px' }}
            jsxlabel="单选"
            jsxname="city"
            allowClear
            size="small"
            // combobox
            jsxrules={{ validator: Validators.isNotEmpty, errMsg: '不能为空' }}
            disabled={false}
            jsxdata={me.state.jsxdata2}
            onSearch={(value) => { }}
            onFocus={() => { console.log('focus'); }}
            onBlur={() => { console.log('blur'); }}
          />
          <SelectFormField
            jsxlabel="单选2"
            jsxname="city2"
            allowClear
            ref="city2"
          >
            {me.renderOptions()}
          </SelectFormField>
          <SelectFormField
            ref="goods2"
            jsxlabel="多选模式"
            closeOnSelect
            onSelect={(...args) => { console.log(...args); }}
            jsxname="goods2"
            multiple
            jsxfetchUrl="http://suggest.taobao.com/sug"
            dataType="jsonp"
            beforeFetch={function (data) {
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
        </Button>
        <Button onClick={me.handleOptionChange.bind(me)}>
          更改选项
        </Button>
        <Button onClick={() => { me.handleClear(); }}>
          清空值
        </Button>
      </div>
    );
  }
}

export default Demo;

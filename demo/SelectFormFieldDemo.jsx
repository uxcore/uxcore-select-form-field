/**
 * SelectFormField Component Demo for uxcore
 * @author eternalsky
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

const classnames = require('classnames');
const React = require('react');

const SelectFormField = require('../src');
const { Option } = SelectFormField;
const Form = require('uxcore-form/build/Form');
const Constants = require('uxcore-const');
const Validators = require('uxcore-validator');
const Button = require('uxcore-button');

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
      mode: Constants.MODE.EDIT,
      value: 'bj',
    };
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

  handleParentLeave() {
    alert('parent leave');
  }

  handleChildLeave() {
    alert('child leave');
  }

  handleClear() {
    this.setState({
      value: null,
    });
  }

  renderOptions() {
    const me = this;
    let arr = [];
    if (me.state.jsxdata instanceof Array) {
      arr = me.state.jsxdata.map((item) => {
        return <Option key={item.value}>{item.text}</Option>;
      });
    } else {
      for (const key in me.state.jsxdata) {
        arr.push(<Option key={key}>{me.state.jsxdata[key]}</Option>);
      }
    }
    return arr;
  }

  render() {
    const me = this;
    return (
      <div>
        <Form jsxmode={me.state.mode} jsxvalues={{ city: this.state.value, city2: '*' }}>
          <SelectFormField
            jsxstyle={{ width: '800px' }}
            jsxlabel="单选"
            jsxname="city"
            allowClear
            jsxrules={{ validator: Validators.isNotEmpty, errMsg: '不能为空' }}
            disabled={false}
            jsxdata={me.state.jsxdata}
            onSearch={(value) => { }}
          />
          <SelectFormField
            jsxlabel="单选2"
            jsxname="city2"
            allowClear
          >
            {me.renderOptions()}
          </SelectFormField>
          <SelectFormField
            jsxlabel="多选模式"
            closeOnSelect
            onSelect={(...args) => { console.log(...args); }}
            jsxname="goods2"
            multiple
            jsxfetchUrl="http://suggest.taobao.com/sug"
            dataType="jsonp"
            beforeFetch={function (data) {
              if (data.q === undefined) {
                data.q = 'a';
              }
              return data;
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
        <Button onClick={me.handleModeChange.bind(me)}>切换模式</Button>
        <Button onClick={me.handleOptionChange.bind(me)}>更改选项</Button>
        <Button onClick={() => { me.handleClear(); }}>清空值</Button>
      </div>
    );
  }
}

module.exports = Demo;

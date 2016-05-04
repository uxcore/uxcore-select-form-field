/**
 * SelectFormField Component Demo for uxcore
 * @author eternalsky
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

let classnames = require('classnames');

let SelectFormField = require('../src');
let {Option} = SelectFormField;
let Form = require('uxcore-form/build/Form');
let Constants = require('uxcore-const');
let Validators = require('uxcore-validator');
let Button = require('uxcore-button');

class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // jsxdata: {
            //     "bj": "北",
            //     "nj": "南",
            //     "dj": "东",
            //     "xj": "西"
            // },
            jsxdata: [
                {
                    value: "bj",
                    text: "北京"
                },
                {
                    value: "nj",
                    text: "南京" 
                }
            ],
            mode: Constants.MODE.EDIT
        }
    }

    handleModeChange() {
        let me = this;
        me.setState({
            mode: me.state.mode == Constants.MODE.EDIT ? Constants.MODE.VIEW : Constants.MODE.EDIT
        })
    }

    renderOptions() {
        let me = this;
        let arr = [];
        if (me.state.jsxdata instanceof Array) {
            arr = me.state.jsxdata.map((item) => {
                return <Option key={item.value}>{item.text}</Option>
            })
        }
        else {
            for (let key in me.state.jsxdata) {
                arr.push(<Option key={key}>{me.state.jsxdata[key]}</Option>)
            }
        }
        return arr;
    }

    render() {
        let me = this;
        return (
            <div>
                <Form jsxmode={me.state.mode}>
                    <SelectFormField
                         jsxlabel="单选"
                         jsxname="city"
                         allowClear={true}
                         jsxrules={{validator: Validators.isNotEmpty, errMsg: "不能为空"}}
                         disabled={false}
                         jsxdata={me.state.jsxdata}/>
                    <SelectFormField
                         jsxlabel="单选2"
                         jsxname="city2"
                         allowClear={true}>
                         {me.renderOptions()}
                    </SelectFormField>
                    <SelectFormField
                         jsxlabel="多选模式"
                         jsxname="goods2"
                         multiple={true}
                         jsxfetchUrl="http://suggest.taobao.com/sug"
                         dataType="jsonp"
                         beforeFetch={function(data) {
                            if (data.q == undefined) {
                                data.q = "a"
                            }
                            return data;
                         }}
                         afterFetch={(obj) => {
                            let data = {};
                            obj.result.forEach((item, index) => {
                                data[item[1]] = item[0];
                            });
                            return data;
                         }}/>

                </Form>
                <Button onClick={me.handleModeChange.bind(me)}>切换模式</Button>
            </div>
        );
    }
};

module.exports = Demo;

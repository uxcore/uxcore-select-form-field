/**
 * SelectFormField Component Demo for uxcore
 * @author eternalsky
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */

let classnames = require('classnames');

let SelectFormField = require('../src');
let Form = require('uxcore-form');
let Validators = require('uxcore-validator');

class Demo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            jsxdata: {
                "bj": "北",
                "nj": "南",
                "dj": "东",
                "xj": "西"
            }
        }
    }

    render() {
        let me = this;
        return (
            <div>
                <Form>
                    <SelectFormField
                         jsxlabel="单选"
                         jsxname="city"
                         allowClear={true}
                         jsxrules={{validator: Validators.isNotEmpty, errMsg: "不能为空"}}
                         disabled={false}
                         jsxdata={me.state.jsxdata}/>
                </Form>
            </div>
        );
    }
};

module.exports = Demo;

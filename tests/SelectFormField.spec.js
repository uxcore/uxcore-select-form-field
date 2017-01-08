import expect from 'expect.js';
import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import $ from 'jquery';
import { render, ReactDOM, findDOMNode, unmountComponentAtNode } from 'react-dom';
import Form from 'uxcore-form/build/Form';

const { Constants } = Form;

import SelectFormField from '../src';
const Option = SelectFormField.Option;

describe('SelectFormField', () => {

  it('jsxshowSearch', (done) => {
    const wrapper = mount(<Form><SelectFormField jsxshowSearch={true} jsxname="test" jsxlabel="test" /></Form>);
    expect(wrapper.find('SelectFormField').props().jsxshowSearch).to.equal(true);
    done();
  });

  it('beforeFetch', (done) => {
      const wrapper = mount(
        <Form>
          <SelectFormField 
            jsxshowSearch={true} 
            jsxname="test" 
            jsxlabel="test"
            jsxfetchUrl="http://eternalsky.me:8122/file/getGridJson.jsonp"
            beforeFetch={(data) => {
              if (data.q == undefined) {
                  data.q = "a";
              }
              expect(JSON.stringify(data)).to.be(JSON.stringify({ q: 'a'}));
              done();
            }} 
          />
        </Form>
      );
  });

  it('afterFetch', (done) => {
      const wrapper = mount(
        <Form>
          <SelectFormField 
            jsxshowSearch={true} 
            jsxname="test" 
            jsxlabel="test"
            jsxfetchUrl="http://suggest.taobao.com/sug"
            dataType="jsonp"
            beforeFetch={(data) => {
              if (data.q == undefined) {
                  data.q = "a";
              }
              return data;
            }}
            afterFetch={(obj) => {
              let data = {};
              obj.result.forEach((item, index) => {
                  data[item[1]] = item[0];
              });

              expect(data).to.not.be.empty();
              done();
            }} 
          />
        </Form>
      );
  });
    
  it('jsxdata', (done) => {
      const data = {
        'bj':'北京',
        'sh':'上海'
      };
      const wrapper = mount(
        <Form>
          <SelectFormField 
            jsxshowSearch={true} 
            jsxname="test" 
            jsxlabel="test"
            jsxdata={data}
          />
        </Form>
      );
      expect(JSON.stringify(wrapper.find('SelectFormField').props().jsxdata)).to.be(JSON.stringify({'bj':'北京','sh':'上海'}));
      done();
  });

  it('searchDelay', (done) => {
      let testData = 'test';
      const wrapper = mount(
        <Form>
          <SelectFormField 
            jsxshowSearch={true} 
            jsxname="test" 
            jsxlabel="test"
            jsxfetchUrl="http://eternalsky.me:8122/file/getGridJson.jsonp"
            searchDelay={100}
            onSelect={(data) => {
              testData = 'test2';
            }}
          />
        </Form>
      );
      wrapper.find('SelectFormField').props().onSelect();
      setTimeout(function() {
        expect(testData).to.be('test2');
        done();
      }, wrapper.find('SelectFormField').props().searchDelay);  
  });

  it('handleChange', (done) => {
    const data = {
      'bj':'北京',
      'sh':'上海'
    };

    const wrapper = mount(
      <Form jsxonChange={(value,name) => {
        expect(value.test).to.be.equal('bj');
        expect(name).to.be.equal('test');
      }}>
        <SelectFormField 
          jsxshowSearch={true} 
          jsxname="test" 
          jsxlabel="test"
          jsxdata={data}
          handleDataChange={(value,fromReset,label) => {}}
          onChange={(value,label) => {}}
        />
      </Form>
    );
    wrapper.find('SelectFormField').find('.kuma-select2-arrow').simulate('click');
    const dropdownWrapper = mount(wrapper.find('SelectFormField').find('Trigger').node.getComponent());
    dropdownWrapper.find('li').at(0).simulate('click');
    wrapper.find('SelectFormField').props().onChange('bj','北京');
    done();
  })

  it('jsxmode', (done) => {

    const wrapper = mount(
      <Form jsxvalues={{test:'bj'}}>
        <SelectFormField 
          jsxmode={Constants.MODE.VIEW}
          jsxshowSearch={true} 
          jsxname="test" 
          jsxlabel="test"
        >
          <Option value="bj">北京</Option>
          <Option value="sh">上海</Option>
        </SelectFormField>
      </Form>
    );
    expect(wrapper.find('SelectFormField').find('.view-mode').find('.kuma-uxform-field-core').find('span').text()).to.be.equal('北京 ');
    done();
  })


  it('componentWillReceiveProps', (done) => {
    const data = {
      'bj':'北京',
      'sh':'上海'
    };

    const data2 = {
      'bj':'北京',
      'sh':'上海',
      'sz':'深圳'
    };

    const wrapper = mount(
      <Form>
        <SelectFormField 
          jsxshowSearch={true} 
          jsxname="test" 
          jsxlabel="test"
          jsxdata={data}
        />
      </Form>
    );

    wrapper.setProps({jsxdata:data2});
    expect(JSON.stringify(wrapper.props().jsxdata)).to.be(JSON.stringify({'bj':'北京','sh':'上海','sz':'深圳'}));
    done();
  })

  it('transferDataToObj', (done) => {
    const data = {
      'bj':'北京',
      'sh':'上海'
    };

    const wrapper = mount(
      <Form jsxvalues={{test:'sh'}}>
        <SelectFormField 
          jsxmode={Constants.MODE.VIEW}
          jsxshowSearch={true} 
          jsxname="test" 
          jsxlabel="test"
          jsxdata={data}
        />
      </Form>
    );

    expect(wrapper.find('SelectFormField').find('.view-mode').find('.kuma-uxform-field-core').find('span').text()).to.be.equal('上海 ');
    done();
  })

  // it('handleDataChange', (done) => {
  //   const data = {
  //     'bj':'北京',
  //     'sh':'上海'
  //   };

  //   const wrapper = mount(
  //     <Form >
  //       <SelectFormField 
  //         jsxshowSearch={true} 
  //         jsxname="test" 
  //         jsxlabel="test"
  //         jsxdata={data}
  //         handleDataChange={(value,false,label) => {}}
  //         onChange={(value,label) => {}}
  //       />
  //     </Form>
  //   );
  //   wrapper.find('SelectFormField').props().onChange('bj','北京');
  // })

  // wrapper.find('SelectFormField').find('.kuma-select2-arrow').simulate('click');
  // const dropdownWrapper = mount(wrapper.find('SelectFormField').find('Trigger').node.getComponent());
  // expect(dropdownWrapper.find('li').at(0).text()).to.be.equal('北京');

});
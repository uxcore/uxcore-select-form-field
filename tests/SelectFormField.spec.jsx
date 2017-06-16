import expect from 'expect.js';
import React from 'react';
import { mount } from 'enzyme';
import Form from 'uxcore-form/build/Form';
import SelectFormField from '../src';

const { Constants } = Form;

const { Option } = SelectFormField;

describe('SelectFormField', () => {
  it('jsxshowSearch', (done) => {
    const wrapper = mount(
      <Form><SelectFormField jsxshowSearch jsxname="test" jsxlabel="test" /></Form>
    );
    expect(wrapper.find('SelectFormField').props().jsxshowSearch).to.equal(true);
    done();
  });

  it('jsxdata', (done) => {
    const data = {
      bj: '北京',
      sh: '上海',
    };
    const wrapper = mount(
      <Form>
        <SelectFormField
          jsxshowSearch
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
        />
      </Form>
      );
    expect(JSON.stringify(wrapper.find('SelectFormField').props().jsxdata)).to.be(JSON.stringify({ bj: '北京', sh: '上海' }));
    done();
  });

  it('searchDelay', (done) => {
    let testData = 'test';
    const wrapper = mount(
      <Form>
        <SelectFormField
          jsxshowSearch
          jsxname="test"
          jsxlabel="test"
          jsxfetchUrl="http://eternalsky.me:8122/file/getGridJson.jsonp"
          searchDelay={100}
          onSelect={() => {
            testData = 'test2';
          }}
        />
      </Form>
      );
    wrapper.find('SelectFormField').props().onSelect();
    setTimeout(() => {
      expect(testData).to.be('test2');
      done();
    }, wrapper.find('SelectFormField').props().searchDelay);
  });

  it('handleChange', (done) => {
    const data = {
      bj: '北京',
      sh: '上海',
    };

    const wrapper = mount(
      <Form
        jsxonChange={(value, name) => {
          expect(value.test).to.be.equal('bj');
          expect(name).to.be.equal('test');
        }}
      >
        <SelectFormField
          jsxshowSearch
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
        />
      </Form>
    );
    wrapper.find('SelectFormField').find('.kuma-select2-arrow').simulate('click');
    const dropdownWrapper = mount(wrapper.find('SelectFormField').find('Trigger').node.getComponent());
    dropdownWrapper.find('li').at(0).simulate('click');
    done();
  });

  it('jsxmode', (done) => {
    const wrapper = mount(
      <Form jsxvalues={{ test: 'bj' }}>
        <SelectFormField
          jsxmode={Constants.MODE.VIEW}
          jsxshowSearch
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
  });


  it('componentWillReceiveProps', (done) => {
    const data = {
      bj: '北京',
      sh: '上海',
    };

    const data2 = {
      bj: '北京',
      sh: '上海',
      sz: '深圳',
    };

    const wrapper = mount(
      <Form>
        <SelectFormField
          jsxshowSearch
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
        />
      </Form>
    );

    wrapper.setProps({ jsxdata: data2 });
    expect(JSON.stringify(wrapper.props().jsxdata)).to.be(JSON.stringify({ bj: '北京', sh: '上海', sz: '深圳' }));
    done();
  });

  it('transferDataToObj', (done) => {
    const data = {
      bj: '北京',
      sh: '上海',
    };

    const wrapper = mount(
      <Form jsxvalues={{ test: 'sh' }}>
        <SelectFormField
          jsxmode={Constants.MODE.VIEW}
          jsxshowSearch
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
        />
      </Form>
    );

    expect(wrapper.find('SelectFormField').find('.view-mode').find('.kuma-uxform-field-core').find('span').text()).to.be.equal('上海 ');
    done();
  });

  it('should show key if label is not found in jsxdata mode', () => {
    const data = {
      bj: '北京',
      sh: '上海',
    };
    const wrapper = mount(
      <SelectFormField
        standalone
        jsxmode={Constants.MODE.VIEW}
        jsxdata={data}
        value="*"
      />
    );
    expect(wrapper.find('.view-mode').find('.kuma-uxform-field-core').find('span').text()).to.be.equal('* ');
  });

  it('should show key if label is not found in Option mode', () => {
    const wrapper = mount(
      <SelectFormField
        standalone
        jsxmode={Constants.MODE.VIEW}
        value="*"
      >
        <Option key="bj">北京</Option>
        <Option key="nj">南京</Option>
      </SelectFormField>
    );
    expect(wrapper.find('.view-mode').find('.kuma-uxform-field-core').find('span').text()).to.be.equal('*');
  });

  it('should show key if label is not found in search mode', () => {
    const wrapper = mount(
      <SelectFormField
        standalone
        jsxmode={Constants.MODE.VIEW}
        value={{ key: '*' }}
        onSearch={() => {}}
      >
        <Option key="bj">北京</Option>
        <Option key="nj">南京</Option>
      </SelectFormField>
    );
    expect(wrapper.find('.view-mode').find('.kuma-uxform-field-core').find('span').text()).to.be.equal('*');
  });
});

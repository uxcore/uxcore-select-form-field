import expect from 'expect.js';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Form from 'uxcore-form/build/Form';
import SelectFormField from '../src';

const { Constants } = Form;

const { Option } = SelectFormField;

Enzyme.configure({ adapter: new Adapter() });

describe('SelectFormField', () => {
  it('should support default lables with safe locales', () => {
    const data = [
      { key: 'bj', label: '北京' },
      { key: 'sh', label: '上海' },
    ];
    const wrapper = mount(
      <Form>
        <SelectFormField
          locale="xx-xx"
          jsxshowSearch
          onSearch={() => { }}
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
        />
      </Form>,
    );
    expect(wrapper.find('.kuma-select2-selection__placeholder').text()).to.be('请下拉选择');
  });

  it('should support default lables', () => {
    const data = [
      { key: 'bj', label: '北京' },
      { key: 'sh', label: '上海' },
    ];
    const wrapper = mount(
      <Form>
        <SelectFormField
          locale="en"
          jsxshowSearch
          onSearch={() => { }}
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
        />
      </Form>,
    );
    expect(wrapper.find('.kuma-select2-selection__placeholder').text()).to.be('Please select');
  });

  it('should support value is {key, label}', () => {
    const data = [
      { key: 'bj', label: '北京' },
      { key: 'sh', label: '上海' },
    ];
    const wrapper = mount(
      <Form jsxvalues={{ test: { key: 'bj' } }}>
        <SelectFormField
          jsxshowSearch
          onSearch={() => {}}
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
        />
      </Form>,
    );
    expect(wrapper.find('.kuma-select2-selection-selected-value').text()).to.be('北京');
  });

  it('should support value is {value, text}', () => {
    const data = [
      { key: 'bj', label: '北京' },
      { key: 'sh', label: '上海' },
    ];
    const wrapper = mount(
      <Form jsxvalues={{ test: { value: 'bj' } }}>
        <SelectFormField
          jsxshowSearch
          onSearch={() => {}}
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
        />
      </Form>,
    );
    expect(wrapper.find('.kuma-select2-selection-selected-value').text()).to.be('北京');
  });

  it('should support value is [{key, label}] when multiple', () => {
    const data = [
      { key: 'bj', label: '北京' },
      { key: 'sh', label: '上海' },
    ];
    const wrapper = mount(
      <Form jsxvalues={{ test: [{ key: 'bj' }] }}>
        <SelectFormField
          jsxshowSearch
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
          onSearch
          multiple
        />
      </Form>,
    );
    expect(wrapper.find('.kuma-select2-selection__choice__content').at(0).text()).to.be('北京');
  });

  it('should support value is [{value, text}] when multiple', () => {
    const data = [
      { key: 'bj', label: '北京' },
      { key: 'sh', label: '上海' },
    ];
    const wrapper = mount(
      <Form jsxvalues={{ test: [{ value: 'bj' }] }}>
        <SelectFormField
          jsxshowSearch
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
          onSearch
          multiple
        />
      </Form>,
    );
    expect(wrapper.find('.kuma-select2-selection__choice__content').at(0).text()).to.be('北京');
  });

  it('should support jsxdata is {key, label}', () => {
    const data = [
      { key: 'bj', label: '北京' },
      { key: 'sh', label: '上海' },
    ];
    const wrapper = mount(
      <Form>
        <SelectFormField
          jsxshowSearch
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
        />
      </Form>,
    );
    wrapper.find('SelectFormField').find('.kuma-select2').simulate('click');
    const dropdownWrapper = mount(wrapper.find('SelectFormField').find('Trigger').instance().getComponent());
    expect(dropdownWrapper.find('li').at(0).text()).to.be('北京');
  });
  it('should support jsxdata is {value, text}', () => {
    const data = [
      { value: 'bj', text: '北京' },
      { value: 'sh', text: '上海' },
    ];
    const wrapper = mount(
      <Form>
        <SelectFormField
          jsxshowSearch
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
        />
      </Form>,
    );
    wrapper.find('SelectFormField').find('.kuma-select2').simulate('click');
    const dropdownWrapper = mount(wrapper.find('SelectFormField').find('Trigger').instance().getComponent());
    expect(dropdownWrapper.find('li').at(0).text()).to.be('北京');
  });

  it('should support handleChange', (done) => {
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
      </Form>,
    );
    wrapper.find('SelectFormField').find('.kuma-select2-arrow').simulate('click');
    const dropdownWrapper = mount(wrapper.find('SelectFormField').find('Trigger').instance().getComponent());
    dropdownWrapper.find('li').at(0).simulate('click');
    done();
  });

  it('should return {key, label} in onChange searchMode ', (done) => {
    const data = {
      bj: '北京',
      sh: '上海',
    };

    const wrapper = mount(
      <Form
        jsxonChange={(value, name) => {
          expect(JSON.stringify(value.test)).to.be.equal(JSON.stringify({ key: 'bj', label: '北京' }));
          expect(name).to.be.equal('test');
        }}
      >
        <SelectFormField
          jsxshowSearch
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
          onSearch={() => {}}
        />
      </Form>,
    );
    wrapper.find('SelectFormField').find('.kuma-select2-arrow').simulate('click');
    const dropdownWrapper = mount(wrapper.find('SelectFormField').find('Trigger').instance().getComponent());
    dropdownWrapper.find('li').at(0).simulate('click');
    done();
  });


  it('should return {value, text} in onChange searchMode if useValueText', (done) => {
    const data = {
      bj: '北京',
      sh: '上海',
    };

    const wrapper = mount(
      <Form
        jsxonChange={(value, name) => {
          expect(JSON.stringify(value.test)).to.be.equal(JSON.stringify({ value: 'bj', text: '北京' }));
          expect(name).to.be.equal('test');
        }}
      >
        <SelectFormField
          jsxshowSearch
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
          useValueText
          onSearch={() => {}}
        />
      </Form>,
    );
    wrapper.find('SelectFormField').find('.kuma-select2-arrow').simulate('click');
    const dropdownWrapper = mount(wrapper.find('SelectFormField').find('Trigger').instance().getComponent());
    dropdownWrapper.find('li').at(0).simulate('click');
    done();
  });

  it('should render correctly in view mode', (done) => {
    const wrapper = mount(
      <Form jsxvalues={{ test: 'bj' }}>
        <SelectFormField
          jsxmode={Constants.MODE.VIEW}
          jsxshowSearch
          jsxname="test"
          jsxlabel="test"
        >
          <Option value="bj">
            北京
          </Option>
          <Option value="sh">
            上海
          </Option>
        </SelectFormField>
      </Form>,
    );
    expect(wrapper.find('SelectFormField').find('.view-mode').find('.kuma-uxform-field-core').find('span')
      .text()).to.be.equal('北京');
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
        jsxname="test"
        jsxmode={Constants.MODE.VIEW}
        jsxdata={data}
        value="*"
      />,
    );
    expect(wrapper.find('.view-mode').find('.kuma-uxform-field-core').find('span').text()).to.be.equal('*');
  });

  it('should show key if label is not found in Option mode', () => {
    const wrapper = mount(
      <SelectFormField
        standalone
        jsxname="test"
        jsxmode={Constants.MODE.VIEW}
        value="*"
      >
        <Option key="bj">
          北京
        </Option>
        <Option key="nj">
          南京
        </Option>
      </SelectFormField>,
    );
    expect(wrapper.find('.view-mode').find('.kuma-uxform-field-core').find('span').text()).to.be.equal('*');
  });

  it('should show key if label is not found in search mode', () => {
    const wrapper = mount(
      <SelectFormField
        standalone
        jsxname="test"
        jsxmode={Constants.MODE.VIEW}
        value={{ key: '*' }}
        onSearch={() => { }}
      >
        <Option key="bj">
          北京
        </Option>
        <Option key="nj">
          南京
        </Option>
      </SelectFormField>,
    );
    expect(wrapper.find('.view-mode').find('.kuma-uxform-field-core').find('span').text()).to.be.equal('*');
  });

  it('should support getFullData', (done) => {
    let selectInstance;
    const data = {
      bj: '北京',
      sh: '上海',
    };

    const wrapper = mount(
      <Form>
        <SelectFormField
          ref={(select) => {
            selectInstance = select;
            select.resetSelect();
          }}
          jsxshowSearch
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
        />
      </Form>,
    );
    wrapper.find('SelectFormField').find('.kuma-select2-arrow').simulate('click');
    const dropdownWrapper = mount(wrapper.find('SelectFormField').find('Trigger').instance().getComponent());
    dropdownWrapper.find('li').at(0).simulate('click');
    const fundata = selectInstance.getFullData();
    expect(fundata.value).to.be.equal('bj');
    done();
  });

  it('should support getFullData with object parameter', (done) => {
    let selectInstance;
    const data = {
      bj: '北京',
      sh: '上海',
    };

    const wrapper = mount(
      <Form>
        <SelectFormField
          ref={(select) => {
            selectInstance = select;
            select.resetSelect();
          }}
          jsxshowSearch
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
        />
      </Form>,
    );
    wrapper.find('SelectFormField').find('.kuma-select2-arrow').simulate('click');
    const dropdownWrapper = mount(wrapper.find('SelectFormField').find('Trigger').instance().getComponent());
    dropdownWrapper.find('li').at(0).simulate('click');
    const fundata = selectInstance.getFullData({ key: 'sh', label: '上海' });
    expect(fundata.value).to.be.equal('sh');
    done();
  });

  it('should support getFullData with array parameter', (done) => {
    let selectInstance;
    const data = {
      bj: '北京',
      sh: '上海',
    };

    const wrapper = mount(
      <Form>
        <SelectFormField
          ref={(select) => {
            selectInstance = select;
            select.resetSelect();
          }}
          jsxshowSearch
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
        />
      </Form>,
    );
    wrapper.find('SelectFormField').find('.kuma-select2-arrow').simulate('click');
    const dropdownWrapper = mount(wrapper.find('SelectFormField').find('Trigger').instance().getComponent());
    dropdownWrapper.find('li').at(0).simulate('click');
    const fundata = selectInstance.getFullData([
      { key: 'sh', label: '上海' },
      { key: 'bj', label: '北京' },
    ]);
    expect(fundata.length).to.be.equal(2);
    done();
  });

  it('should support getFullData with string parameter', (done) => {
    let selectInstance;
    const data = {
      bj: '北京',
      sh: '上海',
    };

    const wrapper = mount(
      <Form>
        <SelectFormField
          ref={(select) => {
            selectInstance = select;
            select.resetSelect();
          }}
          jsxshowSearch
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
        />
      </Form>,
    );
    wrapper.find('SelectFormField').find('.kuma-select2-arrow').simulate('click');
    const dropdownWrapper = mount(wrapper.find('SelectFormField').find('Trigger').instance().getComponent());
    dropdownWrapper.find('li').at(0).simulate('click');
    const fundata = selectInstance.getFullData('bj');
    expect(fundata.value).to.be.equal('bj');
    done();
  });

  it('should support getFullData with array', (done) => {
    let selectInstance;
    const data = [
      { text: '北京', value: 'bj' },
      { text: '南京', value: 'nj' },
    ];

    const wrapper = mount(
      <Form>
        <SelectFormField
          ref={(select) => {
            selectInstance = select;
          }}
          multiple
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
        />
      </Form>,
    );
    wrapper.find('SelectFormField').find('.kuma-select2-enabled').simulate('click');
    const dropdownWrapper = mount(wrapper.find('SelectFormField').find('Trigger').instance().getComponent());
    dropdownWrapper.find('li').at(0).simulate('click');
    dropdownWrapper.find('li').at(1).simulate('click');
    const fundata = selectInstance.getFullData();
    expect(fundata.length).to.be.equal(2);
    done();
  });

  it('should support renderView', (done) => {
    const data = {
      bj: '北京',
      sh: '上海',
    };

    const wrapper = mount(
      <Form jsxvalues={{ test: 'bj' }} jsxmode={Constants.MODE.VIEW}>
        <SelectFormField
          jsxshowSearch
          jsxname="test"
          jsxlabel="test"
          jsxdata={data}
          renderView={values => values.map(v => v.text).join(', ')}
        />
      </Form>,
    );
    expect(wrapper.find('.view-mode').find('.kuma-uxform-field-core').find('span').text()).to.be.equal('北京');
    done();
  });

  it('should support fetchData', (done) => {
    const wrapper = mount(
      <Form jsxvalues={{ test: 'aj' }}>
        <SelectFormField
          jsxshowSearch
          jsxname="test"
          jsxlabel="test"
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
          renderView={values => values.map(v => v.text).join(', ')}
        />
      </Form>,
    );
    expect(wrapper.find('.kuma-select2-selection-selected-value').text()).to.be.equal('aj');
    const input = wrapper.find('.kuma-select2-search__field');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'aj' } });
    input.simulate('change', { target: { value: 'as' } });
    setTimeout(() => {
      done();
    }, 200);
  });
});

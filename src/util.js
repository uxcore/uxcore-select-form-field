
/**
 * transfer { a: 'A' } to [{value: 'a', text: 'A'}]
 * transfer [{key: 'a', label: 'A'}] to [{value: 'a', text: 'A'}]
 */
const processData = (data) => {
  let values = [];
  if (typeof data === 'object' && !(data instanceof Array)) {
    const keys = Object.keys(data);
    values = keys.map(key => ({
      value: key,
      text: data[key],
      title: data.title || data.label || data.text
    }));
  } else {
    values = data.map((item) => {
      const newItem = {
        ...item,
        value: item.key || item.value,
        text: item.label || item.text,
        title: item.title || item.label || item.text
      };
      ['key', 'label'].forEach((key) => {
        delete newItem[key];
      });
      return newItem;
    });
  }
  return values;
};


/**
 * transfer [{value: 'a', text: 'A'}] to { a: 'A' }
 */
const transferDataToObj = (data) => {
  const obj = {};
  data.forEach((item) => {
    const key = (item.value === '' ? '__all__' : item.value);
    obj[key] = item.text;
  });
  return obj;
};

/**
 * valueProp maybe props.value or key
 */
const getValuePropValue = (child) => {
  let key = '';
  if ('value' in child.props) {
    key = child.props.value;
  } else {
    ({ key } = child);
  }
  return key;
};

export default {
  processData,
  transferDataToObj,
  getValuePropValue,
};

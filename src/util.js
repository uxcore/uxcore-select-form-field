
/**
 * transfer { a: 'A' } to [{value: 'a', text: 'A'}]
 */
const processData = (data) => {
  let values = [];
  if (typeof data === 'object' && !(data instanceof Array)) {
    const keys = Object.keys(data);
    values = keys.map(key =>
      ({
        value: key,
        text: data[key],
      }),
    );
  } else {
    values = data;
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
    key = child.key;
  }
  return key;
};

export default {
  processData,
  transferDataToObj,
  getValuePropValue,
};

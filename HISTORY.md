## 0.4.11
* `CHANGED` add prop optionTextRender; add default dropdownAlign prop value to support tr,br align

## 0.4.10
* `FIXED` fix default value of prop `method`

## 0.4.9

* `NEW` new prop `method`

## 0.4.9

* `NEW` new prop `method`

## 0.4.8

* `CHANGED` filterOption can be overriden,

## 0.4.6

* `CHANGED` use comma splitter in view mode
* `FIXED` getFullData fail to work

## 0.4.5

* `CHANGED` support value is {value, text}
* `CHANGED` support jsxdata is {key, label}
* `NEW` new prop `useValueText`

## 0.4.4

* `CHANGED` pass other data item to Option

## 0.4.0

* `CHANGED` adapt React 16

## 0.3.20

* `CHANGED` new api getFullData

## 0.3.19

* `FIXED` jsxonChange cannot fire correctly 

## 0.3.16

* `CHANGED` jsxdata support `disabled`

## 0.3.15

* `CHANGED` remove deprecated warning

## 0.3.14

* `CHANGED` remove the weird logic that value can not be set if combobox is true.

## 0.3.12

* `CHANGED` fit React@15

## 0.3.11

* `CHANGED` pass prop `size`

## 0.3.10

* `CHANGED` use `FormField` original `handleDataChange`

## 0.3.8

* `CHANGED` pass prop `onFocus`, `onBlur` to Select

## 0.3.7

* `FIXED` fetchData when didMount fails to work

## 0.3.6

* `FIXED` value cannot be reset by null

## 0.3.4

* `CHANGED` fetchData when url is changed

## 0.3.3

* `CHANGED` add new prop `closeOnSelect`

## 0.3.2

* `CHANGED` update `uxcore-form-field` to ~0.2.0

## 0.3.1

* `CHANGED` show key if label is not found in view mode

## 0.3.0

* `CHANGED` update `uxcore-select2` to ~0.4.0

## 0.2.4

* `FIXED` me.props.handleDataChange is not silent when value change. 

## 0.2.2

* `CHANGED` replace method name generateOptionsFromData with _generateOptionsFromData to fix SearchFormField bug

## 0.2.1

* `CHANGED` jQuery free
* `CHANGED` abort search request if next request is called.
* `NEW` add new prop `searchDelay` to debounce search action.

## 0.2.0

* `CHANGED` update dependecy `uxcore-select2` to ~0.3.0

## 0.1.10

* `CHANGED` componentWillReceiveProps do not trigger form onChange

## 0.1.9

* `CHANGED` pass `labelInValue` to Select 

## 0.1.8

* `FIX` fix server render bug

## 0.1.7

* `FIX` fix view mode bug in only jsxdata mode.

## 0.1.6

* `NEW` prop `jsxdata` support array like [{value: xxx, text: xxx}]

## 0.1.5

* `CHANGED` add defaultProps in `prototype.js`

## 0.1.4

* `FIX` fix bug in view mode
* `CHANGED` remove the <span> wrapper in single mode

## 0.1.3

* `CHANGED` add `canDropto` in `prototype`

## 0.1.2

* `NEW` add visual engine support
import i18n from 'utils/i18n';
const defaultField = {
  businessSelected: false,
  columns: 2,
  enable: true,
  fieldType: 'text',
  // 'defaultValue': '',
  // 'key': 'contactsName',
  // 'label': '姓名',
  longField: false,
  // 'orderNo': 1,
  overuse: false,
  readonly: false,
  searchable: false,
  sensitive: false,
  // 'size': 500,
  sysDefault: false,
  unique: false,
  validateType: {
    required: false
  }
  // 'optionList': [
  //   {
  //     'label': '男',
  //     'value': 'Male'
  //   },
  //   {
  //     'label': '女',
  //     'value': 'Female'
  //   }
  // ],
};

export default fields => {
  const fieldsArr = [];
  // handle arg like [{key, value, fieldType}, ...]
  if (Array.isArray(fields)) {
    return fields.map((field, i) => {
      const addition = {
        orderNo: i + 1
      };
      return Object.assign({}, defaultField, field, addition);
    });
  }
  // handle arg like {[key]: {label, fieldType}, ...}
  for (let i in fields) {
    let field = fields[i];
    if (field === undefined) {
      //方便处理开关某些选项时的顺序问题
      continue;
    }
    const addition = {
      key: i,
      orderNo: fieldsArr.length + 1
    };
    const complitedField = Object.assign({}, defaultField, field, addition);
    fieldsArr.push(complitedField);
  }
  return fieldsArr;
};

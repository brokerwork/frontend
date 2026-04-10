import { validate } from 'components/CustomField';
import { Message } from 'lean-ui';
import i18n from './i18n';
const fieldTypeEditTypeMap = {
  text: 'input',
  radio: 'radio',
  select: 'dropdown',
  checkbox: 'checkbox'
};

// cb是完成修改操作之后关闭popover的callback
const onSubmit = (field, initValue, onSuccess, lastChange, cb) => {
  const fieldType = field && field.fieldType;
  let value;
  let errors;
  if (fieldType && fieldTypeEditTypeMap[fieldType]) {
    switch (fieldType) {
      case 'select':
      case 'text':
        value = lastChange;
        break;
      default:
        value = lastChange;
    }
  }
  if (typeof value !== undefined && value !== initValue) {
    errors = validate(
      { [field.key]: value },
      { fields: [field] } //后端后续将返回validateType
      // { fields: [{ ...field, validateType: { required: true } }] }
    );
  }

  if (errors && errors[field.key]) {
    Message.error(errors[field.key]);
  } else {
    onSuccess(value, cb);
  }
};

export default (field, value, onSuccess) => {
  const fieldType = field && field.fieldType;
  if (fieldType && fieldTypeEditTypeMap[fieldType]) {
    const type = fieldTypeEditTypeMap[fieldType];
    let attrs = {};
    switch (fieldType) {
      case 'select':
        attrs = {
          options: field.optionList,
          defaultValue: value
        };
        break;
      case 'text':
        attrs = { defaultValue: value };
      default:
        attrs = { defaultValue: value };
        break;
    }
    return {
      type,
      name: field.key,
      onSubmit: onSubmit.bind(this, field, value, onSuccess),
      okText: i18n['general.modify'],
      cancelText: i18n['general.cancel'],
      ...attrs
    };
  }
};

//lean-ui 对于各种type的处理方式
// case "input":
//       Component = <Input {...other} />;
//       break;

//     case "dopdown":
//       Component = <Menu onSelect={onChange} onDeselect={onChange} {...other} />;
//       break;

//     case "radio":
//       Component = <Radio onChange={onChange} {...other} />;
//       break;

//     case "checkbox":
//       Component = <Checkbox onChange={onChange} {...other} />;
//       break;

//     default:
//       Component = null;
//       break;

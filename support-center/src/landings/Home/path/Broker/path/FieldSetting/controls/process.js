import i18n from "utils/i18n";
import { SubmissionError } from "redux-form";
import language from 'utils/language';
const currentLang = language.getLang();

export const relationOptions = (
  relationFieldList,
  selectedField = { options: [] }
) => {
  let selfSeletedOptions = [];
  // 同一个字段设置下的已关联字段是可选择
  if (selectedField.options && selectedField.options.length) {
    selectedField.options.forEach(t => {
      if (t.relationField) selfSeletedOptions.push(t.relationField);
    });
  }

  return [
    { label: i18n["general.default_select"], value: -1 },
    ...relationFieldList.map(item => {
      item.disabled =
        selfSeletedOptions.length && selfSeletedOptions.includes(item.fieldId)
          ? false
          : !item.enable || item.relation || item.relationFunc;
      return item;
    })
  ];
};

export const relationFuncCancel = values => {
  const val = JSON.parse(JSON.stringify(values));
  if (!val.relationFunc) {
    const { options = [] } = val;
    let end = [];
    end = options.map(o => {
      delete o.relationField;
      delete o.relationFieldForList;
      return o;
    });
    val.options = end;
  }
  return val;
};

export const defaultSelectGenerator = (options = []) => {
  let defaultSelect = -1;
  if (options && options.length) {
    let index = options.findIndex(item => item.isDefault);
    if (index >= 0) {
      defaultSelect = index;
    }
  }
  return defaultSelect;
};

export const defaultSelectProcess = (values = {}) => {
  if (values.options && values.options.length && values.defaultSelect >= 0) {
    values.options.forEach(o => {
      o.isDefault = false;
    });
    if (typeof values.defaultSelect === 'number') {
      values.options[values.defaultSelect].isDefault = true;
    }
  }

  if (values.options && values.defaultSelect === -1) {
    values.options.forEach((o = {}) => {
      o.isDefault = false;
    });
  }
  return values;
};

export const errorThrower = (values = {}) => {
  if (!values.options || !values.options.length) return;
  let errors = {};
  errors.options = [];
  // 关联字段
  let haveSelect = false;
  if (values.relationFunc) {
    values.options.forEach(o => {
      if (o.relationField) {
        haveSelect = true;
      }
    });
    if (!haveSelect) {
      errors.options[0] = {};
      errors.options[0].relationField = i18n["field.setting.field-list.least"];
      throw new SubmissionError(errors);
    }
  }

  // 选项内容
  let haveContent = [];
  values.options.forEach(o => {
    let copy;
    if (o === null || o === undefined) {
      copy = {
        message: {}
      };
    } else {
      copy = o;
    }
    haveContent.push(!!Object.values(copy.message || {}).join("").length);
  });
  const isContentError = haveContent.some(c => c === false);
  if (isContentError) {
    values.options.forEach((o, index) => {
      if (!haveContent[index]) {
        errors.options[index] = Object.assign({}, errors.options[index] || {}, {
          message: {
            [currentLang]: i18n["field.setting.field-content.least"]
          }
        });
      }
    });
    throw new SubmissionError(errors);
  }
};

import { MULTI_FIELD_TYPES } from './contants';

export const getRelationFields = fields => {
  const result = fields.reduce(
    (res, item) => {
      const { topFields, fieldMap } = res;
      const isTop = !item.relation;
      const isRelation = item.relation || item.relationFunc;
      if (isTop) {
        topFields.push(item);
      }
      fieldMap[item.key] = item;
    },
    {
      topFields: [], //第一级的field包括非关系的和关系顶层的
      fieldMap: {}
    }
  );
};

export const getArrayFieldDefaultValue = field => {
  const fieldType = field.fieldType;
  const isText = ['text', 'textarea'].includes(fieldType);
  const defaultTinValue = { countryCode: '', tin: '' };
  return isText ? '' : fieldType === 'tin' ? defaultTinValue : undefined;
};

export const isArrayField = field => {
  return (
    (field.userCustom && MULTI_FIELD_TYPES.includes(field.fieldType)) ||
    field.fieldType === 'tin'
  );
};

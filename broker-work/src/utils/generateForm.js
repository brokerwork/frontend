import { reduxForm } from 'redux-form';

export default ({ fields, initialValues, ...options }) => Components => {
  const initialValuesFromFields = fields.reduce((obj, item) => {
    if (typeof item.defaultValue !== 'undefined') {
      obj[item.key] = item.defaultValue;
    }
    return obj;
  }, {});
  const _initialValues = Object.assign(initialValuesFromFields, initialValues);
};

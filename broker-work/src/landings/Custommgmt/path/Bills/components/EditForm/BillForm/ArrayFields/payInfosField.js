import cs from '../index.less';
import i18n from 'utils/i18n';
import { reduxForm, Field, FieldArray } from 'redux-form';
import {
  stylePropsInput,
  stylePropsDropDown,
  stylePropsDatePicker
} from '../index';
import { renderField, required } from 'utils/renderField';
import ToggleField from '../ToggleField';
import { Button } from 'lean-ui';

const renderSubFields = (options, pay, index, fields) => (
  <div
    key={index}
    className={`${cs['payment-input-group']} ${
      options.justForm ? cs['payment-disabled'] : ''
    }`}
  >
    <ToggleField
      name={`${pay}.name`}
      component={renderField}
      type="textField"
      {...stylePropsInput}
      disabled={options.justForm}
    />
    <ToggleField
      name={`${pay}.info`}
      component={renderField}
      type="textField"
      {...stylePropsInput}
      disabled={options.justForm}
    />
    {options.justForm ? (
      undefined
    ) : (
      <i
        className="fa fa-times"
        onClick={() => {
          fields.remove(index);
        }}
      />
    )}
  </div>
);

export default ({ fields, justForm }) => {
  return (
    <div className={cs['section']}>
      <div className={cs['block-title']}>
        <div className={cs['title-text']}>
          {i18n['customer.bill.payment_information']}
        </div>
        {justForm ? (
          undefined
        ) : (
          <div className={cs['title-tools']}>
            <Button type="primary" onClick={() => fields.push({})}>
              {i18n['customer.detail.create']}
            </Button>
          </div>
        )}
      </div>
      <div className={cs['payment-info']}>
        {fields.map(renderSubFields.bind(this, { justForm }))}
      </div>
    </div>
  );
};

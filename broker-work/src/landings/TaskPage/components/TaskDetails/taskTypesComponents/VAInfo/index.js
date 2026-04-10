import CustomField, { validate } from 'components/v2/CustomField';
import { Field, reduxForm } from 'redux-form';
import i18n from 'utils/i18n';
import { Form } from 'lean-ui';
import { renderField, required } from 'utils/v2/renderField';
import { BANK_LIST, CURRENCY_LIST } from './constants';

export const VA_INFO_FORM = 'VA_INFO_FORM';

const RForm = reduxForm({
  form: VA_INFO_FORM,
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  },
  validate: function(values, props) {
    const customeErrors = validate(values, props);
    const errors = {};

    return Object.assign({}, customeErrors, errors);
  }
})(({ fields, disabled }) => {
  return (
    <CustomField disabled={disabled} fields={fields}>
      <Form.Item col={2} required>
        <Form.Label>{i18n['task.details.vainfo.name']}: </Form.Label>
        <Form.Control>
          <Field
            name="name"
            component={renderField}
            type="textField"
            validate={required}
            disabled={disabled}
          />
        </Form.Control>
      </Form.Item>
      <Form.Item col={2} required>
        <Form.Label>{i18n['task.details.vainfo.email']}: </Form.Label>
        <Form.Control>
          <Field
            name="email"
            component={renderField}
            type="textField"
            validate={required}
            disabled={disabled}
          />
        </Form.Control>
      </Form.Item>
      <Form.Item col={2} required>
        <Form.Label>{i18n['task.details.vainfo.bankName']}: </Form.Label>
        <Form.Control>
          <Field
            name="bankName"
            component={renderField}
            type="selectField"
            validate={required}
            options={BANK_LIST}
            disabled={disabled}
          />
        </Form.Control>
      </Form.Item>
      <Form.Item col={2} required>
        <Form.Label>{i18n['task.details.vainfo.currency']}: </Form.Label>
        <Form.Control>
          <Field
            name="currency"
            component={renderField}
            type="selectField"
            validate={required}
            options={CURRENCY_LIST}
            disabled={disabled}
          />
        </Form.Control>
      </Form.Item>
      <Form.Item col={2} required>
        <Form.Label>{i18n['task.details.vainfo.accountType']}: </Form.Label>
        <Form.Control>
          <Field
            name="accountType"
            component={renderField}
            type="textField"
            validate={required}
            disabled={true}
          />
        </Form.Control>
      </Form.Item>
      <Form.Item col={1} required>
        <Form.Label>{i18n['task.details.vainfo.comment']}: </Form.Label>
        <Form.Control>
          <Field
            name="comment"
            component={renderField}
            type="textField"
            validate={required}
            disabled={disabled}
          />
        </Form.Control>
      </Form.Item>
    </CustomField>
  );
});

export default class VAInfo extends Component {
  onSubmitFail = data => {
    const { onFail } = this.props;
    if (onFail) onFail(data);
  };

  onSubmit = data => {
    return { virtualAccountInfo: data };
  };

  onSubmitSuccess = data => {
    const { onSubmitSuccess } = this.props;
    if (onSubmitSuccess) onSubmitSuccess(data);
  };

  render() {
    const { initialValues, disabled } = this.props;
    return (
      <RForm
        fields={[]}
        // onSubmitFail={this.onSubmitFail}
        onSubmitSuccess={this.onSubmitSuccess}
        onSubmit={this.onSubmit}
        initialValues={initialValues}
        disabled={disabled}
      />
    );
  }
}

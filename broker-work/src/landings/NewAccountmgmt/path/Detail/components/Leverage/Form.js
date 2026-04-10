import { reduxForm, Field } from 'redux-form';
import { Form, Button } from 'lean-ui';
import { renderField, required } from 'utils/v2/renderField';
import i18n from 'utils/i18n';
import cs from './Leverage.less';

export const LEVERAGE_FORM = 'ACCOUNT_DETAIL_LEVERAGE_FORM';

class LeverageForm extends PureComponent {
  render() {
    const {
      disabled,
      resources: { leverage },
      handleSubmit
    } = this.props;

    return (
      <Form>
        <Form.Item required col="1">
          <Form.Label>
            {i18n['account.modify_leverage.label.modify_leverage']}
          </Form.Label>
          <Form.Control>
            <Field
              name="leverage"
              component={renderField}
              className={cs['select']}
              columns={8}
              disabled={disabled}
              type="selectField"
              options={leverage}
              validate={required}
              label={i18n['account.modify_leverage.value.modify_leverage']}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item col="1">
          <Form.Label>
            {i18n['account.modify_leverage.label.send_email']}
          </Form.Label>
          <Form.Control>
            <Field
              name="sendEmail"
              component={renderField}
              columns={8}
              disabled={disabled}
              type="switchField"
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: LEVERAGE_FORM,
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
  enableReinitialize: true
})(LeverageForm);

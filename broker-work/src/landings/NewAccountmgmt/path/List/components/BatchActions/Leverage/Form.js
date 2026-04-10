import { reduxForm, Field } from 'redux-form';
import { Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import { renderField, required } from 'utils/renderField';
import i18n from 'utils/i18n';
import cs from './Leverage.less';

export const LEVERAGE_FORM = 'ACCOUNT_LIST_LEVERAGE_FORM';

class LeverageForm extends PureComponent {
  render() {
    const { disabled, resources: { leverage } } = this.props;

    return (
      <Form horizontal>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={4} className={cs['label']}>
            <span className="required" />
            {i18n['account.modify_leverage.label.modify_leverage']}
          </Col>
          <Field
            name="leverage"
            component={renderField}
            className={cs['dropdown']}
            columns={8}
            disabled={disabled}
            type="selectField"
            options={leverage}
            validate={required}
            label={i18n['account.modify_leverage.value.modify_leverage']}
          />
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={4} className={cs['label']}>
            {i18n['account.modify_leverage.label.send_email']}
          </Col>
          <Field
            name="sendEmail"
            component={renderField}
            columns={8}
            disabled={disabled}
            type="singleCheckboxField"
          />
        </FormGroup>
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
  }
})(LeverageForm);

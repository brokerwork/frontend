import { reduxForm, Field } from 'redux-form';
import { Form, FormGroup, Col, ControlLabel, Button } from 'react-bootstrap';
import { renderField, required } from 'utils/renderField';
import i18n from 'utils/i18n';
import cs from './Leverage.less';

export const CBROKER_LEVERAGE_FORM = 'ACCOUNT_LIST_CBROKER_LEVERAGE_FORM';

const isLessThanMaxLeverage = (value, allValues) => {
  return parseFloat(value) > parseFloat(allValues['maxLeverage'])
    ? i18n['account.cbroker.leverage.max_error_tips']
    : undefined;
};

class LeverageForm extends PureComponent {
  render() {
    const { disabled, resources: { leverage, maxLeverage } } = this.props;

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
            validate={[required, isLessThanMaxLeverage]}
            label={i18n['account.modify_leverage.value.modify_leverage']}
          />
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={4} className={cs['label']}>
            <span className="required" />
            {i18n['account.cbroker.label.max_leverage']}
          </Col>
          <Field
            name="maxLeverage"
            component={renderField}
            className={cs['dropdown']}
            columns={8}
            disabled={disabled}
            type="selectField"
            options={maxLeverage}
            validate={required}
            label={i18n['account.cbroker.value.max_leverage']}
          />
        </FormGroup>
      </Form>
    );
  }
}

export default reduxForm({
  form: CBROKER_LEVERAGE_FORM,
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

import { reduxForm, Field } from 'redux-form';
import { Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import { renderField, required } from 'utils/renderField';
import i18n from 'utils/i18n';
import cs from './Credit.less';

export const CREDIT_FORM = 'ACCOUNT_LIST_CREDIT_FORM';

const typeList = [
  {
    label: i18n['account.edit_account_credit.in'],
    value: 'CREDIT_IN'
  },
  {
    label: i18n['account.edit_account_credit.out'],
    value: 'CREDIT_OUT'
  }
];

class CreditForm extends PureComponent {
  render() {
    const { disabled } = this.props;

    return (
      <Form horizontal>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} className={cs['label']}>
            {i18n['account.edit_account_money.type_label']}
          </Col>
          <Field
            name="type"
            component={renderField}
            disabled={disabled}
            type="radioField"
            radioList={typeList}
          />
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} className={cs['label']}>
            <span className="required" />
            {i18n['account.edit_account_money.amount_label']}
          </Col>
          <Field
            name="amount"
            component={renderField}
            disabled={disabled}
            type="numberField"
            maxLength="15"
            columns={8}
            label={i18n['account.edit_account_money.amount']}
            validate={required}
          />
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} className={cs['label']}>
            {i18n['account.edit_account_credit.send_email_label']}
          </Col>
          <Field
            name="sendEmail"
            component={renderField}
            disabled={disabled}
            type="singleCheckboxField"
          />
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} className={cs['label']}>
            <span className="required" />
            {i18n['account.edit_account_money.remark_label']}
          </Col>
          <Field
            name="comment"
            component={renderField}
            disabled={disabled}
            type="textareaField"
            maxLength="30"
            columns={8}
            label={i18n['account.edit_account_money.remark']}
            validate={required}
          />
        </FormGroup>
      </Form>
    );
  }
}

export default reduxForm({
  form: CREDIT_FORM,
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
})(CreditForm);

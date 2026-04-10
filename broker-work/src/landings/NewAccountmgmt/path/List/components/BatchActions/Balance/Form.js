import { reduxForm, Field } from 'redux-form';
import { Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import { renderField, required } from 'utils/renderField';
import i18n from 'utils/i18n';
import cs from './Balance.less';

export const BALANCE_FORM = 'ACCOUNT_LIST_BALANCE_FORM';

const typeList = [
  {
    label: i18n['account.edit_account_money.deposit'],
    value: 'DEPOSITE'
  },
  {
    label: i18n['account.edit_account_money.withdraw'],
    value: 'WITHDRAWAL'
  },
  { label: i18n['account.batch_deposit'], value: 'excel' },
  { label: i18n['account.batch_widthdraw'], value: 'widthdrawExcel' }
];

class BalanceForm extends PureComponent {
  render() {
    const { disabled, type, filteredRights } = this.props;
    let types = [];
    types = typeList;
    if (!filteredRights.batchWithdraw) {
      types = types.filter(t => t.value !== 'widthdrawExcel');
    }
    if (!filteredRights.batchDeposit) {
      types = types.filter(t => t.value !== 'excel');
    }
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
            radioList={types}
          />
        </FormGroup>
        {type !== 'excel' && type !== 'widthdrawExcel'
          ? [
              <FormGroup key="amount">
                <Col
                  componentClass={ControlLabel}
                  sm={3}
                  className={cs['label']}
                >
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
              </FormGroup>,
              <FormGroup key="sendEmail">
                <Col
                  componentClass={ControlLabel}
                  sm={3}
                  className={cs['label']}
                >
                  {i18n['account.edit_account_money.send_email_label']}
                </Col>
                <Field
                  name="sendEmail"
                  component={renderField}
                  disabled={disabled}
                  type="singleCheckboxField"
                />
              </FormGroup>,
              <FormGroup key="comment">
                <Col
                  componentClass={ControlLabel}
                  sm={3}
                  className={cs['label']}
                >
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
            ]
          : undefined}
      </Form>
    );
  }
}

export default reduxForm({
  form: BALANCE_FORM,
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
})(BalanceForm);

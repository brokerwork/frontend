import { reduxForm, Field } from 'redux-form';
import {
  Form,
  FormGroup,
  Col,
  ControlLabel,
  FormControl
} from 'react-bootstrap';
import { renderField, required } from 'utils/renderField';
import i18n from 'utils/i18n';
import cs from './Balance.less';

export const CBROKER_BALANCE_FORM = 'ACCOUNT_LIST_CBROKER_BALANCE_FORM';

const typeList = [
  { label: i18n['account.edit_account_money.deposit'], value: 'DEPOSITE' },
  {
    label: i18n['account.edit_account_money.withdraw'],
    value: 'WITHDRAWAL'
  }
];

class CbrokerBalanceForm extends PureComponent {
  render() {
    return (
      <Form horizontal>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} className={cs['label']}>
            <span className="required" />
            {i18n['account.edit_account_money.type_label']}
          </Col>
          <Field
            name="type"
            component={renderField}
            type="radioField"
            radioList={typeList}
            columns={8}
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
            type="numberField"
            maxLength="15"
            label={i18n['account.edit_account_money.amount']}
            validate={required}
          />
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} className={cs['label']}>
            {i18n['account.cbroker.label.inner_comment']}
          </Col>
          <Field
            name="innerComment"
            component={renderField}
            type="textareaField"
            maxLength="50"
            columns={8}
          />
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} className={cs['label']}>
            {i18n['account.cbroker.label.comment']}
          </Col>
          <Field
            name="comment"
            component={renderField}
            type="textareaField"
            maxLength="50"
            columns={8}
          />
        </FormGroup>
      </Form>
    );
  }
}

export default reduxForm({
  form: CBROKER_BALANCE_FORM
})(CbrokerBalanceForm);

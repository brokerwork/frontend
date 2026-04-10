import { Field } from 'redux-form';
import { Form } from 'lean-ui';
import { renderField } from 'utils/v2/renderField';
import i18n from 'utils/i18n';
import cs from '../../Balance.less';
export default class WidthDraw extends PureComponent {
  render() {
    const {
      disabled,
      onTypeOptionChange,
      initialValues,
      typeOptions
    } = this.props;
    return (
      <div className={cs.widthdraw_container}>
        <Form.Item col="1">
          <Form.Label>
            {i18n[`settings.deposit_withdraw.${initialValues.type}`]}
            {i18n['settings.deposit_withdraw.type']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="typeOption"
              className={cs['dropdown']}
              onFieldChange={onTypeOptionChange}
              component={renderField}
              disabled={disabled}
              type="selectField"
              options={typeOptions}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item required col="1">
          <Form.Label>
            {i18n['account.edit_account_money.amount_label']}
          </Form.Label>
          <Form.Control>
            <Field
              name="amount"
              component={renderField}
              disabled={disabled}
              type="numberField"
              maxLength="15"
              precision="2"
              label={i18n['account.edit_account_money.amount']}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item col="1">
          <Form.Label>
            {i18n['account.edit_account_money.remark_label']}
          </Form.Label>
          <Form.Control>
            <Field
              name="remark"
              component={renderField}
              disabled={disabled}
              type="maxLengthTextareaField"
              maxLength="31"
              columns={10}
              label={i18n['account.edit_account_money.remark']}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item col="1">
          <Form.Label>
            {i18n['account.edit_account_money.send_email_label']}
          </Form.Label>
          <Form.Control>
            <Field
              name="sendEmail"
              component={renderField}
              disabled={disabled}
              type="switchField"
            />
          </Form.Control>
        </Form.Item>
      </div>
    );
  }
}

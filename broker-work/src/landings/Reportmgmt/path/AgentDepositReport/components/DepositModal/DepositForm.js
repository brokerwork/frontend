import { reduxForm, Field } from 'redux-form';
import { FormGroup, Col, ControlLabel, FormControl } from 'react-bootstrap';
import Form from 'components/Form';
import { renderField, required } from 'utils/renderField';
import i18n from 'utils/i18n';
import cs from './DepositModal.less';

export const DEPOSIT_FORM = 'AGENT_DEPOSIT_FORM';

class DepositForm extends PureComponent {
  render() {
    const { initialValues } = this.props;
    return (
      <Form>
        <Form.Item col={1}>
          <Form.Label className={cs['label']}>
            {i18n['report.agent_deposit_header.name']}：
          </Form.Label>
          <div className="col-sm-4">
            <input
              type="text"
              className="form-control"
              value={initialValues.name || ''}
              disabled={true}
            />
          </div>
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label required={true} className={cs['label']}>
            {i18n['report.agent_deposit_header.login']} ：
          </Form.Label>
          <div className="col-sm-4">
            <input
              type="text"
              className="form-control"
              value={initialValues.login || ''}
              disabled={true}
            />
          </div>
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label required={true} className={cs['label']}>
            {i18n['report.agent_deposit.account_balance']}：
          </Form.Label>
          <div className="col-sm-4">
            <input
              type="text"
              className="form-control"
              value={initialValues.balance}
              disabled={true}
            />
          </div>
          <span className={`col-sm-1 ${cs['field_tips']}`}>USD</span>
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label className={cs['label']} required={true}>
            {i18n['report.agent_deposit.money']}：
          </Form.Label>
          <Field
            name="marginWarn"
            className="col-sm-3"
            component={renderField}
            type="numberField"
          />
          <div className={`col-sm-1 ${cs['field_tips']}`}>USD</div>
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label className={cs['label']} required={true}>
            {i18n['report.agent_deposit.comment']}：
          </Form.Label>
          <Field
            name="comment"
            component={renderField}
            type="textareaField"
            className={cs['text-field']}
            maxLength={31}
            placeholder={i18n['report.agent_deposit.max_length_tips']}
          />
        </Form.Item>
        <Form.Item col={1}>
          <Form.Label className={cs['label']}>
            {i18n['report.agent_deposit.send_email_tips']}：
          </Form.Label>
          <Field
            name="sendEmail"
            className={cs['checkbox-align']}
            component={renderField}
            type="checkboxField"
            inline
            checkboxList={[
              { label: i18n['report.agent_deposit.option_send'], value: 1 }
            ]}
          />
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: DEPOSIT_FORM,
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
  validate: (values = {}) => {
    const errors = {};

    if (required(values.marginWarn)) {
      errors.marginWarn = required(values.marginWarn);
    }

    if (required(values.comment)) {
      errors.comment = required(values.comment);
    }

    return errors;
  }
})(DepositForm);

import { reduxForm, Field } from 'redux-form';
import FormField from 'components/FormField';
import { required } from 'components/FormField/validate';
import Form from 'components/Form';
import i18n from 'utils/i18n';

export const OFFLINE_RECHARGE_FORM = 'DASHBOARD_OFFLINE_RECHARGE_FORM';

class OfflineRechargeForm extends PureComponent {
  render() {
    return (
      <Form>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['dashbord.recharge.modal.charge.offline.remitting.bill']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="bills" 
              multiple
              label={i18n['dashbord.recharge.modal.charge.offline.remitting.bill']}
              fieldType="file"
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['dashbord.recharge.modal.charge.amount']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="amount" 
              label={i18n['dashbord.recharge.modal.charge.amount']}
              fieldType="number"
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

export default reduxForm({
  form: OFFLINE_RECHARGE_FORM
})(OfflineRechargeForm);
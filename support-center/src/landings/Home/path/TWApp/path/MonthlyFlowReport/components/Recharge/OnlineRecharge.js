import { reduxForm, Field } from 'redux-form';
import FormField from 'components/FormField';
import { required } from 'components/FormField/validate';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import math from 'utils/math';

export const ONLINE_RECHARGE_FORM = 'DASHBOARD_ONLINE_RECHARGE_FORM';

class OnlineRechargeForm extends PureComponent {
  state = {
    exchangeAmount: math.mul(this.props.initialValues.amount || 0, this.props.exchangeRate).toFixed(2)
  }

  onAmountChange = (value) => {
    const { exchangeRate } = this.props;

    this.setState({
      exchangeAmount: math.mul(value, exchangeRate).toFixed(2)
    });
  }

  render() {
    const { platformList } = this.props;
    const { exchangeAmount } = this.state;

    return (
      <Form>
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
              decimal="{0,2}"
              disabled={true}
              onFieldChange={this.onAmountChange}
              component={FormField}
              validate={required}
              leftAddon="$"
            />
            <Form.HelpText>
              {i18n['consumption.recharge.need_pay']}{exchangeAmount}
            </Form.HelpText>
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['consumption.recharge.name']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="name" 
              label={i18n['consumption.recharge.name']}
              fieldType="text"
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['consumption.recharge.account']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="account" 
              label={i18n['consumption.recharge.account']}
              fieldType="text"
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['consumption.recharge.bank']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="bank" 
              label={i18n['consumption.recharge.bank']}
              fieldType="text"
              component={FormField}
              validate={required}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required"></span>
            {i18n['platform.tab.deposit.plat.pay']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="providerId" 
              label={i18n['platform.tab.deposit.plat.pay']}
              fieldType="select"
              options={platformList}
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
  form: ONLINE_RECHARGE_FORM
})(OnlineRechargeForm);
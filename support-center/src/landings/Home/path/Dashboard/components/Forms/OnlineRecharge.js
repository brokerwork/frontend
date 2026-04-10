import { reduxForm, Field } from 'redux-form';
import FormField from 'components/FormField';
import { required } from 'components/FormField/validate';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import math from 'utils/math';

export const ONLINE_RECHARGE_FORM = 'DASHBOARD_ONLINE_RECHARGE_FORM';

// 支付平台, 现在只支持支付宝, 只做为前端显示, 后端不需要这个数据
const platformList = [{ label: i18n['consumption.recharge.alipay'], value: 1 }];
class OnlineRechargeForm extends PureComponent {
  state = {
    exchangeAmount: 0
  };

  onAmountChange = value => {
    const { exchangeRate } = this.props;

    this.setState({
      exchangeAmount: math.mul(value, exchangeRate).toFixed(2)
    });
  };

  render() {
    const { exchangeAmount } = this.state;

    return (
      <Form>
        <Form.Item>
          <Form.Label>
            <span className="required" />
            {i18n['dashbord.recharge.modal.charge.amount']}：
          </Form.Label>
          <Form.Control>
            <Field
              name="amount"
              label={i18n['dashbord.recharge.modal.charge.amount']}
              fieldType="number"
              decimal="{0,2}"
              onFieldChange={this.onAmountChange}
              component={FormField}
              validate={required}
              leftAddon="$"
            />
            <Form.HelpText>
              {i18n['consumption.recharge.need_pay']}
              {exchangeAmount}
            </Form.HelpText>
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>
            <span className="required" />
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
  form: ONLINE_RECHARGE_FORM,
  initialValues: {
    providerId: 1
  }
})(OnlineRechargeForm);

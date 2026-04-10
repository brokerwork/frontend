import Form from 'components/Form';
import { Field } from 'redux-form';
import { default as FormField } from 'components/FormField';
import i18n from 'utils/i18n';
import cs from './index.less';
import Tips from 'components/Tips';

import { payPlatType, payPlatStyle, payPlatRoundRule } from '../../constant';

export default class OtherForm extends PureComponent {
  render() {
    const { isPayPlatAuth } = this.props;
    return (
      <Form showHelpText>
        {isPayPlatAuth ? (
          <Form.Item>
            <Form.Label>
              {i18n['platform.tab.deposit.plat.pay.pa']}
              <Tips className={cs.tips} align="top">
                {i18n['trader.plat.setting.deposit.payplat.tips']}
              </Tips>
            </Form.Label>
            <Form.Control className={cs['rem-group']}>
              <Field name="paUserInfoAuth" fieldType="radio" component={FormField} options={payPlatType} />
            </Form.Control>
          </Form.Item>
        ) : null}
        <Form.Item>
          <Form.Label>{i18n['platform.tab.deposit.plat.pay.show.style']}</Form.Label>
          <Form.Control className={cs['rem-group']}>
            <Field name="payPlatStyle" fieldType="radio" component={FormField} options={payPlatStyle} />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['platform.tab.deposit.plat.round.rule']}</Form.Label>
          <Form.Control className={cs['rem-group']}>
            <Field name="roundRule" fieldType="radio" component={FormField} options={payPlatRoundRule} />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

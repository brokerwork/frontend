import { reduxForm, Field } from 'redux-form';
import FormField from 'components/FormField';
import Form from 'components/Form';
import Tips from 'components/Tips';
import i18n from 'utils/i18n';
import cs from './style.less';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

export const CREDIT_SETTING_FORM = 'CREDIT_SETTING_FORM';
class CreditSettingForm extends PureComponent {
  onGiveObjectChange = (e, value) => {
    const { giveType } = this.state;
    if (giveType === 'FIX_RATIO' && value === 'FIRST_OPEN_ACCOUNT') {
      this.setState({
        giveType: 'FIX_AMOUNT',
        giveObject: value
      });
      this.props.change('giveType', 'FIX_AMOUNT');
      return;
    }
    this.setState({
      giveObject: value
    });
  };
  onGiveTypeChange = (e, value) => {
    this.setState({
      giveType: value
    });
  };

  componentWillReceiveProps(nextProps) {
    const { giveType } = this.props;
    const { giveObject: nextGiveObject } = nextProps;
    if (giveType === 'FIX_RATIO' && nextGiveObject === 'FIRST_OPEN_ACCOUNT') {
      this.props.change('giveType', 'FIX_AMOUNT');
    }
  }

  render() {
    const { giveObject, giveType } = this.props;
    return (
      <Form>
        <Form.Item>
          <Form.Label>{i18n['platform.tab.bonus.status']}：</Form.Label>
          <Form.Control>
            <Field
              name="enable"
              fieldType="radio"
              options={[
                { label: i18n['platform.tab.bonus.status.enable'], value: true },
                { label: i18n['platform.tab.bonus.status.close'], value: false }
              ]}
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['platform.tab.bonus.give.object']}：</Form.Label>
          <Form.Control>
            <Field
              name="giveObject"
              fieldType="radio"
              options={[
                { value: 'FIRST_OPEN_ACCOUNT', label: i18n['platform.tab.bonus.give.object.first.open'] },
                { value: 'FIRST_DEPOSIT', label: i18n['platform.tab.bonus.give.object.first.deposit'] },
                { value: 'EVERY_DEPOSIT', label: i18n['platform.tab.bonus.give.object.every.deposit'] }
              ]}
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
        {_.includes(['FIRST_DEPOSIT', 'EVERY_DEPOSIT'], giveObject) ? (
          <Form.Item>
            <Form.Label>{i18n['platform.tab.bonus.deposit.type.title']}：</Form.Label>
            <Form.Control>
              <Field
                className={cs['deposit-types-field']}
                name="depositTypes"
                fieldType="checkboxList"
                component={FormField}
                checkedKey="enabled"
              />
            </Form.Control>
            <Form.HelpText>
              <Tips align="top">{i18n['platform.tab.bonus.deposit.type.popover']}</Tips>
            </Form.HelpText>
          </Form.Item>
        ) : null}
        <Form.Item>
          <Form.Label>{i18n['platform.tab.bonus.give.type']}：</Form.Label>
          <Form.Control>
            <Field
              name="giveType"
              fieldType="radio"
              options={[
                {
                  value: 'FIX_RATIO',
                  label: i18n['platform.tab.bonus.give.type.radio'],
                  disabled: giveObject === 'FIRST_OPEN_ACCOUNT'
                },
                { value: 'FIX_AMOUNT', label: i18n['platform.tab.bonus.give.type.amount'] }
              ]}
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['platform.tab.bonus.amount']}：</Form.Label>
          <Form.Control>
            <Field name="amount" decimal="{0,2}" fieldType="number" component={FormField} />
          </Form.Control>
          <Form.HelpText>{giveType === 'FIX_RATIO' ? '%' : null }{i18n['platform.tab.bonus.amount.help']}</Form.HelpText>
        </Form.Item>
      </Form>
    );
  }
}

const  CreditSettingFormR = reduxForm({
  form: CREDIT_SETTING_FORM,
  enableReinitialize: true
})(CreditSettingForm);


const selector = formValueSelector(CREDIT_SETTING_FORM);
export default connect(
  state => {
    return {
      giveObject: selector(state, 'giveObject'),
      giveType: selector(state, 'giveType')
    };
  },
  {}
)(CreditSettingFormR);

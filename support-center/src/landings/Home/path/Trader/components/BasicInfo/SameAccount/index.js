import { Field } from 'redux-form';
import i18n from 'utils/i18n';
import { default as FormField } from 'components/FormField';
import cs from './index.less';
import { required } from 'components/FormField/validate';
import { FormattedMessage } from 'react-intl';
import Tips from 'components/Tips';

const validateMaxApply = value => {
  if (Number(value) < 1) {
    return (
      <FormattedMessage id="validate.maxnumber" defaultMessage={i18n['trader.plat.setting.basicInfo.max_apply.tips']} />
    );
  } else {
    return undefined;
  }
};

export default class BasicInfoForm extends PureComponent {
  render() {
    const { allowSameAccount, disabled } = this.props;

    const isSameAccountDisable = !allowSameAccount;

    return (
      <div className={cs.form_container}>
        <Field
          label={i18n['trader.plat.setting.basicInfo.allowed_apply_same_account']}
          name="allowSameAccount"
          fieldType="checkbox"
          component={FormField}
          disabled={disabled}
        />
        <div className={cs.input_content}>
          <div className={cs.max_apply}>
            <label>{i18n['trader.plat.setting.basicInfo.max_apply']}</label>
            <Field
              name="maxCountSameAcount"
              label={i18n['trader.plat.setting.basicInfo.max_apply']}
              fieldType="number"
              integer={true}
              component={FormField}
              maxLength={4}
              disabled={isSameAccountDisable || disabled}
            />
          </div>
          <div className={cs.account_explain}>
            <label>
              【{i18n['trader.plat.setting.basicInfo.account.explain']}】&nbsp;
              {i18n['trader.plat.setting.basicInfo.account.notice']}
              <Tips className={cs.tips} align="top">
                {i18n['trader.plat.setting.basicInfo.account.help']}
              </Tips>
            </label>
            <Field
              name="sameAccountTips"
              label={i18n['trader.plat.setting.basicInfo.account.notice']}
              fieldType="text"
              component={FormField}
              className={cs.account_explain_input}
              disabled={isSameAccountDisable || disabled}
            />
          </div>
        </div>
      </div>
    );
  }
}

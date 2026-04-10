import CreditSettingForm, { CREDIT_SETTING_FORM } from './form.js';
import i18n from 'utils/i18n';
import Button from 'components/Button';
import cs from './style.less';
import _ from 'lodash';
import { SubmissionError } from 'redux-form';

class CreditSetting extends PureComponent {
  onSubmit = values => {
    const { savePlatSettingBonus, plat, showTopAlert } = this.props;
    let errors = {};
    let copyData = _.cloneDeep(values);
    if (values.giveObject === 'FIRST_DEPOSIT' || values.giveObject === 'EVERY_DEPOSIT') {
      if (values.depositTypes.length === 0) {
        errors.depositTypes = i18n['trader.plat.setting.credit.deposit_types.msg'];
      }
    }
    copyData.depositTypes = values.depositTypes.filter(t => t.enabled).map(t => t.value);
    if (!values.amount || values.amount <= 0) {
      errors.amount = i18n['platform.tab.bonus.amount.error.msg'];
    }
    copyData.productId = 'TW';
    if (_.keys(errors).length) {
      throw new SubmissionError(errors);
    }
    savePlatSettingBonus(plat, copyData).then(({result}) => {
      showTopAlert({
        style: "success",
        content: i18n['general.save_success']
      });
    });
  };
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(CREDIT_SETTING_FORM);
  };
  render() {
    const { bonusSetting } = this.props;
    if (bonusSetting) {
      bonusSetting.depositTypes = [
        { value: 'TASK_DEPOSIT', label: i18n['platform.tab.bonus.deposit.type.task'] },
        { value: 'TASK_TRANSFER_DEPOSIT', label: i18n['platform.tab.bonus.deposit.type.task.transfer'] },
        { value: 'COMMISSION_DEPOSIT', label: i18n['platform.tab.bonus.deposit.type.commission'] },
        { value: 'OTHER_DEPOSIT', label: i18n['platform.tab.bonus.deposit.type.other'] }
      ].map(type => ({ ...type, enabled: _.includes(_.get(bonusSetting, 'depositTypes', []), type.value) }));
    }

    return (
      <div className={cs['credit-from']}>
        <CreditSettingForm initialValues={bonusSetting} onSubmit={this.onSubmit} />
        <Button style="primary" onClick={this.onSave}>
          {i18n['app.btn.save']}
        </Button>
      </div>
    );
  }
}

export default CreditSetting;

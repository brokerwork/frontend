import cs from './PersonalAccount.less';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import { PersonalAccountForm, TRADER_CUSTOM_ACCOUNT_FORM } from './PersonalAccountForm';
import { transInitValues, transSubmitData } from './utils';

export default class PersonalAccount extends PureComponent {
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(TRADER_CUSTOM_ACCOUNT_FORM);
  };
  onReset = () => {
    const { resetForm } = this.props;
    resetForm(TRADER_CUSTOM_ACCOUNT_FORM);
  };
  onSubmit = values => {
    const { saveAccount, plat, showTopAlert, getPlatSetting } = this.props;
    let copyData = { ...values };
    copyData = transSubmitData(copyData);

    saveAccount(plat, 'account', copyData).then(res => {
      if (res.result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.save_success']
        });
        getPlatSetting(plat);
      }
    });
  };

  render() {
    const {
      languages,
      paltSetting: { basicSetting }
    } = this.props;

    return (
      <div>
        <PersonalAccountForm
          onSubmit={this.onSubmit}
          languages={languages}
          initialValues={transInitValues(basicSetting)}
        />
        <div className={cs.footer_button}>
          <Button style="primary" onClick={this.onSave}>
            {i18n['app.btn.save']}
          </Button>
          <Button onClick={this.onReset}> {i18n['app.btn.reset']}</Button>
        </div>
      </div>
    );
  }
}

import cs from './index.less';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import { BasicInfoForm, TRADER_CUSTOM_BASIC_FORM } from './Form';

export default class BasicInfo extends PureComponent {
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(TRADER_CUSTOM_BASIC_FORM);
  };
  onReset = () => {
    const { resetForm } = this.props;
    resetForm(TRADER_CUSTOM_BASIC_FORM);
  };
  onSubmit = values => {
    const { savePlatSetting, plat, type, showTopAlert } = this.props;
    let copyData = { ...values };

    savePlatSetting(plat, type, copyData).then(res => {
      if (res.result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.save_success']
        });
      }
    });
  };

  render() {
    const { basicSetting } = this.props;

    return (
      <div>
        <BasicInfoForm initialValues={basicSetting} onSubmit={this.onSubmit} />
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

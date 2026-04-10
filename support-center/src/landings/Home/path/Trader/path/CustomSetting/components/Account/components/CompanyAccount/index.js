import cs from './index.less';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import CompanyAccountReduxForm, { COMPANY_ACCOUNT_FORM } from './form';
import { transInitValues, transSubmitData } from '../../utils';
import _ from 'lodash';
export default class CompanyAccount extends PureComponent {
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(COMPANY_ACCOUNT_FORM);
  };
  onReset = () => {
    const { resetForm } = this.props;
    resetForm(COMPANY_ACCOUNT_FORM);
  };
  onSubmit = values => {
    const { saveAccount, plat, showTopAlert, type, getPlatSetting } = this.props;
    let copyData = { ...values };
    copyData = transSubmitData(copyData);
    saveAccount(plat, type, copyData).then(res => {
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
    const { languages, data, type } = this.props;
    // const initalVal = this.configInitialValues(data);
    return (
      <div>
        <CompanyAccountReduxForm
          onSubmit={this.onSubmit}
          languages={languages}
          type={type}
          initialValues={transInitValues(data)}
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

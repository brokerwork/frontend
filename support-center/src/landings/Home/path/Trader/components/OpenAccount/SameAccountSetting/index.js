import { reduxForm } from 'redux-form';

import SameAccountSettingForm from './form';
import i18n from 'utils/i18n';
import Panel from 'components/Panel';
import Button from 'components/Button';
import ccs from '../index.less';
import _ from 'lodash';

// import cs from './index.less';
export const SAME_ACCOUNT_SETTING_FORM = 'TRADER_PLAT_SETTING_SAME_ACCOUNT_SETTING_FORM';

const SameAccountSettingReduxForm = reduxForm({
  form: SAME_ACCOUNT_SETTING_FORM,
  enableReinitialize: true
})(SameAccountSettingForm);

export default class SameAccountSetting extends PureComponent {
  submitForm = values => {
    const { saveSameAccountSettingData, plat, showTopAlert, getSameAccountSettingData } = this.props;

    const params = _.cloneDeep(values);
    let map = {};
    for (let key in params) {
      if (key.indexOf('accountDescFieldHint_') !== -1) {
        map[key.split('_').pop()] = params[key];
        delete params[key];
      }
    }
    params.accountDescFieldHint = map;
    saveSameAccountSettingData(plat, params).then(res => {
      if (res.result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.modify_success']
        });
        getSameAccountSettingData(plat);
      }
    });
  };
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(SAME_ACCOUNT_SETTING_FORM);
  };
  onReset = () => {
    this.props.reset(SAME_ACCOUNT_SETTING_FORM);
    this.props.showTopAlert({
      style: 'success',
      content: i18n['general.reset_success']
    });
  };
  render() {
    const { brandInfo: { languages = [] } = {}, sameAccountData } = this.props;
    for (let key in sameAccountData.accountDescFieldHint) {
      sameAccountData[`accountDescFieldHint_${key}`] = sameAccountData.accountDescFieldHint[key];
    }
    return (
      <div>
        <Panel className={ccs.margin_20} header={i18n['platform.tab.open.account.sameAccount']}>
          <SameAccountSettingReduxForm
            initialValues={sameAccountData}
            onSubmit={this.submitForm}
            languages={languages}
          />
          <div>
            <Button style="primary" className={ccs.margin_right} onClick={this.onSave}>
              {i18n['app.btn.save']}
            </Button>
            <Button onClick={this.onReset}> {i18n['app.btn.reset']}</Button>
          </div>
        </Panel>
      </div>
    );
  }
}

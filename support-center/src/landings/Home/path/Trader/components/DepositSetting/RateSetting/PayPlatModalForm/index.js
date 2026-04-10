import { reduxForm, getFormValues, change } from 'redux-form';
import { connect } from 'react-redux';

import PayPlatModalForm from './form';
import i18n from 'utils/i18n';
import cs from './index.less';
import _ from 'lodash';
export const PAY_PALT_MODAL_FORM = 'TRADER_PLAT_SETTING_PAY_PALT_MODAL_FORM';

const TraderPayPlatModalForm = reduxForm({
  form: PAY_PALT_MODAL_FORM,
  enableReinitialize: true
})(PayPlatModalForm);

class OtherSettingForm extends PureComponent {
  submitForm = values => {
    const { update, getPlatSetting, plat, close, showTopAlert } = this.props;
    values.charges = values.charges && Number(values.charges).toFixed(8);
    values.minDeposit = values.minDeposit && Number(values.minDeposit).toFixed(4);
    values.maxDeposit = values.maxDeposit && Number(values.maxDeposit).toFixed(4);
    const params = _.cloneDeep(values);
    let map = {};
    for (let key in params) {
      if (key.indexOf('notices_') !== -1) {
        map[key.split('_').pop()] = params[key];
        plat !== 'CTRADER' && delete params[key];
      }
    }
    plat !== 'CTRADER' && (params.notices = map);
    update(plat, params).then(res => {
      if (res.result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.edit_success']
        });
        getPlatSetting(plat);
        close();
      }
    });
  };
  render() {
    const { editData, formValues, brandInfo: { languages = [] } = {}, plat } = this.props;
    if (editData && editData.notices) {
      for (let key in editData.notices) {
        editData[`notices_${key}`] = editData.notices[key];
      }
    }
    return (
      <div>
        <TraderPayPlatModalForm
          initialValues={editData}
          formValues={formValues}
          onSubmit={this.submitForm}
          languages={languages}
          plat={plat}
        />
      </div>
    );
  }
}
export default connect(
  state => {
    return {
      formValues: getFormValues(PAY_PALT_MODAL_FORM)(state),
      brandInfo: state.traderCommon.brandInfo
    };
  },
  {}
)(OtherSettingForm);

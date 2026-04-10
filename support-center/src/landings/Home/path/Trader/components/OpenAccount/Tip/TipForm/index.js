import Form from './form';
import { reduxForm, change } from 'redux-form';
import { connect } from 'react-redux';
import i18n from 'utils/i18n';
import _ from 'lodash';
export const TIP_FORM = 'TRADER_PLAT_SETTING_TIP_FORM';
let TraderTipForm = reduxForm({
  form: TIP_FORM,
  enableReinitialize: true
})(Form);

class TipForm extends PureComponent {
  onSubmit = values => {
    // 这里需要转换格式把多个属性集合在一个属性(除了ctrader)
    let map = {};
    for (let key in values) {
      if (key.indexOf('agreement') !== -1) {
        map[key.split('_').pop()] = values[key];
        this.props.plat !== 'CTRADER' && delete values[key];
      }
    }
    values.openDesc = map;
    const {
      savePlatSetting,
      plat,
      productId,
      getPlatSetting,
      showTopAlert,
      saveOpenAccountSettingData,
      accountTypeConfig,
      activeKey,
      versionRights,
      getOpenDescData
    } = this.props;
    let accountTypeInfos = [];
    if (accountTypeConfig) {
      accountTypeInfos = accountTypeConfig.accountTypeInfos;
    }
    const params = {
      productId,
      openDesc: values.openDesc
    };
    if (plat !== 'CTRADER') {
      // if (versionRights['SC_CUSTOM_ACCOUNT_TYPE']) {
      const customerAccountType = _.get(accountTypeInfos[activeKey], 'customerAccountType', '');
      saveOpenAccountSettingData(plat, 'open-desc', params, customerAccountType).then(res => {
        if (res.result) {
          showTopAlert({
            style: 'success',
            content: i18n['general.save_success']
          });
          getOpenDescData(plat, customerAccountType);
        }
      });
      // } else {
      //   saveOpenAccountSettingData(plat, 'open-desc', params).then(res => {
      //     if (res.result) {
      //       showTopAlert({
      //         style: 'success',
      //         content: i18n['general.save_success']
      //       });
      //       getOpenDescData(plat);
      //     }
      //   });
      // }
    } else {
      let url = `/v2/os/products/conf/${plat}/open-desc`; //换接口
      savePlatSetting(plat, 'risk-desc', params, url).then(res => {
        if (res.result) {
          showTopAlert({
            style: 'success',
            content: i18n['general.save_success']
          });
          getPlatSetting(plat);
        }
      });
    }
  };
  render() {
    const { paltSetting, change, plat, brandInfo, openDescData, activeKey } = this.props;
    // 转换格式为对应的form表单字段
    let paltSet = _.cloneDeep(paltSetting);
    if (plat !== 'CTRADER') {
      paltSet = _.cloneDeep(openDescData);
      for (let key in paltSet) {
        paltSet[`agreement_${key}`] = paltSet[key];
      }
    }
    paltSet.accountType = Date.now(); // 用于当接口返回为空时，初始值没有变化导致form不会重新渲染

    return (
      <div>
        <TraderTipForm
          brandInfo={brandInfo}
          plat={plat}
          initialValues={paltSet}
          onSubmit={this.onSubmit}
          change={change}
          activeKey={activeKey}
        />
      </div>
    );
  }
}

export default connect(
  null,
  {
    change
  }
)(TipForm);

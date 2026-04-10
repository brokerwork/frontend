import { reduxForm } from 'redux-form';
import AddForm from './form';
import i18n from 'utils/i18n';
export const ADD_ACCOUNT_FORM = 'TRADER_PLAT_SETTING_ADD_ACCOUNT_FORM';

const TraderAddForm = reduxForm({
  form: ADD_ACCOUNT_FORM,
  enableReinitialize: true
})(AddForm);

export default class AddAccountForm extends PureComponent {
  submitForm = values => {
    const { editData, savePlatSetting, plat, productId, getPlatSetting, onClose, showTopAlert } = this.props;
    const params = _.cloneDeep(values);
    let map = {};
    for (let key in params) {
      if (key.indexOf('typeNames_') !== -1) {
        map[key.split('_').pop()] = params[key];
        plat !== 'CTRADER' && delete params[key];
      }
    }
    plat !== 'CTRADER' && (params.typeNames = map);
    params.productId = productId;
    if (editData) {
      params.typeId = editData.typeId;
    }
    savePlatSetting(plat, 'demo-type', params).then(res => {
      if (res.result) {
        showTopAlert({
          style: 'success',
          content: i18n[`general.${editData ? 'edit' : 'add'}_success`]
        });
        getPlatSetting(plat);
        onClose();
      }
    });
  };
  componentDidMount() {
    const { getMaxLeverageList, getAccountTypeList, getTotalCaculationTypeList, plat } = this.props;
    if (plat === 'CTRADER') {
      getMaxLeverageList();
      getAccountTypeList();
      getTotalCaculationTypeList();
    }
  }
  render() {
    const {
      editData,
      leverageList,
      plat,
      maxLeverageList,
      accountTypeList,
      totalCaculationTypeList,
      languages
    } = this.props;
    if (editData && editData.typeNames) {
      for (let key in editData.typeNames) {
        editData[`typeNames_${key}`] = editData.typeNames[key];
      }
    }
    return (
      <div>
        <TraderAddForm
          initialValues={editData}
          onSubmit={this.submitForm}
          leverageList={leverageList}
          maxLeverageList={maxLeverageList}
          accountTypeList={accountTypeList}
          totalCaculationTypeList={totalCaculationTypeList}
          plat={plat}
          languages={languages}
        />
      </div>
    );
  }
}

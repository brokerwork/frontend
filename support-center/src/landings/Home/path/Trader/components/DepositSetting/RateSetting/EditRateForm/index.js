import EditRateForm from './form';
import i18n from 'utils/i18n';
import cs from './index.less';
import _ from 'lodash';

export default class RateForm extends PureComponent {
  submitForm = values => {
    const { update, getPlatSetting, plat, close, showTopAlert, sortType } = this.props;
    const params = _.cloneDeep(values);
    params.type = sortType;
    params.exchangeFloat = params.exchangeFloat || 0;
    if (params.exchangeMode !== 'Automatic') {
      delete params.exchangeSource;
      // delete params.exchangeFloat;
      params.exchangeFloat = 0;
    }
    update(plat, sortType, params).then(res => {
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
  setInitialValue = data => {
    const copyData = _.cloneDeep(data);
    copyData.exchangeSource = copyData.exchangeSource ? copyData.exchangeSource : 'CashSalePrice';
    copyData.exchangeFloat = copyData.exchangeFloat || 0; //未填写默认0
    return copyData;
  };
  render() {
    const { editData } = this.props;
    const initialVal = this.setInitialValue(editData);
    return (
      <div>
        <EditRateForm initialValues={initialVal} onSubmit={this.submitForm} editing />
      </div>
    );
  }
}

import EditForm from '../../containers/EditForm';
import i18n from 'utils/i18n';
import getQueryString from 'utils/queryString';
export default class Edit extends Component {
  onSave = (info, type) => {
    const {
      editBill,
      showTopAlert,
      onSave,
      match: { path, url, params },
      history: { push },
      billId
    } = this.props;
    const submitData = {
      customerId: params.customerId,
      billId: params.billId || billId,
      bill: info
    };
    editBill(submitData).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.modify_success']
        });
      }
    });
  };
  // //保存数据
  // onSubmit = () => {
  //   const { submitForm } = this.props;
  //   submitForm(CONTRACT_INFO_FORM);
  // };
  getEnable = () => {
    const { enable } = this.props;
    const query = getQueryString(location.search);
    const queryEnable = query.get('enable') === 'false' ? false : true;
    const _enable = typeof enable !== 'undefined' ? enable : queryEnable; //来自location或来自modal的props；
    return _enable;
  };
  componentDidMount() {
    const {
      match: { params },
      getBillDetail,
      billId,
      customerId,
      getIsLostCustomer
    } = this.props;
    const _billId = params.billId || billId;
    const _customerId = params.customerId || customerId;
    getBillDetail(_billId, _customerId, this.getEnable()).then(res => {
      if (res.result) {
        getIsLostCustomer(_customerId);
      }
    });
  }
  render() {
    const { show, onHide, userRights, billDetail, isLostCustomer } = this.props;
    const initialValues = {
      payInfos: [{}],
      invoices: [{}],
      ...billDetail.bill
    };
    return Object.keys(billDetail).length ? (
      <EditForm
        {...this.props}
        onSave={this.onSave}
        onCancel={this.onCancel}
        initialValues={initialValues}
        enable={this.getEnable()}
        isLostCustomer={isLostCustomer}
        type="edit"
      />
    ) : (
      <div />
    );
  }
}

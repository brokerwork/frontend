import EditForm from '../../containers/EditForm';
import i18n from 'utils/i18n';
import { COMPANY_INFO } from '../../constants';
import moment from 'moment';
export default class Add extends Component {
  onSave = (info, type) => {
    const {
      addBill,
      showTopAlert,
      onSave,
      match: { path, url, params },
      history: { push }
    } = this.props;
    const submitData = {
      customerId: params.customerId,
      bill: info
    };
    addBill(submitData).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.create_success']
        });
        push(url.replace('/bill', ''));
      }
    });
  };
  componentDidMount() {
    const {
      customerDetailInfo,
      getAccountOwnerOfCustomerById,
      getCustomerDetail,
      match: { params }
    } = this.props;
    if (!Object.keys(customerDetailInfo).length) {
      getCustomerDetail(params.customerId, false);
    }
  }

  // //保存数据
  // onSubmit = () => {
  //   const { submitForm } = this.props;
  //   submitForm(CONTRACT_INFO_FORM);
  // };
  getBillNo = () => {
    const now = new Date();
    const dateHash = now.getTime() % (24 * 60 * 60 * 1000);
    const dateStr = moment(now).format('YYMMDD');
    return `${dateStr}${dateHash}`;
  };
  getDefaultValues = () => {
    const { customerDetailInfo } = this.props;
    const initialValues = {
      billNo: this.getBillNo(),
      payInfos: [{}],
      invoices: [{}],
      ...COMPANY_INFO,
      to: customerDetailInfo.customName,
      toAddress: customerDetailInfo.address,
      invoiceDate: moment(),
      expDate: moment().add(1, 'M')
    };
    return initialValues;
  };
  render() {
    const { show, onHide, userRights, customerDetailInfo } = this.props;
    const initialValues = this.getDefaultValues();
    return (
      <EditForm
        {...this.props}
        onSave={this.onSave}
        onCancel={this.onCancel}
        initialValues={initialValues}
        enable={true}
        type="add"
      />
    );
  }
}

import EditForm, { REFUND_INFO_FORM } from '../Form';
import { Button } from 'react-bootstrap';
import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import moment from 'moment';
import URLSearchParams from 'utils/queryString';

export default class Add extends PureComponent {
  needApprove = false; //提交表单后是否需要发起审批
  state = {
    initialValues: {}
  };
  onSave = (info, type) => {
    const {
      addRefund,
      showTopAlert,
      onSave,
      billDetail,
      match: { path, url, params },
      showApproveModal
    } = this.props;
    const submitData = {
      customerId: params.customerId,
      billId: billDetail.billId,
      refund: info
    };
    addRefund(submitData).then(({ result, data: { refundId } }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.create_success']
        });
        if (onSave) {
          onSave(info, type);
        }

        if (this.needApprove && showApproveModal) {
          showApproveModal(params.customerId, refundId);
        }
      }
    });
  };
  getRefundNo = () => {
    const now = new Date();
    const dateHash = now.getTime() % (24 * 60 * 60 * 1000);
    const dateStr = moment(now).format('YYMMDD');
    return `${dateStr}${dateHash}`;
  };
  //保存数据
  onSubmit = needApprove => {
    this.needApprove = needApprove;
    const { submitForm } = this.props;
    submitForm(REFUND_INFO_FORM);
  };

  onCancel = () => {
    const { onHide } = this.props;
    if (onHide) onHide();
  };
  componentDidMount() {
    const {
      billDetail,
      location: { search }
    } = this.props;

    const params = URLSearchParams(search);

    let introducer;

    if (!!params) {
      introducer = params.get('introducer');
    }

    this.setState({
      initialValues: {
        billNo: billDetail.bill && billDetail.bill.billNo,
        refundNo: this.getRefundNo(),
        refundDate: new Date(),
        refundCurrency: 'USD',
        actualCurrency: 'RMB',
        mediatorName: introducer
      }
    });
  }
  render() {
    const { show, onHide, userRights, billDetail } = this.props;
    const { initialValues } = this.state;
    return (
      <Modal backdrop="static" show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            {i18n['customer.bills_module.add_refund_title']}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-horizontal">
            <EditForm
              {...this.props}
              onSave={this.onSave}
              initialValues={initialValues}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.onSubmit.bind(this, false)}>
            {i18n['general.confirm']}
          </Button>
          <Button bsStyle="primary" onClick={this.onSubmit.bind(this, true)}>
            {i18n['customer.contract.btn.saveAndApprove']}
          </Button>
          <Button onClick={this.onCancel}>{i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

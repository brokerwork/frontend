import EditForm, { REFUND_INFO_FORM } from '../Form';
import { Button } from 'react-bootstrap';
import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import moment from 'moment';
import { getApproveStageStr } from '../../../../../Customers/utils';
import cs from './index.less';

export default class Edit extends PureComponent {
  needApprove = false; //提交表单后是否需要发起审批
  constructor(props) {
    super(props);
    this.state = {
      refundNo: this.getRefundNo()
    };
  }
  onSave = (info, type) => {
    const {
      editRefund,
      showTopAlert,
      onSave,
      billDetail,
      match: { path, url, params },
      data: { refundId },
      showApproveModal
    } = this.props;
    const submitData = {
      customerId: params.customerId,
      billId: billDetail.billId,
      refund: info,
      refundId: refundId
    };
    editRefund(submitData).then(({ result }) => {
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

  getRefundNo = () => {
    const now = new Date();
    const dateHash = now.getTime() % (24 * 60 * 60 * 1000);
    const dateStr = moment(now).format('YYMMDD');
    return `${dateStr}${dateHash}`;
  };

  isEditAble = () => {
    const {
      data: { stage }
    } = this.props;

    if (stage === 2) {
      //审批中不允许编辑
      return false;
    }

    return true;
  };

  isShowRestStageHint = () => {
    const {
      data: { stage }
    } = this.props;

    if ([4, 5].includes(stage)) {
      return true;
    }

    return false;
  };

  render() {
    const { show, onHide, userRights, billDetail, data } = this.props;
    const { refundNo } = this.state;
    const initialValues = {
      billStage: billDetail.stage,
      refundStage: data.stage,
      billNo: billDetail.bill && billDetail.bill.billNo,
      refundNo: (billDetail.bill && billDetail.bill.refundNo) || refundNo, //没有refundNo的旧数据生成一个No
      ...data.refund
    };
    return (
      <Modal backdrop="static" show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            {i18n['customer.bills_module.edit_refund_title']}
            <span
              className={cs[`stage-${data.stage}`]}
            >{`（${getApproveStageStr(data.stage)}）`}</span>
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
          {this.isShowRestStageHint() && (
            <div className={cs['reset-status-hint']}>
              {i18n['customer.approve.hint.reset_status']}
            </div>
          )}
          {this.isEditAble() ? (
            <Button bsStyle="primary" onClick={this.onSubmit.bind(this, false)}>
              {i18n['general.confirm']}
            </Button>
          ) : (
            undefined
          )}
          {this.isEditAble() ? (
            <Button bsStyle="primary" onClick={this.onSubmit.bind(this, true)}>
              {i18n['customer.contract.btn.saveAndApprove']}
            </Button>
          ) : (
            undefined
          )}
          <Button onClick={this.onCancel}>{i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

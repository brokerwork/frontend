import EditForm from '../../containers/EditForm';
import { CONTRACT_INFO_FORM } from '../EditForm';
import { Button, Dialog } from 'lean-ui';
import Modal from 'components/Modal';
import i18n from 'utils/i18n';

export default class Add extends Component {
  needApprove = false; //提交表单后是否需要发起审批

  onSave = (info, type) => {
    const { addContract, showTopAlert, onSave, showApproveModal } = this.props;
    addContract(info).then(res => {
      const {
        result,
        data: { customerId, contractsId }
      } = res;
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.create_success']
        });
        if (onSave) {
          onSave(info, type);
        }
        if (this.needApprove && showApproveModal) {
          showApproveModal(customerId, contractsId);
        }
      }
    });
  };

  //保存数据
  onSubmit = needApprove => {
    this.needApprove = needApprove;

    const { submitForm } = this.props;
    submitForm(CONTRACT_INFO_FORM);
  };

  onCancel = () => {
    const { onHide } = this.props;
    if (onHide) onHide();
  };

  render() {
    const {
      show,
      onHide,
      userRights,
      bindedSaleOpp,
      initialValues
    } = this.props;
    const __initialValues = bindedSaleOpp
      ? { ...initialValues, opportunityId: bindedSaleOpp.value }
      : initialValues;
    return (
      <Dialog
        title={i18n['customer.contracts_module.add_contract_title']}
        visible={show}
        onCancel={onHide}
        footer={
          <div>
            <Button type="primary" onClick={this.onSubmit.bind(this, false)}>
              {i18n['general.confirm']}
            </Button>
            <Button type="primary" onClick={this.onSubmit.bind(this, true)}>
              {i18n['customer.contract.btn.saveAndApprove']}
            </Button>
            <Button onClick={this.onCancel}>{i18n['general.cancel']}</Button>
          </div>
        }
      >
        <div className="form-horizontal">
          <EditForm
            {...this.props}
            initialValues={__initialValues}
            onSave={this.onSave}
          />
        </div>
      </Dialog>
    );
  }
}

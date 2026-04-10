import EditForm from '../../containers/EditForm';
import { CONTRACT_INFO_FORM } from '../EditForm';

import { Button, Dialog } from 'lean-ui';
import i18n from 'utils/i18n';
import { getApproveStageStr } from '../../../Customers/utils';
import cs from './index.less';

export default class Edit extends Component {
  needApprove = false; //提交表单后是否需要发起审批

  onSave = (info, type) => {
    const { editContract, showTopAlert, onSave, showApproveModal } = this.props;
    editContract(info).then(({ result, data }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.modify_success']
        });
        if (onSave) {
          onSave(info, type);
        }

        if (this.needApprove && showApproveModal) {
          const { customerId, contractsId } = data;
          showApproveModal(customerId, contractsId);
        }
      }
    });
  };
  getFormattedInitialValues = () => {
    const { initialValues = {} } = this.props;
    const parsed = {
      ...initialValues,
      ...initialValues.contracts
    };
    delete parsed.contracts;
    return parsed;
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

  isEditAble = () => {
    const { disabled } = this.props;

    if (disabled) {
      return false;
    }
    const {
      initialValues: { stage }
    } = this.props;

    if (stage === 2) {
      //审批中不允许编辑
      return false;
    }

    return true;
  };

  isShowRestStageHint = () => {
    const {
      initialValues: { stage }
    } = this.props;

    if ([4, 5].includes(stage)) {
      return true;
    }

    return false;
  };

  render() {
    const {
      show,
      onHide,
      userRights,
      disabled,
      initialValues: { stage }
    } = this.props;

    return (
      <Dialog
        title={
          <div>
            {i18n['customer.contracts_module.edit_contract_title']}
            <span className={cs[`stage-${stage}`]}>{`（${getApproveStageStr(
              stage
            )}）`}</span>
          </div>
        }
        visible={show}
        onCancel={onHide}
        footer={
          <div>
            {this.isShowRestStageHint() && (
              <div className={cs['reset-status-hint']}>
                {i18n['customer.approve.hint.reset_status']}
              </div>
            )}
            {!this.isEditAble() ? (
              undefined
            ) : (
              <Button
                bsStyle="primary"
                onClick={this.onSubmit.bind(this, false)}
              >
                {i18n['general.confirm']}
              </Button>
            )}
            {!this.isEditAble() ? (
              undefined
            ) : (
              <Button
                bsStyle="primary"
                onClick={this.onSubmit.bind(this, true)}
              >
                {i18n['customer.contract.btn.saveAndApprove']}
              </Button>
            )}
            <Button onClick={this.onCancel}>{i18n['general.cancel']}</Button>
          </div>
        }
      >
        <div className={cs['form-horizontal']}>
          <EditForm
            {...this.props}
            disabled={disabled}
            onSave={this.onSave}
            initialValues={this.getFormattedInitialValues(stage)}
          />
        </div>
      </Dialog>
    );
  }
}

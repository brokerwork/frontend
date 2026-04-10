import { Dialog, Button } from 'lean-ui';
import cs from './index.less';
import i18n from 'utils/i18n';
import ApplyWithdrawForm, { APPLY_WITHDRAW_FORM } from '../ApplyWithdrawForm';

export default class ApplyModal extends Component {
  state = {
    bankEditable: false
  };
  onSubmit = () => {
    const { submitForm } = this.props;
    submitForm(APPLY_WITHDRAW_FORM);
  };
  onSave = data => {
    const { applyWithdraw, onCompleted, showTopAlert } = this.props;
    if (data.withdrawType.indexOf('@') !== -1) {
      data.typeId = data.withdrawType.split('@').shift();
      data.withdrawType = data.withdrawType.split('@').pop();
    }
    data.bankAccountNumber = data.bankAccount;
    delete data.bankAccount;
    applyWithdraw(data).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['withdraw.form.alert.success']
        });
        if (onCompleted) {
          onCompleted();
        }
      }
    });
  };

  editBank = () => {
    this.setState({
      bankEditable: true
    });
  };
  renderFooter = () => {
    const { show, onHide, defaultValues, bankList } = this.props;
    const { bankEditable } = this.state;
    const hasMatchedBank =
      defaultValues.bankId ||
      bankList.find(item => item.label === defaultValues.bankName);
    return (
      <div>
        {defaultValues.bankAccountName && !bankEditable && hasMatchedBank ? (
          <Button
            type="primary"
            data-test="modify-bank-btn"
            onClick={this.editBank}
          >
            {i18n['withdraw.form.btn.modify_bank']}
          </Button>
        ) : (
          undefined
        )}
        <Button type="primary" onClick={this.onSubmit}>
          {i18n['general.confirm']}
        </Button>
        <Button onClick={onHide}>{i18n['general.cancel']}</Button>
      </div>
    );
  };
  render() {
    const { show, onHide, defaultValues, bankList } = this.props;
    const { bankEditable } = this.state;
    const hasMatchedBank =
      defaultValues.bankId ||
      bankList.find(item => item.label === defaultValues.bankName);
    return (
      <Dialog
        width={600}
        visible={show}
        onCancel={onHide}
        maskClosable={false}
        title={i18n['withdraw.add_modal.title']}
        footer={this.renderFooter()}
      >
        <ApplyWithdrawForm
          {...this.props}
          onSave={this.onSave}
          bankEditable={bankEditable || !hasMatchedBank}
        />
      </Dialog>
    );
  }
}

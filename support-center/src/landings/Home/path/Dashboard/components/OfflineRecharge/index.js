import Modal from 'components/Modal';
import Button from 'components/Button';
import OfflineRechargeForm, { OFFLINE_RECHARGE_FORM } from '../Forms/OfflineRecharge';
import i18n from 'utils/i18n';
import cs from './OfflineRecharge.less';


export default class OfflineRecharge extends PureComponent {
  onSubmit = () => {
    const { submitForm } = this.props;

    submitForm(OFFLINE_RECHARGE_FORM);
  }

  onSave = (values) => {
    const { offlineRecharge, showTopAlert, onClose } = this.props;

    offlineRecharge(values).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['product.detail.recharge.upload.bill.success']
        });
        onClose();
      }
    });
  }

  render() {
    const { onClose } = this.props;

    return (
      <Modal onClose={onClose}>
        <Modal.Header>
          {i18n['dashbord.recharge.modal.charge.offline.submit.btn']}
        </Modal.Header>
        <Modal.Body className={cs['form']}>
          <OfflineRechargeForm
            onSubmit={this.onSave}
          ></OfflineRechargeForm>
        </Modal.Body>
        <Modal.Footer>
          <Button style="primary" onClick={this.onSubmit}>{i18n['product.detail.recharge.upload.bill.confirm']}</Button>
          <Button onClick={onClose}>{i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
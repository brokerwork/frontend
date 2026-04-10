import Modal from 'components/Modal';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import AddAccountForm from '../../../../containers/AddAccountForm';
import { ADD_ACCOUNT_FORM } from '../AddAccountForm';
export default class AddAccountModal extends PureComponent {
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(ADD_ACCOUNT_FORM);
  };
  onClose = () => {
    this.props.onClose();
  };
  render() {
    const { editData, savePlatSetting, plat, productId, getPlatSetting, showTopAlert, languages } = this.props;
    return (
      <Modal onClose={this.onClose}>
        <Modal.Header>
          {
            i18n[
              editData
                ? 'trader.plat.setting.open_account.simulation.editmodal.title'
                : 'trader.plat.setting.open_account.simulation.addmodal.title'
            ]
          }
        </Modal.Header>
        <Modal.Body>
          <AddAccountForm
            editData={editData}
            savePlatSetting={savePlatSetting}
            plat={plat}
            productId={productId}
            getPlatSetting={getPlatSetting}
            onClose={this.onClose}
            showTopAlert={showTopAlert}
            languages={languages}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button style="primary" onClick={this.onSave}>
            {i18n['general.save']}
          </Button>
          <Button onClick={this.onClose}> {i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

import Modal from 'components/Modal';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import EditNavForm from '../EditNavForm';
import { EDIT_NAV_FORM } from '../EditNavForm';
export default class EditNavModal extends PureComponent {
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(EDIT_NAV_FORM);
  };
  onClose = () => {
    this.props.onClose();
  };
  render() {
    const { showTopAlert, editMenu, editData, getMenuList } = this.props;
    return (
      <Modal onClose={this.onClose}>
        <Modal.Header>{i18n['twapp.brand_setting.custom_nav.edit']}</Modal.Header>
        <Modal.Body>
          <EditNavForm
            onClose={this.onClose}
            showTopAlert={showTopAlert}
            onSubmit={editMenu}
            editData={editData}
            getMenuList={getMenuList}
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

import Modal from 'components/Modal';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import AddNavForm from '../AddNavForm';
import { ADD_NAV_FORM } from '../AddNavForm';
export default class AddNavModal extends PureComponent {
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(ADD_NAV_FORM);
  };
  onClose = () => {
    this.props.onClose();
  };
  render() {
    const { showTopAlert, addMenu, platForm, getMenuList } = this.props;
    return (
      <Modal onClose={this.onClose}>
        <Modal.Header>{i18n['twapp.brand_setting.custom_nav.add']}</Modal.Header>
        <Modal.Body>
          <AddNavForm
            onClose={this.onClose}
            showTopAlert={showTopAlert}
            onSubmit={addMenu}
            platForm={platForm}
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

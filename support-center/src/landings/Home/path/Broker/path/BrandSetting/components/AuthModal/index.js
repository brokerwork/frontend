import Modal from 'components/Modal';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import AuthForm from '../AuthForm';
import { AUTH_FORM } from '../AuthForm';
export default class AuthModal extends PureComponent {
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(AUTH_FORM);
  };
  onClose = () => {
    this.props.onClose();
  };
  render() {
    const { showTopAlert, editMenu, editData, getMenuList, roleList, menuList } = this.props;
    return (
      <Modal onClose={this.onClose}>
        <Modal.Header>{i18n['twapp.brand_setting.custom_nav.edit']}</Modal.Header>
        <Modal.Body>
          <AuthForm
            onClose={this.onClose}
            showTopAlert={showTopAlert}
            onSubmit={editMenu}
            editData={editData}
            getMenuList={getMenuList}
            roleList={roleList}
            menuList={menuList}
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

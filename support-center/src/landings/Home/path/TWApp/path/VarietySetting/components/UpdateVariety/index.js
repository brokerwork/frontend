import Button from 'components/Button';
import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import cs from './UpdateVariety.less';
import VarietyForm, { VARIETTY_FORM }  from '../Form/index.js';



export default class UpdateVariety extends PureComponent {
  onSave = () => {
    const { submitForm} = this.props;
    submitForm(VARIETTY_FORM);
  }
  onSubmit = (values) => {
    const {saveServerInfo, getServerInfo, showTopAlert, activeKey,  onClose} = this.props;
    Promise.resolve(saveServerInfo(values, activeKey)).then((res) => {
      if (res.result) {
        showTopAlert({
          content: i18n['general.modify_success'],
          style: 'success'
        });
        onClose();
        getServerInfo(activeKey);
      }
    });
  }

  render() {
    const { data, onClose} = this.props;

    return (
      <Modal onClose={onClose}>
        <Modal.Header>
          {i18n['twapp.variety_setting.form_title']}
        </Modal.Header>
        <Modal.Body>
          <VarietyForm 
          initialValues={data} 
          onSubmit={this.onSubmit}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button style="primary" onClick={this.onSave}>{i18n['app.btn.save']}</Button>
          <Button onClick={onClose}>{i18n['app.btn.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
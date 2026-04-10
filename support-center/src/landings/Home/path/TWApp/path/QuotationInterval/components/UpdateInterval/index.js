import Button from 'components/Button';
import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import cs from './UpdateInterval.less';
import VarietyIntervalForm, { VARIETTY_INTERVAL_FORM }  from './VarieryIntervalForm';



export default class UpdateInterval extends PureComponent {
  onSave = () => {
    const { submitForm} = this.props;
    submitForm(VARIETTY_INTERVAL_FORM);
  }
  onSubmit = (values) => {
    const {onSave} = this.props;
    onSave(values);
  }

  render() {
    const { data, onClose} = this.props;
    return (
      <Modal onClose={onClose}>
        <Modal.Header>
          {i18n['twapp.variety_setting.form_title']}
        </Modal.Header>
        <Modal.Body>
          <VarietyIntervalForm 
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
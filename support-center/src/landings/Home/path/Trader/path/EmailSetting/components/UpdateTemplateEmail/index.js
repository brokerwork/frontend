import Modal from 'components/Modal';
import TemplateEmail, { TEMPLATE_EMAIL_FORM } from '../Forms/TemplateEmail';
import Button from 'components/Button';
import i18n from 'utils/i18n';

export default class UpdateTemplateEmail extends PureComponent {
  parseEmailList = () => {
    const { emailList } = this.props;
    const copyData = [].concat(emailList);

    return copyData.map(item => {
      return {
        label: `${item.from} (${item.fromName})`,
        value: item.configId
      };
    });
  }

  onSubmit = (values) => {
    const { batchUpdateTemplateEmail, selectedTemplate, showTopAlert, onSave } = this.props;

    batchUpdateTemplateEmail(selectedTemplate, values.configId).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.modify_success']
        });
        onSave();
      }
    });
  }

  onSave = () => {
    const { submitForm } = this.props;

    submitForm(TEMPLATE_EMAIL_FORM);
  }

  render() {
    const { onClose } = this.props;
    const emailList = this.parseEmailList();

    return (
      <Modal onClose={onClose}>
        <Modal.Header>
          {i18n['email.setting.batch.email.modify']}
        </Modal.Header>
        <Modal.Body scrolling={false}>
          <TemplateEmail
            emailList={emailList}
            onSubmit={this.onSubmit}
          ></TemplateEmail>
        </Modal.Body>
        <Modal.Footer>
          <Button style="primary" onClick={this.onSave}>
            {i18n['general.apply']}
          </Button>
          <Button onClick={onClose}>
            {i18n['app.btn.cancel']}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
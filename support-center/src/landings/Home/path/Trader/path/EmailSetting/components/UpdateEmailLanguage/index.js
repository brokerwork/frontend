import Modal from 'components/Modal';
import Form from 'components/Form';
import Select from 'components/Select';
import Button from 'components/Button';
import i18n from 'utils/i18n';


export default class UpdateEmailLanguage extends PureComponent {
  state = {
    language: this.props.emailDefaultLanguage
  }

  onChange = (selected) => {
    this.setState({
      language: selected
    });
  }

  onSave = () => {
    const { updateEmailDefalutLanguage, showTopAlert, onSave } = this.props;
    const { language } = this.state;

    updateEmailDefalutLanguage(language).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.save_success']
        });
        onSave();
      }
    });
  }

  render() {
    const { languages, onClose } = this.props;
    const { language } = this.state;

    return (
      <Modal onClose={onClose}>
        <Modal.Header>
          {i18n['email.setting.template.language.setting']}
        </Modal.Header>
        <Modal.Body scrolling={false}>
          <Form>
            <Form.Item>
              <Form.Label>
                {i18n['email.setting.template.language.default']}：
              </Form.Label>
              <Form.Control>
                <Select
                  value={language} 
                  options={languages}
                  onChange={this.onChange}
                  ></Select>
              </Form.Control>
            </Form.Item>
          </Form>
          <span className="text-disabled">
            {i18n['email.setting.template.language.tips']}
          </span>
        </Modal.Body>
        <Modal.Footer>
          <Button style="primary" onClick={this.onSave}>{i18n['app.btn.confirm']}</Button>
          <Button onClick={onClose}>{i18n['app.btn.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
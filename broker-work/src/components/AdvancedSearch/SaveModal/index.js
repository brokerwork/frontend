import { Button } from 'react-bootstrap';
import Modal from 'components/Modal';
import i18n from 'utils/i18n';
import Tags from '../Tags';
import Form from 'components/Form';
import { FormControl } from 'react-bootstrap';

export default class TipsModal extends PureComponent {
  state = {
    value: ''
  };
  onChangeName = e => {
    const value = e.target.value;
    this.setState({
      value
    });
  };
  onSave = () => {
    const { onSave, showTopAlert } = this.props;
    const { value } = this.state;
    if (value && value.trim() !== '') {
      onSave(value);
    } else {
      showTopAlert({
        content: i18n['settings.conditions_setting.null_tips']
      });
    }
  };
  render() {
    const { onHide, disableValueConditions, data, logicType } = this.props;
    return (
      <Modal show={true}>
        <Modal.Header>
          <button type="button" className="close" onClick={onHide} />
          <Modal.Title id="tips-modal">
            {i18n['advanced_search.save_conditions']}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Item>
              <Form.Label required={true}>
                {' '}
                {i18n['advanced_search.form.template_name']}{' '}
              </Form.Label>
              <Form.Control>
                <FormControl
                  type="text"
                  required={true}
                  onChange={this.onChangeName}
                />
              </Form.Control>
            </Form.Item>
            <Form.Item>
              <Form.Label>
                {' '}
                {i18n['advanced_search.form.template_conditions']}{' '}
              </Form.Label>
              <Form.Control>
                <Tags
                  {...this.props}
                  data={data}
                  logicType={logicType}
                  readonly={true}
                  disableValueConditions={disableValueConditions}
                />
              </Form.Control>
            </Form.Item>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.onSave} bsStyle="primary">
            {i18n['tipsmodal.confirm']}
          </Button>
          <Button onClick={onHide} bsStyle="default">
            {i18n['tipsmodal.cancel']}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

import ApproveForm from '../../../containers/ApproveForm';
import { APPROVE_FORM } from './ApproveForm';
import { Button } from 'react-bootstrap';
import Modal from 'components/Modal';
import i18n from 'utils/i18n';

export default class ApproveModal extends Component {
  onSave = (info, type) => {
    const { submitApprove, showTopAlert, onSave } = this.props;

    submitApprove(info).then(res => {
      const { result } = res;

      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.deal_success']
        });

        if (onSave) {
          onSave(info, type);
        }
      }
    });
  };

  //保存数据
  onSubmit = () => {
    const { submitForm } = this.props;
    submitForm(APPROVE_FORM);
  };

  onCancel = () => {
    const { onHide } = this.props;
    if (onHide) onHide();
  };

  render() {
    const { show, onHide, initialValues } = this.props;
    return (
      <Modal backdrop="static" show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{i18n['customer.approve.title']}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-horizontal">
            <ApproveForm
              {...this.props}
              initialValues={initialValues}
              onSave={this.onSave}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.onSubmit}>
            {i18n['general.submit']}
          </Button>
          <Button onClick={this.onCancel}>{i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

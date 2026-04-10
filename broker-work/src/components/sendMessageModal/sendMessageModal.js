import Modal from 'components/Modal';
import Dropdown from 'components/Dropdown';
import { Button } from 'react-bootstrap';
import cs from './sendMessageModal.less';
import i18n from 'utils/i18n';
import { saveMessageObjects } from 'utils/sendMessageObject';

export default class SendMessageModal extends PureComponent {
  state = {
    selectedMessageType: {}
  };
  onSubmit = () => {
    const { selectedMessageObjects, type, showTopAlert } = this.props;
    const { selectedMessageType } = this.state;
    const toName = [];
    const toUserId = [];
    if (!selectedMessageType.value) {
      showTopAlert({
        content: i18n['general.send_message_tips']
      });
      return;
    }

    if (type === 'user') {
      for (let k in selectedMessageObjects) {
        toUserId.push(selectedMessageObjects[k]['pubUserId']);
        toName.push(selectedMessageObjects[k]['name']);
      }
    }

    if (type === 'customer') {
      for (let k in selectedMessageObjects) {
        toUserId.push(selectedMessageObjects[k]['customerId']);
        toName.push(selectedMessageObjects[k]['customName']);
      }
    }

    if (type === 'TwUser') {
      for (let k in selectedMessageObjects) {
        toUserId.push(selectedMessageObjects[k]['pubUserId']);
        toName.push(selectedMessageObjects[k]['realName']);
      }
    }

    const sendObject = {};
    sendObject['toName'] = toName;
    sendObject['toUserId'] = toUserId;
    sendObject['type'] = this.state.selectedMessageType.value;
    sendObject['toUserType'] =
      type === 'TwUser'
        ? 'TwUser'
        : type === 'customer' ? 'MyBwCustomer' : 'BwUser';
    saveMessageObjects(sendObject);
    const { history: { push } } = this.props;
    push('/msgmgmt/addMessage?type=' + selectedMessageType.value);
  };

  selectMessageType = v => {
    this.setState({
      selectedMessageType: v
    });
  };

  render() {
    const { onHide, messageTypes } = this.props;
    const { selectedMessageType } = this.state;
    return (
      <Modal show={true} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{i18n['general.send_message']}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={cs['message-select']}>
            <span className={cs['label']}>{`${i18n[
              'general.send_message_tips'
            ]}:`}</span>
            <Dropdown
              className={cs['message-select-dropdown']}
              data={messageTypes}
              value={selectedMessageType}
              onSelect={this.selectMessageType}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.onSubmit} bsStyle="primary">
            {i18n['general.confirm']}
          </Button>
          <Button onClick={onHide}>{i18n['general.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

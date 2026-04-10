// import Modal from 'components/Modal';
// import Dropdown from 'components/Dropdown';
// import { Button } from 'react-bootstrap';
import cs from './sendMessageModal.less';
import i18n from 'utils/i18n';
import { saveMessageObjects } from 'utils/sendMessageObject';
import { Button, Dropdown, Icon, Dialog, Input, Select } from 'lean-ui';

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
        : type === 'customer'
          ? 'MyBwCustomer'
          : 'BwUser';
    saveMessageObjects(sendObject);
    const {
      history: { push }
    } = this.props;
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
      <Dialog
        title={i18n['general.send_message']}
        visible={true}
        onCancel={onHide}
        onOk={this.onSubmit}
        okText={i18n['general.apply']}
        cancelText={i18n['general.cancel']}
      >
        <div className={cs['message-select']}>
          <div className={cs['label']}>{`${
            i18n['general.send_message_tips']
          }:`}</div>
          <div>
            <Select
              value={selectedMessageType && selectedMessageType.value}
              placeholder={i18n['general.default_select']}
              onSelect={value => {
                this.selectMessageType(
                  messageTypes.find(opt => opt.value == value)
                );
              }}
            >
              {messageTypes.map((item, idx) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Dialog>
    );
  }
}

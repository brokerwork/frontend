import { Dialog, Button, Select } from 'lean-ui';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import { saveMessageObjects } from 'utils/sendMessageObject';
import cs from './transferCustomer.less';
import _ from 'lodash';

const msgTypes = [
  {
    label: i18n['message.types.MAIL'],
    value: 'MAIL',
    right: 'sendMail'
  },
  {
    label: i18n['message.types.SMS'],
    value: 'SMS',
    right: 'sendSms'
  }
];

export default class SendMessageModal extends PureComponent {
  state = {
    msgType: ''
  };

  onSave = () => {
    const {
      showTopAlert,
      selectedAccountIds,
      showTipsModal,
      sendMsgCheck,
      currentServer,
      onHide
    } = this.props;
    const { msgType } = this.state;
    if (!msgType) {
      showTopAlert({
        content: i18n['general.send_message_tips']
      });
      return;
    }
    sendMsgCheck(selectedAccountIds, msgType, currentServer).then(
      ({ result, data }) => {
        if (result) {
          const { customerInfos, noContactInfoAccounts } = data;
          if (noContactInfoAccounts.length) {
            onHide();
            showTipsModal({
              content: (
                <div className={cs['content']}>
                  <FormattedMessage
                    id="account.sendMsg.tips"
                    defaultMessage={i18n['account.sendMsg.tips']}
                    values={{
                      accountIds: noContactInfoAccounts.reduce(
                        (a, b) => `${a},${b}`
                      )
                    }}
                  />
                </div>
              ),
              onConfirm: cb => {
                this.jumpToMsg(customerInfos, cb);
              }
            });
          } else {
            this.jumpToMsg(customerInfos);
          }
        }
      }
    );
  };

  jumpToMsg = (customerInfos, cb) => {
    const { msgType } = this.state;

    let toName = [];
    let toUserId = [];
    customerInfos.forEach(custom => {
      toUserId.push(custom.customerId);
      toName.push(custom.customName);
    });
    let sendObject = {};
    sendObject['toName'] = toName;
    sendObject['toUserId'] = toUserId;
    sendObject['type'] = msgType;
    sendObject['toUserType'] = 'MyBwCustomer';
    saveMessageObjects(sendObject);
    window.location.href = window.location.origin + '/msgmgmt/addMessage?type='+msgType;
    cb && cb();
  };

  typeSelect = val => {
    this.setState({
      msgType: val
    });
  };

  typesFilter = types => {
    const { filteredRights } = this.props;
    return msgTypes.filter(m => filteredRights[m.right]);
  };
  render() {
    const { onHide, visible } = this.props;
    const { msgType } = this.state;
    const messageTypes = this.typesFilter();
    return (
      <Dialog
        title={i18n['account.button.sendMsg']}
        visible={visible}
        onCancel={onHide}
        onOk={this.onSave}
        okText={i18n['general.apply']}
        cancelText={i18n['general.cancel']}
      >
        <div>{`${i18n['general.send_message_tips']}:`}</div>
        <Select value={msgType} onSelect={this.typeSelect.bind(this)}>
          {messageTypes.map(t => (
            <Select.Option value={t.value} key={t.value}>
              {t.label}
            </Select.Option>
          ))}
        </Select>
      </Dialog>
    );
  }
}

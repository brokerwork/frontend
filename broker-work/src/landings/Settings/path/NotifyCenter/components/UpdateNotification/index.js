import { Dialog } from 'lean-ui';
import UpdateNotificationForm, {
  UPDATE_NOTIFICATION_FORM
} from './UpdateNotificationForm';
import { NOTIFY_TASK_TYPE, NOTIFY_WAY } from '../../../../constant';
import i18n from 'utils/i18n';

export default class UpdateNotification extends PureComponent {
  onSave = () => {
    const { submitForm } = this.props;

    submitForm(UPDATE_NOTIFICATION_FORM);
  };

  onSubmit = values => {
    const { onSave } = this.props;
    let copyData = {};
    let roleGroup = [];
    values.roles.forEach(item => {
      roleGroup.push(item.value);
    });
    copyData['type'] = values.type;
    copyData['noticeType'] = values.noticeType;
    copyData['roles'] = roleGroup;
    onSave && onSave(copyData);
  };

  formatData = () => {
    const { systemSettings } = this.props;
    const rules = systemSettings.rules;
    let newTaskType = NOTIFY_TASK_TYPE.filter(el => {
      return el.value !== 'TRADER_MARGIN_LEVEL';
    });
    rules.forEach(item => {
      newTaskType = newTaskType.filter(ob => ob.value !== item.type);
    });
    return newTaskType;
  };

  formatEditData = () => {
    const { currentRule, roleOptions, type } = this.props;
    let copyData = {};
    if (type === 'Add') {
      copyData['noticeType'] = ['SystemMsg', 'Popup'];
    } else {
      const roleGroup = roleOptions.filter(item =>
        currentRule.roles.includes(`${item.value}`)
      );

      copyData['type'] = currentRule.type;
      copyData['noticeType'] = currentRule.noticeType;
      copyData['roles'] = roleGroup;
    }
    return copyData;
  };

  getNoticeWay = () => {
    const { systemSettings, vasSwitch } = this.props;
    const copyNoticeWay = [];
    NOTIFY_WAY.forEach(item => {
      if (['Email', 'SMS'].includes(item.value)) {
        if (
          item.value === 'Email' &&
          vasSwitch.EMAIL &&
          systemSettings.emailEnable
        ) {
          copyNoticeWay.push(item);
        }
        if (item.value === 'SMS' && vasSwitch.SMS && systemSettings.smsEnable) {
          copyNoticeWay.push(item);
        }
      } else {
        copyNoticeWay.push(item);
      }
    });
    return copyNoticeWay;
  };

  render() {
    const { onClose, type, roleOptions } = this.props;
    const ruleType = type === 'Add' ? this.formatData() : NOTIFY_TASK_TYPE;
    const initialValues = this.formatEditData();
    const notifyWay = this.getNoticeWay();
    return (
      <Dialog
        width={700}
        visible={true}
        okText={i18n['general.save']}
        cancelText={i18n['general.cancel']}
        onCancel={onClose}
        onOk={this.onSave}
        title={
          type === 'Add'
            ? i18n['settings.update_nofity.add_rule']
            : i18n['settings.update_nofity.edit_rule']
        }
      >
        <UpdateNotificationForm
          type={type}
          onSubmit={this.onSubmit}
          roleOptions={roleOptions}
          ruleType={ruleType}
          initialValues={initialValues}
          notifyWay={notifyWay}
        />
      </Dialog>
    );
  }
}

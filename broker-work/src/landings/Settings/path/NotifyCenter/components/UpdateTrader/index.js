import { Dialog } from 'lean-ui';
import i18n from 'utils/i18n';
import UpdateTraderFrom, { UPDATE_TRADER_FORM } from './UpdateTraderForm';
import SetScale from './SetScale';
import { NOTIFY_WAY } from '../../../../constant';

export default class UpdateTrader extends PureComponent {
  state = {
    showScaleModal: false
  };
  groupData = [];
  onSave = () => {
    this.props.submitForm(UPDATE_TRADER_FORM);
  };
  onSaveGroup = () => {
    let ref = this.refs.scale;
    if (ref.state.showInput) {
      this.props.showTopAlert({
        content: i18n['settings.notify_center.setScale.confirm']
      });
      return;
    }
    let groupData = [];
    for (let i in ref.state) {
      if (i.indexOf('_scale') !== -1) {
        let groupArr = i.split('_');
        groupData.push({
          serverId: groupArr[0],
          group: groupArr[1],
          ratio: ref.state[i]
        });
      }
    }
    this.groupData = groupData;
    this.setState({
      showScaleModal: false
    });
  };
  onSubmit = values => {
    let groupRatio = this.groupData.filter(el => !!el.ratio);
    const data = { ...values };
    const { ruleDetail = {} } = data;
    data.ruleDetail = { ...ruleDetail, groupRatio };
    if (
      data.type === 'TRADER_MARGIN_LEVEL' ||
      data.type === 'TRADER_OPEN_DEMO'
    ) {
      delete data.notificationFrequency;
    }
    this.props.onSave(data);
  };
  setScale = () => {
    this.props.getGroup().then(rs => {
      if (rs.result) {
        this.setState({
          showScaleModal: true
        });
      }
    });
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
      }
    });
    return copyNoticeWay;
  };

  getInitValues = values => {
    const data = { ...values };
    if (!data.notificationFrequency) {
      data.notificationFrequency = 'Once';
    }
    return data;
  };

  render() {
    const {
      onClose,
      visible,
      type,
      currentRule,
      serverGroup,
      existTypes
    } = this.props;
    const notifyWay = this.getNoticeWay();
    const initialValues = this.getInitValues(currentRule);
    let groupData = [];
    serverGroup.forEach(el => {
      el.groups.forEach(group => {
        groupData.push({
          serverName: el.serverName,
          serverId: el.serverId,
          group
        });
      });
    });
    return (
      <div>
        <Dialog
          width={700}
          visible={visible}
          okText={i18n['general.save']}
          cancelText={i18n['general.cancel']}
          onCancel={onClose}
          onOk={this.onSave}
          title={
            type === 'Add'
              ? i18n['settings.rebate_setting.add_rule']
              : i18n['settings.update_nofity.edit_rule']
          }
        >
          <UpdateTraderFrom
            initialValues={initialValues}
            onSubmit={this.onSubmit}
            isEdit={type === 'Edit'}
            setScale={this.setScale}
            existTypes={existTypes}
            notifyWay={notifyWay}
          />
        </Dialog>
        <Dialog
          width={700}
          visible={this.state.showScaleModal}
          okText={i18n['general.save']}
          cancelText={i18n['general.cancel']}
          onCancel={() => {
            this.setState({
              showScaleModal: false
            });
          }}
          onOk={this.onSaveGroup}
          title={i18n['settings.notify_center.setScale']}
        >
          <SetScale
            data={groupData}
            initialValues={currentRule.ruleDetail}
            ref="scale"
          />
        </Dialog>
      </div>
    );
  }
}

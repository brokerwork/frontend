import { Icon, Button, Table } from 'lean-ui';
import i18n from 'utils/i18n';
import cs from './Other.less';
import cs1 from '../RuleArea/RuleArea.less'
const TTd = Table.Td;
import { NOTIFY_WAY } from '../../../../constant';
export default class RuleArea extends PureComponent {
  columns = [
    { name: i18n['settings.notify_rule_area.header_type'], key: 'type' },
    { name: i18n['settings.update_nofity.rule_label'], key: 'rule' },
    { name: i18n['settings.update_nofity.notify_way'], key: 'noticeType' },
    { name: i18n['settings.update_nofity.status'], key: 'state' },
    { name: i18n['settings.notify_rule_area.header_action'], key: 'operation' }
  ];

  getNoticeType = data => {
    let noticeType = [];
    data &&
      data.forEach((item, index) => {
        noticeType.push(NOTIFY_WAY.find(ob => ob.value === item).label);
      });
    return noticeType.join(',');
  };
  toggle = (open, data) => {
    let { addRule, deleteRule, showTopAlert, showTipsModal } = this.props;
    if (open) {
      addRule(data);
    } else {
      showTipsModal({
        content: i18n['settings.update_nofity.confirm.ban'],
        onConfirm: cb => {
          deleteRule(data).then(res => {
            if (res.result) {
              showTopAlert({
                bsStyle: 'success',
                content: i18n['general.disabled_success']
              });
              cb();
            }
          });
        }
      });
    }
  };
  renderCell = ({ key, data, rowData, listData }) => {
    let content = '';
    switch (key) {
      case 'type':
        content = i18n['settings.notify_task_type.revist'];
        break;
      case 'noticeType':
        content = this.getNoticeType(rowData.noticeType);
        break;
      case 'state':
        content =
          rowData[key] === 'open'
            ? i18n['general.enable']
            : i18n['runmgmt.app_content.column.mark_disabled'];
        break;
      case 'operation':
        content = (
          <div>
            {rowData['state'] === 'open' ? (
              <Icon
                className={`${cs['operationIcon']} main-color`}
                title={i18n['settings.link_setting.status_actived_btn']}
                fontType="bw"
                icon="disabled-outline"
                onClick={this.toggle.bind(this, false, rowData)}
              />
            ) : (
              <Icon
                className={`${cs['operationIcon']} main-color`}
                title={i18n['settings.link_setting.status_disabled_btn']}
                fontType="bw"
                icon="enable"
                onClick={this.toggle.bind(this, true, rowData)}
              />
            )}
          </div>
        );
        break;
      default:
        content = rowData[key];
    }
    return <Table.Td>{content}</Table.Td>;
  };
  render() {
    let {
      systemSettings: { rules = [], emailEnable, smsEnable }
    } = this.props;
    let data = rules.filter(el => {
      return el.type === 'CUSTOMER_REVISIT';
    });

    if (!!data.length) {
      data[0].state = 'open';
      data[0].rule = i18n['settings.notify_task_type.revist.info'];
    } else {
      data[0] = {
        type: 'CUSTOMER_REVISIT',
        rule: i18n['settings.notify_task_type.revist.info'],
        noticeType: [],
        state: 'close'
      };
      if (emailEnable) {
        data[0].noticeType.push('Email');
      }
    }

    return (
      <div className={cs1['panel']}>
        <div className={cs1['header']}>
          {i18n['settings.notify_task_type.other']}
        </div>
        <div className={cs1['body']}>
          <Table
            className={cs['table']}
            data={data}
            columns={this.columns}
            renderCell={this.renderCell}
          />
        </div>
      </div>
    );
  }
}

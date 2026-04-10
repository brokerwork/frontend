import { Button, Switch, Table, Tooltip, Icon } from 'lean-ui';
import cs from './RuleArea.less';
import i18n from 'utils/i18n';
import UpdateRule from '../../containers/UpdateRule';
import { FormattedMessage } from 'react-intl';
import {
  NOTIFY_TASK_CONTENT,
  NOTIFY_TASK_TYPE,
  SCOPE,
  NOTIFY_WAY,
  NOTIFY_WAY_TASK_OPTION,
  NOTIFY_RESULT_TASK_OPTION
} from '../../constant';
const TTh = Table.TTh;
export default class RuleArea extends PureComponent {
  state = {
    showUpdateRuleModal: false,
    currentRule: {}
  };
  componentWillMount() {
    const { getSubUserTree, userRights } = this.props;
    if (userRights['CUSTOMER_SELECT_SUBORDINATE']) {
      getSubUserTree();
    }
  }
  toggleModal = (toggle, item) => {
    this.setState({
      showUpdateRuleModal: toggle,
      currentRule: item
    });
  };

  onSwitch = data => {
    const { setPersonalSwtich, showTopAlert, getPersonalRule } = this.props;
    if (!data.disabled) {
      setPersonalSwtich(data.type).then(res => {
        if (res.result) {
          showTopAlert({
            bsStyle: 'success',
            content: i18n['general.modify_success']
          });
          getPersonalRule();
        }
      });
    } else {
      showTopAlert({
        content: i18n['settings.self_notify.data_report.switch_warning']
      });
    }
  };
  //需要根据系统设置的noticeType和当前用户个人通知的noticeType取交集
  getNoticeType = data => {
    const { systemSettings } = this.props;
    const originNoticeType = data.noticeType && data.noticeType;
    const systemNoticeType =
      systemSettings.rules &&
      systemSettings.rules.find(ob => ob.type === data.type).noticeType;
    let noticeType = [];
    originNoticeType.forEach((item, index) => {
      if (!(systemNoticeType && systemNoticeType.includes(item))) return;
      let copyItem = NOTIFY_WAY.find(ob => ob.value === item);
      noticeType.push(copyItem.label);
    });
    return noticeType.join(',');
  };

  saveRule = data => {
    const { setRulesettings, showTopAlert, getPersonalRule } = this.props;
    setRulesettings(data).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.save_success']
        });
        this.toggleModal(false, undefined);
        getPersonalRule();
      }
    });
  };
  getTaskType = (data = []) => {
    let taskType = [];
    if (data.length > 0 || data[0] !== '') {
      data.forEach((item, index) => {
        let taskItem = NOTIFY_WAY_TASK_OPTION.find(
          ob => `${ob.value}` === `${item}`
        );
        taskType.push(taskItem && taskItem.label);
      });
    }
    return taskType.join(',');
  };
  //根据客户查看范围过滤客户范围选项和表格展示内容
  getRightScope = () => {
    const { userRights } = this.props;
    const copyScope = [];
    SCOPE.forEach(item => {
      if (item.default) {
        copyScope.push(item);
      }
      if (userRights[item.right]) {
        copyScope.push(item);
      }
    });
    return copyScope;
  };
  getScope = scopes => {
    let copyScope = [];
    const rightScope = this.getRightScope();
    scopes &&
      scopes.forEach((item, index) => {
        let scope =
          rightScope.find(ob => `${ob.value}` === `${item}`) &&
          rightScope.find(ob => `${ob.value}` === `${item}`);
        if (scope) {
          copyScope.push(scope.label);
        }
      });

    return copyScope.join(',');
  };
  _renderTableRow = (item, idx) => {
    const ruleType = NOTIFY_TASK_TYPE.find(
      ob => `${ob.value}` === `${item.type}`
    ).label;
    const scopes = this.getScope(item.scope && item.scope);
    const noticeType = this.getNoticeType(item);
    return {
      switch: item,
      type: ruleType,
      rule: item,
      report: scopes,
      notify: noticeType,
      header: item
    };
  };
  renderCell = ({ key, data, index }) => {
    const Td = Table.Td;
    if (key === 'rule') {
      const taskType =
        data.type === 'TASK_HANDLE'
          ? this.getTaskType(data.rule && data.rule)
          : undefined;
      return (
        <Td key={index}>
          <FormattedMessage
            id="settings.notify_task.withdrawal"
            defaultMessage={NOTIFY_TASK_CONTENT[data.type && data.type]}
            values={{
              amount:
                data.type === 'TASK_HANDLE' ? (
                  <span className={`${cs['amount-type']} main-color`}>
                    {taskType}
                  </span>
                ) : (
                  <span className={`${cs['amount-type']} main-color`}>
                    {Number(data.rule)}
                  </span>
                ),
              result:
                NOTIFY_RESULT_TASK_OPTION.find(
                  item => item.value === data.taskHandleType
                ) &&
                NOTIFY_RESULT_TASK_OPTION.find(
                  item => item.value === data.taskHandleType
                ).label
            }}
          />
        </Td>
      );
    } else if (key === 'header') {
      const haveNoticeType = data.noticeType && data.noticeType.length > 0;
      const haveCustomerRange = data.scope && data.scope.length > 0;
      const haveRules =
        data.type === 'TASK_HANDLE'
          ? data.rule && data.rule.length > 0 && data.rule[0] !== ''
          : data.rule.length > 0;
      data.disabled = !(haveNoticeType && haveCustomerRange && haveRules);
      return (
        <Td key={index}>
          <Icon
            className={`${cs['icon-edit']} main-color`}
            onClick={this.toggleModal.bind(this, true, data)}
            icon="edit-outline"
          />
          <Switch
            disabled={data.disabled}
            checked={data.enable}
            onChange={this.onSwitch.bind(this, data)}
          />
        </Td>
      );
    } else {
      return <Td key={index}>{data}</Td>;
    }
  };
  render() {
    const { showUpdateRuleModal, type, currentRule } = this.state;
    const { personalRules } = this.props;
    const rightScope = this.getRightScope();
    const columns = [
      {
        name: i18n['settings.notify_rule_area.header_type'],
        dataIndex: 'type',
        key: 'type'
      },
      {
        name: i18n['settings.update_nofity.rule_label'],
        dataIndex: 'rule',
        key: 'rule'
      },
      {
        name: i18n['settings.self_notify.data_report_customer_range'],
        dataIndex: 'report',
        key: 'report'
      },
      {
        name: i18n['settings.update_nofity.notify_way'],
        dataIndex: 'notify',
        key: 'notify'
      },
      {
        name: i18n['settings.notify_rule_area.header_action'],
        dataIndex: 'header',
        key: 'header'
      }
    ];
    const data = personalRules.map(this._renderTableRow);
    return (
      <div className={cs['notice']}>
        <div className={cs['add-rule-area']}>
          {i18n['settings.important_notify.real_time_notify']}
        </div>
        <Table
          columns={columns}
          data={data}
          renderCell={this.renderCell}
          renderHeadCell={({ item, index, fixed }) => {
            const { key, name } = item;
            if (key === 'report')
              return (
                <th>
                  {name}
                  <Tooltip
                    trigger="click"
                    placement="right"
                    title={i18n['settings.self_notify.data_report.range_tips']}
                  >
                    <Icon className={cs['icon']} icon="question" />
                  </Tooltip>
                </th>
              );
          }}
        />
        {showUpdateRuleModal ? (
          <UpdateRule
            onClose={this.toggleModal.bind(this, false, undefined)}
            currentRule={currentRule}
            onSave={this.saveRule}
            rightScope={rightScope}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
